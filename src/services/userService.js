import api from "./api";

const userService = {
  getUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  // NEW — fetch a single user by id, for the Edit User page.
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // NEW — update a user's details/role/password.
  updateUser: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
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

  registerUser: async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  updateUserStatus: async (id, status) => {
    const response = await api.patch(`/users/${id}/status`, { status });
    return response.data;
  },

  provisionEmployee: async (id) => {
    const response = await api.post(`/users/${id}/provision-employee`);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default userService;
