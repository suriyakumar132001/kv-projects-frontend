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
  // ==========================
  getAttendanceById: async (id) => {
    const response = await api.get(`/attendance/${id}`);
    return response.data;
  },

  // ==========================
  // Update Attendance
  // ==========================
  updateAttendance: async (id, data) => {
    const response = await api.put(`/attendance/${id}`, data);
    return response.data;
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

  // ==========================
  // Delete Attendance
  // ==========================
  deleteAttendance: async (id) => {
    const response = await api.delete(`/attendance/${id}`);
    return response.data;
  },
};

export default attendanceService;