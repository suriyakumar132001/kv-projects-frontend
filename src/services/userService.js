import api from "./api";

const userService = {
  getUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put("/users/profile", data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.put("/users/change-password", data);
    return response.data;
  },

  // Owner/Admin only — create a new HR / Site Engineer / Admin account.
  // (Uses the /auth/register endpoint, which requires the caller to be
  // logged in as Owner or Admin once the first Owner account exists.)
  registerUser: async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  // Owner/Admin only — activate or deactivate a user.
  updateUserStatus: async (id, status) => {
    const response = await api.patch(`/users/${id}/status`, { status });
    return response.data;
  },

  // Owner/Admin only — create/link an Employee profile for an existing
  // user who was created before auto-linking existed.
  provisionEmployee: async (id) => {
    const response = await api.post(`/users/${id}/provision-employee`);
    return response.data;
  },
};

export default userService;
