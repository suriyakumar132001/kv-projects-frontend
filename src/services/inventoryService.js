import api from "./api";

const inventoryService = {
  getInventory: async () => {
    const response = await api.get("/inventory");
    return response.data;
  },
};

export default inventoryService;