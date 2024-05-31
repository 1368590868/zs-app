<template>
  <view>
    <YSteps lineNum="0" :infoList="store.$state.approvalOpinion"></YSteps>
  </view>
</template>

<script setup lang="ts">
import YSteps from "components/Y-Steps/Y-Steps.vue";
import { useAppStore } from "store/store";
const store = useAppStore();
</script>

<style lang="less"></style>
