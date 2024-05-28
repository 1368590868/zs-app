<template>
  <view class="content">
    <van-image width="160rpx" height="160rpx" :src="okPng" />
    <view class="text1">提交成功</view>
    <view class="text2"
      ><text><count-down class="text" :time="4000" format="sss" /></text
      >后将返回上一个页面</view
    >

    <Button round block type="primary" @click="onBack"> 返回 </Button>
  </view>
</template>

<script setup lang="ts">
import { Image as VanImage, Button, CountDown } from "vant";
import okPng from "static/ok.png";
import { onUnmounted } from "vue";
// 3秒后返回上一个页面
const timer = setTimeout(() => {
  onBack();
}, 4000);

onUnmounted(() => {
  clearTimeout(timer);
});

const onBack = () => {
  uni.navigateBack({ delta: 1 });
  clearTimeout(timer);
};
</script>

<style lang="less" scoped>
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 90vh;
  background: #f7f8fa;
  .text1 {
    font-weight: 800;
    font-size: 32rpx;
    color: #0960bd;
    margin-top: 40rpx;
  }
  .text2 {
    font-weight: 500;
    font-size: 24rpx;
    color: #777777;
    margin-top: 8rpx;
    .text {
      color: #ff5411;
      display: inline;
    }
  }
  Button {
    width: 560rpx;
    height: 88rpx;
    background: #0960bd;
    border-radius: 16rpx 16rpx 16rpx 16rpx;
    margin-top: 88rpx;
  }
}
</style>
