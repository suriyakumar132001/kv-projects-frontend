import api from "./api";

const clientService = {
  getClients: async () => {
    const response = await api.get("/clients");
    return response.data;
  },
};

export default clientService;