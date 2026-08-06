import api from "./api";

const siteService = {
  getSites: async () => {
    const response = await api.get("/sites");
    return response.data;
  },

  createSite: async (data) => {
    const response = await api.post("/sites", data);
    return response.data;
  },

  assignEngineer: async (siteId, engineerId) => {
    const response = await api.put("/sites/assign-engineer", {
      siteId,
      engineerId,
    });
    return response.data;
  },
};

export default siteService;