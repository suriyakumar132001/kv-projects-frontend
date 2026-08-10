import api from "./api";

const dprService = {
  getReports: async () => {
    const response = await api.get("/dpr");
    return response.data;
  },

  getReport: async (id) => {
    const response = await api.get(`/dpr/${id}`);
    return response.data;
  },

  // formData must be a FormData instance (site engineer only, images optional)
  createReport: async (formData) => {
    const response = await api.post("/dpr", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteReport: async (id) => {
    const response = await api.delete(`/dpr/${id}`);
    return response.data;
  },
};

export default dprService;
