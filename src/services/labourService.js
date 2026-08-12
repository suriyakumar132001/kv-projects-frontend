// ===============================================
// KV Projects ERP
// Labour Service
// ===============================================
//
// NOTE: This mirrors the pattern used by materialService.js
// (an axios instance imported from a shared "api" module, and
// REST calls returning response.data). Adjust the import path
// below and the endpoint names ("/labours") if your backend
// uses something different (e.g. "/labour" or "/labourers").

import api from "./api";

const labourService = {
  // Get all labour records
  getLabours: async () => {
    const response = await api.get("/labours");
    return response.data;
  },

  // Get a single labour record by id
  getLabourById: async (id) => {
    const response = await api.get(`/labours/${id}`);
    return response.data;
  },

  // Create a new labour record
  createLabour: async (payload) => {
    const response = await api.post("/labours", payload);
    return response.data;
  },

  // Update an existing labour record
  updateLabour: async (id, payload) => {
    const response = await api.put(`/labours/${id}`, payload);
    return response.data;
  },

  // Delete a labour record
  deleteLabour: async (id) => {
    const response = await api.delete(`/labours/${id}`);
    return response.data;
  },
};

export default labourService;
