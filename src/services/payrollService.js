import api from "./api";

const payrollService = {
  // Get All Payrolls
  getPayrolls: async () => {
    const response = await api.get("/payroll");
    return response.data;
  },

  // Get Single Payroll
  getPayroll: async (id) => {
    const response = await api.get(`/payroll/${id}`);
    return response.data;
  },

  // Generate Payroll
  createPayroll: async (data) => {
    const response = await api.post("/payroll", data);
    return response.data;
  },

  // Update Payroll
  updatePayroll: async (id, data) => {
    const response = await api.put(`/payroll/${id}`, data);
    return response.data;
  },

  // Mark Salary Paid
  markAsPaid: async (id) => {
    const response = await api.put(`/payroll/pay/${id}`);
    return response.data;
  },

  // Delete Payroll
  deletePayroll: async (id) => {
    const response = await api.delete(`/payroll/${id}`);
    return response.data;
  },
};

export default payrollService;