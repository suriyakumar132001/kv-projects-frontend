// ===============================================
// KV Projects ERP
// Material Service
// ===============================================

import api from "./api";

const materialService = {
  // Get all materials
  getMaterials: async () => {
    const response = await api.get("/materials");
    return response.data;
  },

  // Get single material
  getMaterial: async (id) => {
    const response = await api.get(`/materials/${id}`);
    return response.data;
  },

  // Create material
  createMaterial: async (data) => {
    const response = await api.post("/materials", data);
    return response.data;
  },

  // Update material
  updateMaterial: async (id, data) => {
    const response = await api.put(`/materials/${id}`, data);
    return response.data;
  },

  // Delete material
  deleteMaterial: async (id) => {
    const response = await api.delete(`/materials/${id}`);
    return response.data;
  },
};

export default materialService;
