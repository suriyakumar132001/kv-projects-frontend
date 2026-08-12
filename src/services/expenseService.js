// ===============================================
// KV Projects ERP
// Expense Service
// ===============================================

import api from "./api";

// ===============================================
// GET ALL EXPENSES
// ===============================================

export const getExpenses = async (params = {}) => {
  const response = await api.get("/expenses", {
    params,
  });

  return response.data;
};

// ===============================================
// GET SINGLE EXPENSE
// ===============================================

export const getExpense = async (id) => {
  const response = await api.get(`/expenses/${id}`);

  return response.data;
};

// ===============================================
// CREATE EXPENSE
// ===============================================

export const createExpense = async (expenseData) => {
  const response = await api.post("/expenses", expenseData);

  return response.data;
};

// ===============================================
// UPDATE EXPENSE
// ===============================================

export const updateExpense = async (id, expenseData) => {
  const response = await api.put(`/expenses/${id}`, expenseData);

  return response.data;
};

// ===============================================
// DELETE EXPENSE
// ===============================================

export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);

  return response.data;
};

// ===============================================
// GET EXPENSE STATISTICS
// ===============================================

export const getExpenseStats = async () => {
  const response = await api.get("/expenses/stats");

  return response.data;
};

// ===============================================
// GET PROJECT EXPENSES
// ===============================================

export const getProjectExpenses = async (projectId) => {
  const response = await api.get(`/expenses/project/${projectId}`);

  return response.data;
};

// ===============================================
// DEFAULT EXPORT
// ===============================================

const expenseService = {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
  getProjectExpenses,
};

export default expenseService;
