import api from "./api";

const analyticsService = {
  getDashboardSummary: async () => {
    const response = await api.get("/analytics/dashboard");
    return response.data;
  },

  getMonthlyRevenue: async () => {
    const response = await api.get("/analytics/revenue");
    return response.data;
  },

  getMonthlyExpenses: async () => {
    const response = await api.get("/analytics/expenses");
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
};

export default analyticsService;