import axios from "axios";
import { store } from "../store/store";
import { logout, updateAccessToken } from "../store/authSlice";
import { ROUTES } from "../constants/routes";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_AXIOS_BASE_URL || "http://localhost:3000",
  withCredentials: true,
});

export type ResponseType<T = any> = {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
  errors?: any;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("smol_access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 & token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRequest =
      originalRequest.url?.includes(ROUTES.USER.LOGIN) ||
      originalRequest.url?.includes(ROUTES.USER.SIGNUP) ||
      originalRequest.url?.includes(ROUTES.USER.REFRESH);

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post<ResponseType>(
          `${import.meta.env.VITE_AXIOS_BASE_URL || "http://localhost:3000"}${ROUTES.USER.REFRESH}`,
          {},
          { withCredentials: true }
        );

        if (refreshResponse.data?.success && refreshResponse.data?.data?.accessToken) {
          const newAccessToken = refreshResponse.data.data.accessToken;
          store.dispatch(updateAccessToken(newAccessToken));
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
