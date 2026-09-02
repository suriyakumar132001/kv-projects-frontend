import api from "./api";

const employeeService = {
  // Get all employees
  getEmployees: async (params) => {
    const response = await api.get("/employees", { params });
    return response.data;
  },

  // Get single employee
  getEmployee: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // Get my own linked employee profile (used by Site Engineer's
  // self-only Mark Attendance screen)
  getMyEmployee: async () => {
    const response = await api.get("/employees/me");
    return response.data;
  },

  // Create employee
  createEmployee: async (data) => {
    const response = await api.post("/employees", data);
    return response.data;
  },

  // Create employee WITH login access — the merged flow. Hits
  // /auth/register (creates the User + auto-provisions the linked
  // Employee in one step) instead of the Employee-only endpoint above.
  // Use this when the "Create login access" toggle is on in
  // AddEmployee.jsx; use createEmployee when it's off.
  registerEmployee: async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  // Update employee
  updateEmployee: async (id, data) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  // Delete employee
  deleteEmployee: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  // Enroll / re-enroll face (descriptor captured client-side via FaceCapture)
  enrollFace: async (id, descriptor) => {
    const response = await api.put(`/employees/${id}/face`, { descriptor });
    return response.data;
  },

  // Remove enrolled face
  removeFace: async (id) => {
    const response = await api.delete(`/employees/${id}/face`);
    return response.data;
  },

  // Upload / replace profile photo — file must be a File/Blob from an
  // <input type="file">. Same multipart convention as dprService.js.
  uploadPhoto: async (id, file) => {
    const formData = new FormData();
    formData.append("photo", file);

    const response = await api.post(`/employees/${id}/photo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Remove profile photo
  removePhoto: async (id) => {
    const response = await api.delete(`/employees/${id}/photo`);
    return response.data;
  },
};

export default employeeService;
