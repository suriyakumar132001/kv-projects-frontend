// ===============================================
// KV Projects ERP
// Project Service
// ===============================================

import api from "./api";

// ===============================================
// Get All Projects
// ===============================================

export const getProjects = async (params = {}) => {
  const response = await api.get("/projects", {
    params,
  });

  return response.data;
};

// ===============================================
// Get Single Project
// ===============================================

export const getProject = async (projectId) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const response = await api.get(`/projects/${projectId}`);

  return response.data;
};

// ===============================================
// Create Project
// ===============================================

export const createProject = async (projectData) => {
  const response = await api.post("/projects", projectData);

  return response.data;
};

// ===============================================
// Update Project
// ===============================================

export const updateProject = async (projectId, projectData) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const response = await api.put(`/projects/${projectId}`, projectData);

  return response.data;
};

// ===============================================
// Delete Project
// ===============================================

export const deleteProject = async (projectId) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const response = await api.delete(`/projects/${projectId}`);

  return response.data;
};

// ===============================================
// Project Statistics
// ===============================================

export const getProjectStats = async () => {
  const response = await api.get("/projects/stats");

  return response.data;
};

// ===============================================
// Get Project Expenses
// ===============================================

export const getProjectExpenses = async (projectId) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const response = await api.get(`/expenses/project/${projectId}`);

  return response.data;
};

// ===============================================
// Get Project Expense Summary
// ===============================================

export const getProjectExpenseSummary = async (projectId) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const response = await api.get(`/expenses/project/${projectId}/summary`);

  return response.data;
};

// ===============================================
// Default Export
// ===============================================

const projectService = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
  getProjectExpenses,
  getProjectExpenseSummary,
};

export default projectService;
