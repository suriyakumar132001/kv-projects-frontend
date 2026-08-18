// ===============================================
// KV Projects ERP
// Client Portal Data Service
// ===============================================

import clientApi from "./clientApi";

export const getMyProjects = async () => {
  const res = await clientApi.get("/client-portal/projects");

  return res.data;
};

export const getMyProjectDetail = async (id) => {
  const res = await clientApi.get(`/client-portal/projects/${id}`);

  return res.data;
};

export const getMyInvoices = async () => {
  const res = await clientApi.get("/client-portal/invoices");

  return res.data;
};

export const getMyPayments = async () => {
  const res = await clientApi.get("/client-portal/payments");

  return res.data;
};

export default {
  getMyProjects,
  getMyProjectDetail,
  getMyInvoices,
  getMyPayments,
};
