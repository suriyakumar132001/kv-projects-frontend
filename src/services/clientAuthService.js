// ===============================================
// KV Projects ERP
// Client Portal Auth Service
// ===============================================

import clientApi from "./clientApi";

export const clientLogin = async (formData) => {
  const res = await clientApi.post("/client-auth/login", formData);

  return res.data;
};

export const clientForgotPassword = async (email) => {
  const res = await clientApi.post("/client-auth/forgot-password", {
    email,
  });

  return res.data;
};

export const clientResetPassword = async (token, password) => {
  const res = await clientApi.put(`/client-auth/reset-password/${token}`, {
    password,
  });

  return res.data;
};

export default {
  clientLogin,
  clientForgotPassword,
  clientResetPassword,
};
