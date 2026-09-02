import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import attendanceService from "../../services/attendanceService";
import employeeService from "../../services/employeeService";
import siteService from "../../services/siteService";
import FaceCapture from "../../components/FaceCapture";
import LocationMap from "../../components/LocationMap";

import "./Attendance.css";

const MarkAttendance = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();
  const isSelfCheckIn =
    role === "admin" || role === "hr" || role === "siteengineer";

  const [employees, setEmployees] = useState([]);
  const [sites, setSites] = useState([]);
  const [myEmployee, setMyEmployee] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(isSelfCheckIn);

  const [formData, setFormData] = useState({
    employee: "",
    site: "",
    remarks: "",
  });

  // Full site doc for whatever's currently selected — used only to draw
  // the geofence circle in the map preview below. The actual
  // verification never trusts anything computed here; that's the
  // backend's job (see verifyLocation() in attendanceController.js).
  const selectedSite = sites.find((site) => site._id === formData.site);

  const [loading, setLoading] = useState(false);

  // =======================================
  // GPS Verification
  // =======================================
  //
  // Captured only when the Site Engineer explicitly taps "Turn On
  // Location" below — not automatically on page load. Once captured
  // it's held here and sent along with Check In, same as before.
  // Purely informational to the user — never blocks Check In. The
  // backend treats a missing/denied location the same way: it just
  // skips verification (locationVerified: null) instead of failing.
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    status: "idle", // idle | locating | done | denied | unsupported
  });

  const handleTurnOnLocation = () => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({ ...prev, status: "unsupported" }));
      return;
    }

    setLocation((prev) => ({ ...prev, status: "locating" }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          status: "done",
        });
      },
      () => {
        setLocation((prev) => ({ ...prev, status: "denied" }));
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  // =======================================
  // Face Verification
  // =======================================
  //
  // Also optional — see FaceCapture/faceApiLoader. If skipped or if
  // no face is captured, faceDescriptor stays null and the backend
  // simply skips face verification (faceVerified: null) for this
  // check-in rather than rejecting it.
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [faceSkipped, setFaceSkipped] = useState(false);
  // See checkBlinkLiveness in faceApiLoader.js for exactly what this
  // does/doesn't guarantee — basic anti-photo signal, not strong
  // liveness security. null = not run, true/false = blink outcome.
  const [livenessVerified, setLivenessVerified] = useState(null);

  useEffect(() => {
    if (isSelfCheckIn) {
      loadMyEmployee();
    } else {
      loadEmployees();
    }

    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      const res = await siteService.getSites();
      const siteOptions = res.sites || [];
      setSites(siteOptions);

      if (siteOptions.length && !formData.site) {
        setFormData((prev) => ({ ...prev, site: siteOptions[0]._id }));
      }
    } catch (error) {
      toast.error("Unable to load sites");
    }
  };

  // Admin, HR, and Site Engineers only ever check themselves in — load their own
  // linked employee profile instead of a full picker.
  const loadMyEmployee = async () => {
    try {
      setLoadingProfile(true);
      const res = await employeeService.getMyEmployee();
      setMyEmployee(res.employee);
      setFormData((prev) => ({ ...prev, employee: res.employee._id }));
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "No employee profile is linked to your account. Contact your Admin/Managing Director.",
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const res = await employeeService.getEmployees({
        page: 1,
        limit: 100,
      });

      setEmployees(res.employees || []);
    } catch (error) {
      toast.error("Unable to load employees");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.employee) {
      return toast.error(
        isSelfCheckIn
          ? "No employee profile linked to your account"
          : "Please select employee",
      );
    }

    const payload = {
      ...formData,
      latitude: location.latitude,
      longitude: location.longitude,
      faceDescriptor,
      livenessVerified,
    };

    if (isSelfCheckIn && !payload.site && sites.length) {
      payload.site = sites[0]._id;
    }

    if (!payload.site && sites.length) {
      return toast.error("Please select a site");
    }

    try {
      setLoading(true);

      console.debug("MarkAttendance payload:", payload);

      const res = await attendanceService.checkIn(payload);

      console.debug("MarkAttendance response:", res);

      toast.success("Attendance marked successfully");

      navigate(`/${role}/attendance`);
    } catch (error) {
      console.error("MarkAttendance error:", error);
      toast.error(error.response?.data?.message || "Attendance failed");
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return <h2>Loading your profile...</h2>;
  }

  return (
    <div className="attendance-form-page">
      <div className="attendance-form-card">
        <h2>Mark Attendance</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Employee</label>

            {isSelfCheckIn ? (
              myEmployee ? (
                <input
                  type="text"
                  value={`${myEmployee.employeeId} - ${myEmployee.name}`}
                  disabled
                  readOnly
                />
              ) : (
                <p style={{ color: "#b91c1c", margin: 0 }}>
                  No employee profile linked to your account. Contact your
                  Admin/Managing Director.
                </p>
              )
            ) : (
              <select
                name="employee"
                value={formData.employee}
                onChange={handleChange}
              >
                <option value="">Select Employee</option>

                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.employeeId} - {emp.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label>Site</label>

            {sites.length ? (
              <select
                name="site"
                value={formData.site}
                onChange={handleChange}
                disabled={isSelfCheckIn && sites.length === 1}
              >
                <option value="">Select Site</option>

                {sites.map((site) => (
                  <option key={site._id} value={site._id}>
                    {site.siteName} - {site.projectName}
                  </option>
                ))}
              </select>
            ) : (
              <p style={{ color: "#b91c1c", margin: 0 }}>
                No site is assigned to your account. Contact your Admin/Managing Director.
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Remarks</label>

            <textarea
              rows="4"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Enter remarks"
            />
          </div>

          {/* Verification */}
          <div className="form-group verification-section">
            <label>Verification</label>

            <div className="location-capture">
              {location.status === "idle" && (
                <button
                  type="button"
                  className="face-enrollment-btn"
                  onClick={handleTurnOnLocation}
                >
                  Turn On Location
                </button>
              )}

              {location.status === "locating" && (
                <p className="location-status">Detecting your location…</p>
              )}

              {location.status === "done" && (
                <>
                  <span className="face-enrollment-badge enrolled">
                    Location captured
                  </span>
                  <button
                    type="button"
                    className="face-enrollment-btn"
                    onClick={handleTurnOnLocation}
                  >
                    Update Location
                  </button>

                  <LocationMap
                    latitude={location.latitude}
                    longitude={location.longitude}
                    siteLatitude={selectedSite?.latitude ?? null}
                    siteLongitude={selectedSite?.longitude ?? null}
                    siteRadius={selectedSite?.geofenceRadius}
                  />
                </>
              )}

              {location.status === "denied" && (
                <>
                  <p className="location-status">
                    Location permission denied — continuing without GPS
                    verification.
                  </p>
                  <button
                    type="button"
                    className="face-enrollment-btn"
                    onClick={handleTurnOnLocation}
                  >
                    Try Again
                  </button>
                </>
              )}

              {location.status === "unsupported" && (
                <p className="location-status">
                  Location not supported on this device — continuing without GPS
                  verification.
                </p>
              )}
            </div>

            {faceDescriptor ? (
              <div className="face-capture-summary">
                <span className="face-enrollment-badge enrolled">
                  Face captured
                </span>
                <button
                  type="button"
                  className="face-enrollment-btn"
                  onClick={() => setFaceDescriptor(null)}
                >
                  Recapture
                </button>
              </div>
            ) : faceSkipped ? (
              <div className="face-capture-summary">
                <span className="face-enrollment-badge not-enrolled">
                  Face verification skipped
                </span>
                <button
                  type="button"
                  className="face-enrollment-btn"
                  onClick={() => setFaceSkipped(false)}
                >
                  Capture Now
                </button>
              </div>
            ) : (
              <FaceCapture
                captureLabel="Verify Face"
                helperText="Optional — center your face in the frame and click capture."
                requireLiveness
                onCapture={(descriptor, liveness) => {
                  setFaceDescriptor(descriptor);
                  setLivenessVerified(liveness);
                }}
                onCancel={() => setFaceSkipped(true)}
              />
            )}
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(`/${role}/attendance`)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={loading || (isSelfCheckIn && !myEmployee)}
            >
              {loading ? "Saving..." : "Check In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarkAttendance;
