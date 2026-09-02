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
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  const loadAttendance = async () => {
    try {
      setLoading(true);

      const res = await attendanceService.getAttendance();

      let data = res.attendance || [];

      if (search) {
        data = data.filter((item) =>
          item.employee?.name?.toLowerCase().includes(search.toLowerCase()),
        );
      }

      if (status) {
        data = data.filter((item) => item.status === status);
      }

      if (date) {
        data = data.filter((item) => {
          const attendanceDate = new Date(item.attendanceDate)
            .toISOString()
            .split("T")[0];

          return attendanceDate === date;
        });
      }

      setAttendance(data);

      if (!selectedEmployeeId && data.length) {
        setSelectedEmployeeId(data[0].employee?._id || "");
      }
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

  const handleSearch = (value) => setSearch(value);
  const handleStatusChange = (value) => setStatus(value);
  const handleDateChange = (value) => setDate(value);

  const handleView = (attendanceRecord) => {
    navigate(`/${role}/attendance/view/${attendanceRecord._id}`);
  };

  const handleDelete = async (attendanceRecord) => {
    const confirmDelete = window.confirm(
      "Delete this attendance record? This cannot be undone.",
    );

    if (!confirmDelete) return;

    try {
      await attendanceService.deleteAttendance(attendanceRecord._id);
      toast.success("Attendance record deleted successfully");
      loadAttendance();
    } catch (error) {
      console.error("Delete attendance error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete attendance",
      );
    }
  };

  const handleCheckOut = async (attendanceRecord) => {
    try {
      await attendanceService.checkOut(attendanceRecord._id);
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

  const employeeGroups = attendance.reduce((acc, item) => {
    const employeeId = item.employee?._id;

    if (!employeeId) return acc;

    if (!acc[employeeId]) {
      acc[employeeId] = {
        employee: item.employee,
        records: [],
      };
    }

    acc[employeeId].records.push(item);
    return acc;
  }, {});

  const groupedEmployees = Object.values(employeeGroups);
  const selectedEmployee = groupedEmployees.find(
    (group) => group.employee?._id === selectedEmployeeId,
  ) || groupedEmployees[0];

  const flaggedCount = attendance.filter(
    (item) => item.locationVerified === false,
  ).length;

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <div>
          <h2>Attendance</h2>
          <p>Employee attendance overview</p>
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

      <div className="attendance-employee-layout">
        <div className="employee-list-panel">
          <div className="employee-list-header">
            <h3>Employees</h3>
            <span>{groupedEmployees.length} records</span>
          </div>

          <div className="employee-list">
            {groupedEmployees.length > 0 ? (
              groupedEmployees.map((group) => {
                const totalHours = group.records.reduce(
                  (sum, item) => sum + Number(item.workingHours || 0),
                  0,
                );
                const totalOvertime = group.records.reduce(
                  (sum, item) => sum + Number(item.overtimeHours || 0),
                  0,
                );
                const presentCount = group.records.filter(
                  (item) => item.status === "Present",
                ).length;

                return (
                  <button
                    key={group.employee?._id}
                    type="button"
                    className={`employee-list-card ${
                      selectedEmployee?.employee?._id === group.employee?._id
                        ? "active"
                        : ""
                    }`}
                    onClick={() => setSelectedEmployeeId(group.employee?._id)}
                  >
                    <div className="employee-card-top">
                      <div>
                        <strong>{group.employee?.name}</strong>
                        <small>{group.employee?.employeeId}</small>
                      </div>
                      <span className="employee-attendance-count">
                        {group.records.length}
                      </span>
                    </div>

                    <div className="employee-meta">
                      <span>{group.employee?.department}</span>
                      <span>{presentCount} present</span>
                    </div>

                    <div className="employee-summary-row">
                      <div>
                        <label>Hours</label>
                        <strong>{totalHours.toFixed(1)}h</strong>
                      </div>
                      <div>
                        <label>OT</label>
                        <strong>{totalOvertime.toFixed(1)}h</strong>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="empty-state">No attendance records found.</div>
            )}
          </div>
        </div>

        <div className="employee-history-panel">
          {selectedEmployee ? (
            <>
              <div className="employee-history-header">
                <div>
                  <h3>{selectedEmployee.employee?.name}</h3>
                  <p>
                    {selectedEmployee.employee?.employeeId} · {selectedEmployee.employee?.department}
                  </p>
                </div>
                <span className="employee-history-total">
                  {selectedEmployee.records.length} records
                </span>
              </div>

              <div className="employee-record-list">
                {selectedEmployee.records.map((record) => (
                  <div key={record._id} className="employee-record-item">
                    <div className="record-summary">
                      <div>
                        <strong>
                          {new Date(record.attendanceDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </strong>
                        <small>
                          {record.site?.siteName || "No site"} · {record.status}
                        </small>
                      </div>
                      <span className={`status-badge ${record.status.toLowerCase().replace(" ", "-")}`}>
                        {record.status}
                      </span>
                    </div>

                    <div className="record-details">
                      <span>
                        In: {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--"}
                      </span>
                      <span>
                        Out: {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--"}
                      </span>
                      <span>Hours: {Number(record.workingHours || 0).toFixed(1)}h</span>
                      <span>OT: {Number(record.overtimeHours || 0).toFixed(1)}h</span>
                    </div>

                    <div className="record-actions">
                      <button type="button" onClick={() => handleView(record)}>
                        View
                      </button>
                      {!record.checkOut && (
                        <button type="button" onClick={() => handleCheckOut(record)}>
                          Check Out
                        </button>
                      )}
                      {(role === "owner" || role === "admin") && (
                        <button type="button" className="danger" onClick={() => handleDelete(record)}>
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state large">No employee records available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceList;
