<template>
  <view class="content">
    <navigator url="/pages/projectIncurredExpense/index">
      <view class="grid">
        <view><img class="icon" :src="fsfyIcon" /></view>
        <view>新增发生费用</view>
      </view>
    </navigator>

    <navigator url="/pages/myPhaseCost/index">
      <view class="grid">
        <view><img class="icon" :src="cbjlIcon" /></view>
        <view>我的成本记录</view>
      </view>
    </navigator>

    <navigator url="/pages/projectPhaseCostDetail/index">
      <view class="grid">
        <view><img class="icon" :src="cbmxIcon" /></view>
        <view>成本明细审核</view>
      </view>
    </navigator>
  </view>
</template>

<script setup lang="ts">
import { cbjlIcon, cbmxIcon, fsfyIcon } from "constants/imageIcons";
</script>

<style lang="less">
.content {
  display: flex;
  justify-content: space-between;
  padding: 48rpx;
  font-weight: 400;
  font-size: 30rpx;
  color: #333a41;

  .grid {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
.icon {
  width: 48rpx;
  height: 48rpx;
}
</style>
