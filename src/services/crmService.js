// ===============================================
// KV Projects ERP
// CRM Service
// ===============================================

import api from "./api";

const crmService = {
  // params: { fromDate, toDate } — both optional (YYYY-MM-DD)
  getDashboard: async (params = {}) => {
    const response = await api.get("/crm/dashboard", { params });
    return response.data;
  },
};

export default crmService;
