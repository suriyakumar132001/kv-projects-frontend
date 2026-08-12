import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        const url = error.response.config?.url || error.config?.url || "unknown";
        console.error("API unauthorized (401)", url);
        // notify the app so it can handle logout/reactive UI changes
        window.dispatchEvent(
          new CustomEvent("api:unauthorized", { detail: { url } })
        );
      } catch (e) {
        console.error("api interceptor error", e);
      }
    }

    return Promise.reject(error);
  }
);

export default api;