import axios from "axios";
import { useAppStore } from "store/store";
import { showToast } from "vant";

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
    console.log(response);
    if (response.data && response.data.code !== 0) {
      showToast(response.data.msg || "出错了");
      return Promise.reject(response.data.msg);
    }
    return response.data;
  },
  (error) => {
    showToast(error?.message);
    return Promise.reject(error);
  }
);
