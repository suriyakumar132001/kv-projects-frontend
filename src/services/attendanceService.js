import api from "./api";

const attendanceService = {
  // ==========================
  // Get All Attendance
  // ==========================
  getAttendance: async () => {
    const response = await api.get("/attendance");
    return response.data;
  },

  // ==========================
  // Get Single Attendance
  // (Temporary - until backend API exists)
  // ==========================
  getAttendanceById: async (id) => {
    const response = await api.get("/attendance");

    const attendance = response.data.attendance.find(
      (item) => item._id === id
    );

    return {
      success: true,
      attendance,
    };
  },

  // ==========================
  // Employee Check In
  // ==========================
  checkIn: async (data) => {
    const response = await api.post("/attendance/checkin", data);
    return response.data;
  },

  // ==========================
  // Employee Check Out
  // ==========================
  checkOut: async (id) => {
    const response = await api.put(`/attendance/checkout/${id}`);
    return response.data;
  },
};

export default attendanceService;