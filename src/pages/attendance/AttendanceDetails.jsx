import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import attendanceService from "../../services/attendanceService";

import "./Attendance.css";

const AttendanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);

      const res = await attendanceService.getAttendance();

      const record = res.attendance.find((item) => item._id === id);

      if (!record) {
        toast.error("Attendance record not found");
        navigate(`/${role}/attendance`);
        return;
      }

      setAttendance(record);
    } catch (error) {
      toast.error("Unable to load attendance details");
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

        <h2>Attendance Details</h2>

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
            <p>{attendance.status}</p>
          </div>

          <div>
            <label>Attendance Date</label>
            <p>
              {new Date(attendance.attendanceDate).toLocaleDateString()}
            </p>
          </div>

          <div>
            <label>Check In</label>
            <p>
              {attendance.checkIn
                ? new Date(attendance.checkIn).toLocaleTimeString()
                : "--"}
            </p>
          </div>

          <div>
            <label>Check Out</label>
            <p>
              {attendance.checkOut
                ? new Date(attendance.checkOut).toLocaleTimeString()
                : "--"}
            </p>
          </div>

          <div>
            <label>Working Hours</label>
            <p>{attendance.workingHours} Hours</p>
          </div>

          <div>
            <label>Overtime</label>
            <p>{attendance.overtimeHours} Hours</p>
          </div>

          <div className="full-width">
            <label>Remarks</label>
            <p>{attendance.remarks || "No Remarks"}</p>
          </div>

        </div>

        <button
          className="back-btn"
          onClick={() => navigate(`/${role}/attendance`)}
        >
          Back
        </button>

      </div>

    </div>
  );
};

export default AttendanceDetails;