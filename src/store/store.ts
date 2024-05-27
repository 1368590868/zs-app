import { defineStore } from "pinia";
import { store } from "store/index";

interface AppState {
  pageLoading: boolean;
  token: string;
}
export const useAppStore = defineStore({
  id: "app",
  state: (): AppState => ({
    pageLoading: false,
    token: "65ba94d0-e467-4de2-bffd-a2d1bdf91b8e",
  }),
  persist: true,
  getters: {
    getPageLoading(): boolean {
      return this.pageLoading;
    },
    getToken(): string {
      return this.token;
    },
  },
  actions: {
    setPageLoading(loading: boolean): void {
      this.pageLoading = loading;
    },
    setToken(): void {},
  },
});

// Need to be used outside the setup
export function useAppStoreWithOut() {
  return useAppStore(store);
}
