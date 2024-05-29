import { get } from "http";
import { defineStore } from "pinia";
import { store } from "store/index";

interface AppState {
  pageLoading: boolean;
  token: string;
  userInfo: UserInfo;
  approvalOpinion: Records[];
}
interface UserInfo {
  nickName: string;
  account: string;
}
interface Records {
  [x: string]: any;
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
    /**审批意见 */
    approvalOpinion: [],
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
    getApprovalOpinion(): Records[] {
      return this.approvalOpinion;
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
    setApprovalOpinion(approvalOpinion: Records[]): void {
      this.approvalOpinion = approvalOpinion;
    },
  },
});

// Need to be used outside the setup
export function useAppStoreWithOut() {
  return useAppStore(store);
}
