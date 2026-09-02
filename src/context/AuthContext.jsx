import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const [loading, setLoading] = useState(false);

  const login = async (formData) => {
    setLoading(true);

    try {
      const res = await authService.login(formData);

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      setToken(res.token);
      setUser(res.user);

      return res;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (credential) => {
    setLoading(true);

    try {
      const res = await authService.googleLogin(credential);

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      setToken(res.token);
      setUser(res.user);

      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
  };

  // Global handler for API unauthorized events dispatched from the
  // axios interceptor. Centralizes logout behavior so UI can react
  // consistently when the backend returns 401 for any request.
  useEffect(() => {
    const handler = (e) => {
      // optional: inspect e.detail.url for debugging
      logout();
      // navigate to login (use full redirect to reset app state)
      window.location.href = "/";
    };

    window.addEventListener("api:unauthorized", handler);
    return () => window.removeEventListener("api:unauthorized", handler);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        googleLogin,
        logout,
        user,
        token,
        loading,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);