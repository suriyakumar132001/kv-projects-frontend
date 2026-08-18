import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import attendanceService from "../../services/attendanceService";

import AttendanceToolbar from "../../components/attendance/AttendanceToolbar";
import AttendanceTable from "../../components/attendance/AttendanceTable";

import "./Attendance.css";

const AttendanceList = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  // ==========================
  // Load Attendance
  // ==========================
  const loadAttendance = async () => {
    try {
      setLoading(true);

      const res = await attendanceService.getAttendance();

      let data = res.attendance || [];

      // Search Filter
      if (search) {
        data = data.filter((item) =>
          item.employee?.name?.toLowerCase().includes(search.toLowerCase()),
        );
      }

      // Status Filter
      if (status) {
        data = data.filter((item) => item.status === status);
      }

      // Date Filter
      if (date) {
        data = data.filter((item) => {
          const attendanceDate = new Date(item.attendanceDate)
            .toISOString()
            .split("T")[0];

          return attendanceDate === date;
        });
      }

      setAttendance(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  useEffect(() => {
    loadAttendance();
  }, [search, status, date]);

  // ==========================
  // Search
  // ==========================
  const handleSearch = (value) => {
    setSearch(value);
  };

  // ==========================
  // Status Filter
  // ==========================
  const handleStatusChange = (value) => {
    setStatus(value);
  };

  // ==========================
  // Date Filter
  // ==========================
  const handleDateChange = (value) => {
    setDate(value);
  };

  // ==========================
  // View Attendance
  // ==========================
  const handleView = (attendance) => {
    navigate(`/${role}/attendance/view/${attendance._id}`);
  };

  // ==========================
  // Delete Attendance
  // ==========================
  const handleDelete = async (attendance) => {
    const confirmDelete = window.confirm(
      "Delete this attendance record? This cannot be undone.",
    );

    if (!confirmDelete) return;

    try {
      await attendanceService.deleteAttendance(attendance._id);

      toast.success("Attendance record deleted successfully");

      loadAttendance();
    } catch (error) {
      console.error("Delete attendance error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete attendance",
      );
    }
  };

  // ==========================
  // Check Out
  // ==========================
  const handleCheckOut = async (attendance) => {
    try {
      await attendanceService.checkOut(attendance._id);

      toast.success("Employee Checked Out Successfully");

      loadAttendance();
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Check Out Failed");
    }
  };

  if (loading) {
    return <h2>Loading Attendance...</h2>;
  }

  // Count of currently-loaded (i.e. filtered) records flagged as outside
  // the site geofence. Computed client-side from what's already loaded —
  // no extra API call needed, and it naturally respects the active
  // search/status/date filters.
  const flaggedCount = attendance.filter(
    (item) => item.locationVerified === false,
  ).length;

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <div>
          <h2>Attendance</h2>
          <p>Manage employee attendance</p>
        </div>

        {flaggedCount > 0 && (
          <div
            className="location-flag-summary"
            title="Check-ins recorded outside the site's registered geofence"
          >
            ⚠ {flaggedCount} flagged check-in{flaggedCount > 1 ? "s" : ""}
          </div>
        )}
      </div>

      <AttendanceToolbar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={handleStatusChange}
        date={date}
        setDate={handleDateChange}
        onSearch={handleSearch}
        onRefresh={loadAttendance}
        onMarkAttendance={() => navigate(`/${role}/attendance/mark`)}
        canMarkAttendance={role !== "owner"}
      />

      <AttendanceTable
        attendance={attendance}
        onView={handleView}
        onCheckOut={handleCheckOut}
        onDelete={handleDelete}
        canDelete={role === "owner" || role === "admin"}
      />
    </div>
  );
};

export default AttendanceList;
