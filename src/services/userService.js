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
};

export default userService;
