import axios from "axios";

const API_URL = (import.meta.env.VITE_API_URL || "").trim();

if (!API_URL) {
  throw new Error(
    "Missing VITE_API_URL. Set it in admin/.env.development and admin/.env.production"
  );
}

export const createApiClient = (basePath = "") => {
  const instance = axios.create({
    baseURL: `${API_URL}${basePath}`,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        window.dispatchEvent(new CustomEvent("admin:auth-expired"));
        if (!window.location.pathname.includes("/admin/login")) {
          window.location.href = "/admin/login";
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const api = createApiClient();

export { API_URL };
export default api;
