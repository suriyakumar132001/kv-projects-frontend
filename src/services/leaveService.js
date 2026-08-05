import api from "./api";

const leaveService = {
  // Get All Leaves
  getLeaves: async (params) => {
    const response = await api.get("/leaves", {
      params,
    });
    return response.data;
  },

  // Get Single Leave
  getLeave: async (id) => {
    const response = await api.get(`/leaves/${id}`);
    return response.data;
  },

  // Apply Leave
  applyLeave: async (data) => {
    const response = await api.post("/leaves", data);
    return response.data;
  },

  // Update Leave
  updateLeave: async (id, data) => {
    const response = await api.put(`/leaves/${id}`, data);
    return response.data;
  },

  // Delete Leave
  deleteLeave: async (id) => {
    const response = await api.delete(`/leaves/${id}`);
    return response.data;
  },

  // Approve Leave
  approveLeave: async (id, remarks = "") => {
    const response = await api.put(`/leaves/approve/${id}`, {
      remarks,
    });
    return response.data;
  },

  // Reject Leave
  rejectLeave: async (id, remarks = "") => {
    const response = await api.put(`/leaves/reject/${id}`, {
      remarks,
    });
    return response.data;
  },
};

export default leaveService;