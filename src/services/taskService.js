// ===============================================
// KV Projects ERP
// Task Service
// ===============================================

import api from "./api";

// ===============================================
// Get All Tasks
// ===============================================

export const getTasks = async (params = {}) => {
  const response = await api.get("/tasks", {
    params,
  });

  return response.data;
};

// ===============================================
// Get Single Task
// ===============================================

export const getTask = async (taskId) => {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  const response = await api.get(`/tasks/${taskId}`);

  return response.data;
};

// ===============================================
// Create Task
// ===============================================

export const createTask = async (taskData) => {
  const response = await api.post("/tasks", taskData);

  return response.data;
};

// ===============================================
// Update Task
// ===============================================

export const updateTask = async (taskId, taskData) => {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  const response = await api.put(`/tasks/${taskId}`, taskData);

  return response.data;
};

// ===============================================
// Delete Task
// ===============================================

export const deleteTask = async (taskId) => {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  const response = await api.delete(`/tasks/${taskId}`);

  return response.data;
};

// ===============================================
// Default Export
// ===============================================

const taskService = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};

export default taskService;
