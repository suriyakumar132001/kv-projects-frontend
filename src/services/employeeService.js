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

  // Get my own linked employee profile (used by Site Engineer's
  // self-only Mark Attendance screen)
  getMyEmployee: async () => {
    const response = await api.get("/employees/me");
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

  // Enroll / re-enroll face (descriptor captured client-side via FaceCapture)
  enrollFace: async (id, descriptor) => {
    const response = await api.put(`/employees/${id}/face`, { descriptor });
    return response.data;
  },

  // Remove enrolled face
  removeFace: async (id) => {
    const response = await api.delete(`/employees/${id}/face`);
    return response.data;
  },
};

export default employeeService;
