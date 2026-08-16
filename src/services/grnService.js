// ===============================================
// KV Projects ERP
// GRN (Goods Receipt) Service
// ===============================================

import api from "./api";

const grnService = {
  // Optional params: { purchaseOrder, site }
  getGRNs: async (params = {}) => {
    const response = await api.get("/grn", { params });
    return response.data;
  },

  getGRN: async (id) => {
    const response = await api.get(`/grn/${id}`);
    return response.data;
  },

  createGRN: async (data) => {
    const response = await api.post("/grn", data);
    return response.data;
  },
};

export default grnService;
