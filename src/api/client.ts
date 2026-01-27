import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

// Create axios instance with default config
export const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
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
