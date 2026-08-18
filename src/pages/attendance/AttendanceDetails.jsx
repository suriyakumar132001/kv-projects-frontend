import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import attendanceService from "../../services/attendanceService";
import siteService from "../../services/siteService";

import "./Attendance.css";

const formatDateTimeLocal = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date - tzOffset).toISOString().slice(0, 16);
};

const parseDateTimeLocal = (value) => (value ? new Date(value) : null);

// Renders the coordinates pair, or "--" when either half is missing.
const formatCoords = (location) => {
  if (
    !location ||
    location.latitude === null ||
    location.latitude === undefined ||
    location.longitude === null ||
    location.longitude === undefined
  ) {
    return "--";
  }

  return `${location.latitude}, ${location.longitude}`;
};

const AttendanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [attendance, setAttendance] = useState(null);
  const [sites, setSites] = useState([]);
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    remarks: "",
    status: "",
    site: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const canEdit = role === "owner" || role === "admin";

  useEffect(() => {
    loadAttendance();
  }, [id]);

  const loadSites = async () => {
    try {
      const res = await siteService.getSites();
      setSites(res.sites || []);
    } catch (error) {
      // don't block attendance details if sites fail
    }
  };

  const loadAttendance = async () => {
    try {
      setLoading(true);

      if (canEdit) {
        await loadSites();
      }

      const res = await attendanceService.getAttendanceById(id);

      if (!res.attendance) {
        toast.error("Attendance record not found");
        navigate(`/${role}/attendance`);
        return;
      }

      setAttendance(res.attendance);
      setFormData({
        checkIn: formatDateTimeLocal(res.attendance.checkIn),
        checkOut: formatDateTimeLocal(res.attendance.checkOut),
        remarks: res.attendance.remarks || "",
        status: res.attendance.status || "",
        site: res.attendance.site?._id || "",
      });
    } catch (error) {
      toast.error("Unable to load attendance details");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        remarks: formData.remarks,
        status: formData.status,
        site: formData.site,
      };

      if (formData.checkIn) {
        payload.checkIn = formData.checkIn;
      }

      if (formData.checkOut) {
        payload.checkOut = formData.checkOut;
      }

      const res = await attendanceService.updateAttendance(id, payload);
      setAttendance(res.attendance);
      setEditMode(false);
      toast.success("Attendance updated successfully");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Unable to update attendance",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="attendance-details">
      <div className="details-card">
        <div className="details-card-header">
          <h2>Attendance Details</h2>
          {canEdit && !editMode && (
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Edit
            </button>
          )}
        </div>

        <div className="details-grid">
          <div>
            <label>Employee ID</label>
            <p>{attendance.employee?.employeeId}</p>
          </div>

          <div>
            <label>Employee Name</label>
            <p>{attendance.employee?.name}</p>
          </div>

          <div>
            <label>Department</label>
            <p>{attendance.employee?.department}</p>
          </div>

          <div>
            <label>Status</label>
            {editMode ? (
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Half Day">Half Day</option>
                <option value="Leave">Leave</option>
              </select>
            ) : (
              <p>{attendance.status}</p>
            )}
          </div>

          <div>
            <label>Attendance Date</label>
            <p>{new Date(attendance.attendanceDate).toLocaleDateString()}</p>
          </div>

          <div>
            <label>Check In</label>
            {editMode ? (
              <input
                type="datetime-local"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleFormChange}
              />
            ) : (
              <p>
                {attendance.checkIn
                  ? new Date(attendance.checkIn).toLocaleTimeString()
                  : "--"}
              </p>
            )}
          </div>

          <div>
            <label>Check Out</label>
            {editMode ? (
              <input
                type="datetime-local"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleFormChange}
              />
            ) : (
              <p>
                {attendance.checkOut
                  ? new Date(attendance.checkOut).toLocaleTimeString()
                  : "--"}
              </p>
            )}
          </div>

          <div>
            <label>Working Hours</label>
            <p>{attendance.workingHours} Hours</p>
          </div>

          <div>
            <label>Overtime</label>
            <p>{attendance.overtimeHours} Hours</p>
          </div>

          <div>
            <label>Site</label>
            {editMode ? (
              <select
                name="site"
                value={formData.site}
                onChange={handleFormChange}
              >
                <option value="">Select Site</option>
                {sites.map((site) => (
                  <option key={site._id} value={site._id}>
                    {site.siteName} - {site.projectName}
                  </option>
                ))}
              </select>
            ) : (
              <p>
                {attendance.site?.siteName || "--"}{" "}
                {attendance.site?.projectName
                  ? `- ${attendance.site.projectName}`
                  : ""}
              </p>
            )}
          </div>

          {/* ===========================================
              GPS Verification
              ===========================================
              Read-only in both view and edit mode — this
              reflects what actually happened at check-in
              time, so it isn't something to hand-edit like
              status or remarks.
              =========================================== */}

          <div>
            <label>Location Verification</label>

            {attendance.locationVerified === true && (
              <p className="location-status verified">
                ✅ Verified — within site geofence
              </p>
            )}

            {attendance.locationVerified === false && (
              <p className="location-status flagged">
                ⚠ Flagged
                {attendance.distanceFromSite != null &&
                  ` — ${attendance.distanceFromSite}m from registered site location`}
              </p>
            )}

            {(attendance.locationVerified === null ||
              attendance.locationVerified === undefined) && (
              <p className="location-status unchecked">
                Not checked — no site coordinates set, or GPS was unavailable at
                check-in
              </p>
            )}
          </div>

          <div>
            <label>Check-In Coordinates</label>
            <p>{formatCoords(attendance.checkInLocation)}</p>
          </div>

          <div>
            <label>Check-Out Coordinates</label>
            <p>{formatCoords(attendance.checkOutLocation)}</p>
          </div>

          <div className="full-width">
            <label>Remarks</label>
            {editMode ? (
              <textarea
                rows="4"
                name="remarks"
                value={formData.remarks}
                onChange={handleFormChange}
              />
            ) : (
              <p>{attendance.remarks || "No Remarks"}</p>
            )}
          </div>
        </div>

        <div className="attendance-detail-actions">
          <button
            className="back-btn"
            onClick={() => navigate(`/${role}/attendance`)}
          >
            Back
          </button>

          {editMode && (
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceDetails;
