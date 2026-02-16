import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

// Create axios instance with default config
export const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add API key only for Sunnah API requests
axiosInstance.interceptors.request.use((config) => {
  // Only add X-API-Key header for Sunnah API requests
  if (config.url?.includes("sunnah.com") && import.meta.env.VITE_SUNNAH_API_KEY) {
    config.headers["X-API-Key"] = import.meta.env.VITE_SUNNAH_API_KEY;
  }
  return config;
});

export const client = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.get(url, config);
    return response.data;
  },

  post: async <T>(
    url: string,
    body: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.post(
      url,
      body,
      config,
    );
    return response.data;
  },

  put: async <T>(
    url: string,
    body: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.put(
      url,
      body,
      config,
    );
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.delete(url, config);
    return response.data;
  },
};
