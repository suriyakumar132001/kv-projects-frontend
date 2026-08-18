// ===============================================
// KV Projects ERP
// Analytics Service  (extended for Phase 6 — Advanced Dashboard)
// ===============================================
//
// NOTE: The five methods under "EXISTING" already work against your
// current backend. The methods under "NEW — Phase 6" call endpoints
// that likely don't exist yet. Suggested routes/response shapes are
// documented above each one — wire these up on the backend (or tell
// me your real route names/shapes and I'll adjust the frontend to
// match instead).

import api from "./api";

const buildQuery = (params = {}) => {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  );
  if (!entries.length) return "";
  return "?" + new URLSearchParams(entries).toString();
};

const analyticsService = {
  // ===============================================
  // EXISTING
  // ===============================================

  getDashboardSummary: async () => {
    const response = await api.get("/analytics/dashboard");
    return response.data;
  },

  getMonthlyRevenue: async (params = {}) => {
    const response = await api.get(`/analytics/revenue${buildQuery(params)}`);
    return response.data;
  },

  getMonthlyExpenses: async (params = {}) => {
    const response = await api.get(`/analytics/expenses${buildQuery(params)}`);
    return response.data;
  },

  getBudgetSummary: async () => {
    const response = await api.get("/analytics/budget");
    return response.data;
  },

  getInventorySummary: async () => {
    const response = await api.get("/analytics/inventory");
    return response.data;
  },

  // ===============================================
  // NEW — Phase 6 (backend routes to be added)
  // ===============================================

  // GET /analytics/purchase-orders?period=30d
  // Expected response: { statusBreakdown: [{ status: "Approved", count: 12 }, ...],
  //                       recent: [{ id, poNumber, vendorName, amount, status, date }, ...] }
  getPurchaseOrderSummary: async (params = {}) => {
    const response = await api.get(
      `/analytics/purchase-orders${buildQuery(params)}`,
    );
    return response.data;
  },

  // GET /analytics/vendors/top?period=30d&limit=5
  // Expected response: { vendors: [{ id, name, totalSpend, orderCount }, ...] }
  getTopVendors: async (params = {}) => {
    const response = await api.get(
      `/analytics/vendors/top${buildQuery(params)}`,
    );
    return response.data;
  },

  // GET /analytics/inventory/low-stock
  // Expected response: { items: [{ id, name, category, currentStock, reorderLevel }, ...] }
  getLowStockItems: async () => {
    const response = await api.get("/analytics/inventory/low-stock");
    return response.data;
  },

  // GET /analytics/invoices/overdue
  // Expected response: { invoices: [{ id, invoiceNo, clientName, amount, dueDate, daysOverdue }, ...] }
  getOverdueInvoices: async () => {
    const response = await api.get("/analytics/invoices/overdue");
    return response.data;
  },

  // GET /analytics/projects/status
  // Expected response: { projects: [{ id, name, budget, spent, status }, ...] }
  getProjectStatusOverview: async () => {
    const response = await api.get("/analytics/projects/status");
    return response.data;
  },
};

export default analyticsService;
