import axios from "axios";

/**
 * Dynamic API Base URL resolution:
 * 1. Honors explicit VITE_API_URL environment variable if set (e.g. in production / cloud deployment).
 * 2. If accessed via LAN / Wi-Fi IP from another laptop/phone (e.g. 192.168.1.50), dynamically points to that host on port 5000.
 * 3. Falls back to http://localhost:5000 for local development.
 */
export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== "undefined" && window.location.hostname && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return `http://${window.location.hostname}:5000`;
  }
  return "http://localhost:5000";
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Pre-configured Axios instance with automatic JWT Authorization header injection
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
