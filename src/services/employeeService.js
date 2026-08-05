import api from "./api";

const employeeService = {
  // Get all employees
  getEmployees: async (params) => {
    const response = await api.get("/employees", { params });
    return response.data;
  },

  // Get single employee
  getEmployee: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // Create employee
  createEmployee: async (data) => {
    const response = await api.post("/employees", data);
    return response.data;
  },

  // Update employee
  updateEmployee: async (id, data) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  // Delete employee
  deleteEmployee: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },
};

export default employeeService;