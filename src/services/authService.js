import api from "./api";

const authService = {
  login: async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  googleLogin: async (credential) => {
    const response = await api.post("/auth/google", { credential });
    return response.data;
  },

  register: async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  // User forgot their password — sends a reset link to their email
  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  // User arrived from the emailed reset link with a token, submits a
  // brand-new password (no need to know the old one)
  resetPassword: async (token, password) => {
    const response = await api.put(`/auth/reset-password/${token}`, {
      password,
    });
    return response.data;
  },
};

export default authService;
