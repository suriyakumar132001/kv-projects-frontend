// ===============================================
// KV Projects ERP
// Inventory Service
// ===============================================

import api from "./api";

const inventoryService = {
  // Optional params: { site }
  getInventory: async (params = {}) => {
    const response = await api.get("/inventory", { params });
    return response.data;
  },

  getInventoryItem: async (id) => {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },
};

export default inventoryService;
