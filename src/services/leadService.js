// ===============================================
// KV Projects ERP
// Lead Service (Sales & CRM pipeline)
// ===============================================

import api from "./api";

const leadService = {
  // =============================================
  // Get All Leads
  // (optional params: { stage, assignedTo })
  // =============================================

  getLeads: async (params = {}) => {
    const response = await api.get("/leads", { params });
    return response.data;
  },

  // =============================================
  // Get Single Lead
  // =============================================

  getLead: async (id) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  // =============================================
  // Create Lead
  // =============================================

  createLead: async (data) => {
    const response = await api.post("/leads", data);
    return response.data;
  },

  // =============================================
  // Update Lead
  // =============================================

  updateLead: async (id, data) => {
    const response = await api.put(`/leads/${id}`, data);
    return response.data;
  },

  // =============================================
  // Move Lead to a New Stage (Kanban drag/drop or buttons)
  // =============================================

  updateStage: async (id, data) => {
    const response = await api.put(`/leads/${id}/stage`, data);
    return response.data;
  },

  // =============================================
  // Add a Follow-up Note
  // =============================================

  addNote: async (id, data) => {
    const response = await api.post(`/leads/${id}/notes`, data);
    return response.data;
  },

  // =============================================
  // Convert Lead to Client
  // =============================================

  convertToClient: async (id, data = {}) => {
    const response = await api.post(`/leads/${id}/convert`, data);
    return response.data;
  },

  // =============================================
  // Delete Lead
  // =============================================

  deleteLead: async (id) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  },
};

export default leadService;
