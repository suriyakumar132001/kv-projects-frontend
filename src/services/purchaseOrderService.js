// ===============================================
// KV Projects ERP
// Purchase Order Service
// ===============================================
//
// NOTE: Mirrors materialService.js / vendorService.js.
// IMPORTANT: fix the import path below to match your real
// axios instance (see materialService.js for the correct path)
// before this file will resolve.

import api from "./api";

const purchaseOrderService = {
  // Get all purchase orders
  getPurchaseOrders: async () => {
    const response = await api.get("/purchase-orders");
    return response.data;
  },

  // Get a single purchase order by id
  getPurchaseOrderById: async (id) => {
    const response = await api.get(`/purchase-orders/${id}`);
    return response.data;
  },

  // Create a new purchase order
  createPurchaseOrder: async (payload) => {
    const response = await api.post("/purchase-orders", payload);
    return response.data;
  },

  // Update an existing purchase order
  updatePurchaseOrder: async (id, payload) => {
    const response = await api.put(`/purchase-orders/${id}`, payload);
    return response.data;
  },

  // Delete a purchase order
  deletePurchaseOrder: async (id) => {
    const response = await api.delete(`/purchase-orders/${id}`);
    return response.data;
  },
};

export default purchaseOrderService;
