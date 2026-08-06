import api from "./api";

const authService = {
  login: async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  register: async (data) => {
    const response = await api.post("/api/auth/login", data);
    return response.data;
  },
};

export default authService;
