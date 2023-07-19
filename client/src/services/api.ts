import { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { Centrifuge } from "centrifuge";

export const API_URL =
  process.env.REACT_APP_API_URL || "http://192.168.2.19:8888";

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1/`,
  // validateStatus: status => status >= 200 && status < 300
});

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  const token = localStorage.getItem("token");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
};
const onRequestError = (error: AxiosError): Promise<AxiosError> =>
  Promise.reject(error);

axiosInstance.interceptors.request.use(onRequest, onRequestError);

export const axiosBaseQuery = (): BaseQueryFn<
  {
    url: string;
    method?: AxiosRequestConfig["method"];
    headers?: AxiosRequestConfig["headers"];
    data?: AxiosRequestConfig["data"];
    params?: AxiosRequestConfig["params"];
    onProgress?: AxiosRequestConfig["onUploadProgress"];
  },
  unknown,
  unknown
> => async ({ url, method, headers, data, params, onProgress }) => {
  try {
    const result = await axiosInstance({
      url: url.replace(/^\//, ""),
      method,
      headers,
      data,
      params,
      onUploadProgress: onProgress,
    });
    return { data: result.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) window.location.href = "/login";

      return {
        error: { status: error.response?.status, data: error.response?.data },
      };
    }

    return { error };
  }
};

export default axiosInstance;

const getToken = (endpoint: string, ctx: any) => {
  return new Promise<string>((resolve, reject) => {
    axiosInstance
      .post<{ token: string }>(endpoint, ctx)
      .then(({ data }) => {
        resolve(data.token);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const centrifuge = new Centrifuge(
  `ws://${API_URL.replace(
    /^(http:\/\/)?([a-zA-Z\d.]+)(:\d{2,5})?$/,
    "$2"
  )}:8000/connection/websocket`,
  {
    getToken: (ctx) => getToken("broadcasting/connect-token", ctx),
  }
);

centrifuge.on("error", (ctx) => {
  console.log(ctx);
});

export { centrifuge, getToken };
