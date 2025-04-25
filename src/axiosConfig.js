import axios from "axios";
import { REST_API_BASE_URL } from "./services/base_services";

const axiosInstance = axios.create({
  baseURL: REST_API_BASE_URL ,
  headers: {
    "Content-Type": "application/json", // Default header
  },
});

// Add token from localStorage to headers automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
   // config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);
export default axiosInstance;