import api from "./api";

const essService = {
  // Quick-glance dashboard: latest payslip, this month's attendance
  // count, pending leave count — all scoped to the logged-in user.
  getMySummary: async () => {
    const response = await api.get("/ess/summary");
    return response.data;
  },

  // Update own contact details (phone, address, emergencyContact only).
  // For reading your own profile, use employeeService.getMyEmployee().
  updateMyProfile: async (data) => {
    const response = await api.put("/ess/profile", data);
    return response.data;
  },

  getMyPayslips: async () => {
    const response = await api.get("/ess/payslips");
    return response.data;
  },

  getMyPayslip: async (id) => {
    const response = await api.get(`/ess/payslips/${id}`);
    return response.data;
  },
};

export default essService;
