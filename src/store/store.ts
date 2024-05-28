import { defineStore } from "pinia";
import { store } from "store/index";

interface AppState {
  pageLoading: boolean;
  token: string;
  userInfo: UserInfo;
}
interface UserInfo {
  nickName: string;
  account: string;
}
export const useAppStore = defineStore({
  id: "app",
  state: (): AppState => ({
    pageLoading: false,
    token: "e1a0e5d7-5071-4cf3-a1b8-8a88e7220882",
    userInfo: {
      nickName: "管理员",
      account: "admin",
    },
  }),
  persist: true,
  getters: {
    getPageLoading(): boolean {
      return this.pageLoading;
    },
    getToken(): string {
      return this.token;
    },
    getUserInfo(): UserInfo {
      return this.userInfo;
    },
  },
  actions: {
    setPageLoading(loading: boolean): void {
      this.pageLoading = loading;
    },
    setToken(token: string): void {
      this.token = token;
    },
    setUserInfo(userInfo: UserInfo): void {
      this.userInfo = userInfo;
    },
  },
});

// Need to be used outside the setup
export function useAppStoreWithOut() {
  return useAppStore(store);
}
