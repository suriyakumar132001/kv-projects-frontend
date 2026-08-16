// ===============================================
// KV Projects ERP
// Profitability Service
// ===============================================

import api from "./api";

// ===============================================
// GET PROFITABILITY FOR A SINGLE PROJECT
// ===============================================

export const getProjectProfitability = async (projectId) => {
  const response = await api.get(`/profitability/${projectId}`);

  return response.data;
};

// ===============================================
// GET PROFITABILITY SUMMARY FOR ALL PROJECTS
// ===============================================

export const getAllProjectsProfitability = async () => {
  const response = await api.get("/profitability");

  return response.data;
};

// ===============================================
// DEFAULT EXPORT
// ===============================================

const profitabilityService = {
  getProjectProfitability,
  getAllProjectsProfitability,
};

export default profitabilityService;
