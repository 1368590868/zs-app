import axios from "axios";
import { useAppStore } from "store/store";
import { Toast } from "vant";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 12000,
});

const appStore = useAppStore();

httpClient.interceptors.request.use(
  (config) => {
    config.headers = {
      Authorization: `bearer ${appStore.$state.token}`,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (response) => {
    if (response.data.data && response.data.data.errorCode) {
      Toast(response.data.data.errorMsg || "出错了");
      return Promise.reject(response.data.data.errorMsg);
    }
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);
