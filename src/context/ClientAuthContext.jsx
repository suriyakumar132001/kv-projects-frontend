import { createContext, useContext, useEffect, useState } from "react";
import clientAuthService from "../services/clientAuthService";

const ClientAuthContext = createContext();

export const ClientAuthProvider = ({ children }) => {
  const [client, setClient] = useState(
    JSON.parse(localStorage.getItem("clientUser")) || null,
  );

  const [token, setToken] = useState(
    localStorage.getItem("clientToken") || null,
  );

  const [loading, setLoading] = useState(false);

  const login = async (formData) => {
    setLoading(true);

    try {
      const res = await clientAuthService.clientLogin(formData);

      localStorage.setItem("clientToken", res.token);
      localStorage.setItem("clientUser", JSON.stringify(res.client));

      setToken(res.token);
      setClient(res.client);

      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("clientToken");
    localStorage.removeItem("clientUser");

    setClient(null);
    setToken(null);
  };

  // Listens only for "clientApi:unauthorized" (dispatched by
  // services/clientApi.js), never "api:unauthorized" — so a staff
  // session expiring elsewhere in the app can never log a client out,
  // and vice versa.
  useEffect(() => {
    const handler = () => {
      logout();
      window.location.href = "/portal/login";
    };

    window.addEventListener("clientApi:unauthorized", handler);
    return () => window.removeEventListener("clientApi:unauthorized", handler);
  }, []);

  return (
    <ClientAuthContext.Provider
      value={{
        login,
        logout,
        client,
        token,
        loading,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </ClientAuthContext.Provider>
  );
};

export const useClientAuth = () => useContext(ClientAuthContext);
