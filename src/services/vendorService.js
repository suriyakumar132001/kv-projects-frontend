// ===============================================
// KV Projects ERP
// Vendor Service
// ===============================================
//
// NOTE: Mirrors the pattern used by materialService.js / labourService.js
// (a shared axios "api" instance, REST calls returning response.data).
// Adjust the import path and "/vendors" endpoint below if your backend
// uses something different.

import api from "./api";

const vendorService = {
  // Get all vendors
  getVendors: async () => {
    const response = await api.get("/vendors");
    return response.data;
  },

  // Get a single vendor by id
  getVendorById: async (id) => {
    const response = await api.get(`/vendors/${id}`);
    return response.data;
  },

  // Create a new vendor
  createVendor: async (payload) => {
    const response = await api.post("/vendors", payload);
    return response.data;
  },

  // Update an existing vendor
  updateVendor: async (id, payload) => {
    const response = await api.put(`/vendors/${id}`, payload);
    return response.data;
  },

  // Delete a vendor
  deleteVendor: async (id) => {
    const response = await api.delete(`/vendors/${id}`);
    return response.data;
  },
};

export default vendorService;
