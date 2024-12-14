import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { message } from "antd";
import { useLocalStorage } from "../hooks/useLocalStorage";
const ProtectedRoute = ({ children }) => {
  const { logout } = useAuth();
  const token = JSON.parse(localStorage.getItem("token"));
  axios.interceptors.request.use((config) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token && !config.url?.includes("/sign-in")) {
      config.headers.common["Authorization"] = `Bearer ${token.token}`;
    }
    config.headers.common["Content-Type"] = "application/json";
    config.headers.common["Accept"] = "application/json";
    return config;
  });
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        if (error.config.url?.includes("/sign-out")) {
          message.error(error.response?.data?.message ?? error.message);
          logout();
          window.location.href = "/login";
        } else {
          message.error("Session expired. Please login again.");
          logout();
          if (!window.location.pathname.startsWith("/login")) {
            window.location.href = "/login";
          }
        }
      } else if (error.response.status === 403) {
        message.error(error.response?.data?.message ?? error.message);
        logout();
      } else {
        if (!error.config.url?.includes("/user-access/path"))
          message.error(error.response?.data?.message ?? error.message);
      }

      return Promise.reject(error);
    }
  );
  if (!token) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;
