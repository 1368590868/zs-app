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
    token: "49dbb80e-8bc5-4827-80f6-39cf531b9f5b",
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
    setToken(): void {},
    setUserInfo(userInfo: UserInfo): void {
      this.userInfo = userInfo;
    },
  },
});

// Need to be used outside the setup
export function useAppStoreWithOut() {
  return useAppStore(store);
}
