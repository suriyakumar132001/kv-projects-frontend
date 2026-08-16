// ===============================================
// KV Projects ERP
// Material Request Service
// ===============================================

import api from "./api";

const materialRequestService = {
  // =============================================
  // Get All Requests
  // (optional params: { status, site })
  // =============================================

  getRequests: async (params = {}) => {
    const response = await api.get("/material-requests", {
      params,
    });

    return response.data;
  },

  // =============================================
  // Get Single Request
  // =============================================

  getRequest: async (id) => {
    const response = await api.get(`/material-requests/${id}`);

    return response.data;
  },

  // =============================================
  // Create Request
  // =============================================

  createRequest: async (data) => {
    const response = await api.post("/material-requests", data);

    return response.data;
  },

  // =============================================
  // Approve / Reject Request
  // status must be "Approved" or "Rejected"
  // =============================================

  updateStatus: async (id, data) => {
    const response = await api.put(`/material-requests/${id}/status`, data);

    return response.data;
  },

  // =============================================
  // Convert an Approved Request into a Purchase Order
  // =============================================

  convertToPO: async (id, data) => {
    const response = await api.post(
      `/material-requests/${id}/convert-to-po`,
      data,
    );

    return response.data;
  },
};

export default materialRequestService;
