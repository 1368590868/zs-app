<script setup lang="ts">
import { onLaunch, onShow, onHide, onReady } from "@dcloudio/uni-app";
import { useAppStore } from "store/store";
const store = useAppStore();

const getUserInfomation = async () => {
  const module = await import("./api");
  const res = await module.getUserInfo();
  if (res.code === 0) {
    store.setUserInfo(res.data);
  }
  console.log("getUserInfomation", res);
};
onLaunch(() => {
  console.log("App Launch");

  getUserInfomation();
});
onReady(() => {
  console.log("App Ready");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="less"></style>
