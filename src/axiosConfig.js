import axios from "axios";
import { REST_API_BASE_URL } from "./services/base_services";

const axiosInstance = axios.create({
  baseURL: REST_API_BASE_URL ,
  headers: {
    "Content-Type": "application/json", // Default header
  },
  withCredentials: true,
});


axiosInstance.interceptors.request.use(
  (config) => {
    if (config.url && config.url.includes("/auth/login")) {
      return config;
    }
    const token = sessionStorage.getItem("jwt_token");
    const location = sessionStorage.getItem("location");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
     if (location) {
      config.headers["X-User-Location"] = location;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

  axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {

    if (!error || !error.response) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Only handle 401
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    //  If refresh endpoint itself failed → logout
    if (originalRequest.url.includes("/auth/refresh")) {
      sessionStorage.removeItem("jwt_token");
      sessionStorage.removeItem("refresh_token");
      window.location.replace("/");
      return Promise.reject(error);
    }

    // Prevent infinite retry loop
    if (originalRequest._retry) {
      sessionStorage.removeItem("jwt_token");
      sessionStorage.removeItem("refresh_token");
      window.location.replace("/");
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshToken = sessionStorage.getItem("refresh_token");

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      //  Call refresh API (use axiosInstance to keep baseURL)
      const refreshResponse = await axiosInstance.post(
        "/auth/refresh",
        { refreshToken }
      );

      const newAccessToken = refreshResponse.data;

      // Save new token
      sessionStorage.setItem("jwt_token", newAccessToken);

      // Update header for original request
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      // Retry original request
      return axiosInstance(originalRequest);

    } catch (refreshError) {

      sessionStorage.removeItem("jwt_token");
      sessionStorage.removeItem("refresh_token");

      window.location.replace("/");
      return Promise.reject(refreshError);
    }
  }
);



// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Clear session data
//       sessionStorage.clear();
//       // Redirect to login page
//       window.location.href = "/";
//     }
//     return Promise.reject(error);
//   }
// );
export default axiosInstance;