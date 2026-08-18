// ===============================================
// KV Projects ERP
// Client Portal API Instance
// ===============================================
//
// Deliberately separate from services/api.js. Uses a
// different localStorage key ("clientToken" instead of
// "token") and dispatches a different event on 401
// ("clientApi:unauthorized" instead of "api:unauthorized")
// so a client's session expiring can never trigger a
// staff logout, or vice versa, even though both instances
// live in the same app.
// ===============================================

import axios from "axios";

const clientApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
clientApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("clientToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
clientApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        const url =
          error.response.config?.url || error.config?.url || "unknown";

        console.error("Client portal API unauthorized (401)", url);

        window.dispatchEvent(
          new CustomEvent("clientApi:unauthorized", { detail: { url } }),
        );
      } catch (e) {
        console.error("clientApi interceptor error", e);
      }
    }

    return Promise.reject(error);
  },
);

export default clientApi;
