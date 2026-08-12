// ===============================================
// KV Projects ERP
// Material Issue Service
// ===============================================
//
// NOTE: Mirrors materialService.js. IMPORTANT: fix the import
// path below to match your real axios instance (see
// materialService.js for the correct path) before this
// file will resolve.

import api from "./api";

const materialIssueService = {
  // Get all material issues
  getMaterialIssues: async () => {
    const response = await api.get("/material-issues");
    return response.data;
  },

  // Get a single material issue by id
  getMaterialIssueById: async (id) => {
    const response = await api.get(`/material-issues/${id}`);
    return response.data;
  },

  // Create a new material issue
  createMaterialIssue: async (payload) => {
    const response = await api.post("/material-issues", payload);
    return response.data;
  },

  // Update an existing material issue
  updateMaterialIssue: async (id, payload) => {
    const response = await api.put(`/material-issues/${id}`, payload);
    return response.data;
  },

  // Delete a material issue
  deleteMaterialIssue: async (id) => {
    const response = await api.delete(`/material-issues/${id}`);
    return response.data;
  },
};

export default materialIssueService;
