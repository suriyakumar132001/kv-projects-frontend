import api from "./api";

const invoiceService = {
  getInvoices: async () => {
    const response = await api.get("/invoices");
    return response.data;
  },

  getInvoice: async (id) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  createInvoice: async (data) => {
    const response = await api.post("/invoices", data);
    return response.data;
  },

  updateInvoice: async (id, data) => {
    const response = await api.put(`/invoices/${id}`, data);
    return response.data;
  },

  updatePaymentStatus: async (id, paymentStatus) => {
    const response = await api.put(`/invoices/payment/${id}`, {
      paymentStatus,
    });
    return response.data;
  },

  deleteInvoice: async (id) => {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
  },

  sendInvoiceEmail: async (id) => {
    const response = await api.post(`/email/send-invoice/${id}`);
    return response.data;
  },
};

export default invoiceService;
