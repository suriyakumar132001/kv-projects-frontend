import api from "./api";

const vendorService = {
  // Get all vendors
  getVendors: async () => {
    const response = await api.get("/vendors");
    return response.data;
  },

  // Create vendor
  createVendor: async (data) => {
    const response = await api.post("/vendors", data);
    return response.data;
  },
};

export default vendorService;