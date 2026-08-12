// ===============================================
// KV Projects ERP
// Site Service
// ===============================================

import api from "./api";

const siteService = {
  // =============================================
  // Get All Sites
  // =============================================

  getSites: async () => {
    const response = await api.get("/sites");

    return response.data;
  },

  // =============================================
  // Get Single Site
  // =============================================

  getSite: async (id) => {
    const response = await api.get(`/sites/${id}`);

    return response.data;
  },

  // =============================================
  // Create Site
  // =============================================

  createSite: async (data) => {
    const response = await api.post("/sites", data);

    return response.data;
  },

  // =============================================
  // Update Site
  // =============================================

  updateSite: async (id, data) => {
    const response = await api.put(`/sites/${id}`, data);

    return response.data;
  },

  // =============================================
  // Delete Site
  // =============================================

  deleteSite: async (id) => {
    const response = await api.delete(`/sites/${id}`);

    return response.data;
  },

  // =============================================
  // Assign Engineer
  // =============================================

  assignEngineer: async (siteId, engineerId) => {
    const response = await api.put("/sites/assign-engineer", {
      siteId,
      engineerId,
    });

    return response.data;
  },
};

export default siteService;
