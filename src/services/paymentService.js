import api from "./api";

const paymentService = {
  getPayments: async () => {
    const response = await api.get("/payments");
    return response.data;
  },

  getPayment: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  createPayment: async (data) => {
    const response = await api.post("/payments", data);
    return response.data;
  },

  updatePayment: async (id, data) => {
    const response = await api.put(`/payments/${id}`, data);
    return response.data;
  },

  deletePayment: async (id) => {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },
};

export default paymentService;