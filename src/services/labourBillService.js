// ===============================================
// KV Projects ERP
// Labour Bill Service
// Mirrors the pattern used by invoiceService.js / vendorService.js
// (shared axios "api" instance, REST calls returning response.data).
// ===============================================

import api from "./api";

const labourBillService = {
  getLabourBills: async (params = {}) => {
    const response = await api.get("/labour-bills", { params });
    return response.data;
  },

  getLabourBill: async (id) => {
    const response = await api.get(`/labour-bills/${id}`);
    return response.data;
  },

  createLabourBill: async (data) => {
    const response = await api.post("/labour-bills", data);
    return response.data;
  },

  updateLabourBill: async (id, data) => {
    const response = await api.put(`/labour-bills/${id}`, data);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/labour-bills/status/${id}`, { status });
    return response.data;
  },

  deleteLabourBill: async (id) => {
    const response = await api.delete(`/labour-bills/${id}`);
    return response.data;
  },
};

export default labourBillService;
