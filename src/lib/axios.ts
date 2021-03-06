import Axios, { AxiosRequestConfig } from "axios";
import qs from "qs";
import { API_URL } from "config";
import { useNotificationStore } from "stores/notifications";
import history from "lib/history";
import storage from "utils/storage";

function authRequestInterceptor(config: AxiosRequestConfig) {
  if (!config.headers) {
    config.headers = {};
  }

  const token = storage.getToken();
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }

  config.headers.Accept = "application/json";

  return config;
}

export const axios = Axios.create({
  baseURL: API_URL,
  paramsSerializer: function (params) {
    // make arrays in query params match FastAPI array format: https://fastapi.tiangolo.com/tutorial/query-params-str-validations/#query-parameter-list-multiple-values
    return qs.stringify(params, { arrayFormat: "repeat" });
  },
});

axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status !== 404) {
      const message = error.response?.data?.message || error.message;
      useNotificationStore.getState().addNotification({
        type: "error",
        title: "Error",
        message,
      });
    }

    if (error.response?.status === 401) {
      storage.clearToken();
      history.push("/auth/login");
      return Promise.resolve();
    }

    return Promise.reject(error);
  }
);

export {};
