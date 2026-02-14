import axios from "axios";
import { auth } from "../firebase.js";

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || "").trim() || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach Firebase ID token if available.
api.interceptors.request.use(
  async (config) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const idToken = await currentUser.getIdToken();
      if (idToken) {
        config.headers.Authorization = `Bearer ${idToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized: Firebase token missing/invalid");
    }
    return Promise.reject(error);
  }
);

export default api;
