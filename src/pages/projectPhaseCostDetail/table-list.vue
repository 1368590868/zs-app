<template>
  <view>
    <!-- height 单元格高度  border 是否带有纵向边框 type值为type="selection" 时开启多选 loading显示加载中(默认false) emptyText 空数据时显示的文本内容-->
    <uni-table
      :column="column"
      :listData="props.datasource"
      :tdClick="tdClick"
      :stripe="true"
      :border="true"
      :loading="false"
    >
      <template #action="Props">
        <Space>
          <span :style="{ color: '#0960BD' }">修改</span>
          <span :style="{ color: '#FF7455' }">删除</span>
        </Space>
      </template>
      <!-- 项目负责人 -->
      <template #projectLeaderStatus="Props">
        <span
          :style="{ color: costTextColor(Props.item.projectLeaderStatus) }"
          style="display: flex; justify-content: center; align-items: center"
        >
          <Space>
            <div
              style="width: 5px; height: 5px; border-radius: 50%"
              :style="{
                background: costTextColor(Props.item.projectLeaderStatus),
              }"
            ></div>
            {{ myCostStatusEnum[Props.item.projectLeaderStatus] }}
          </Space>
        </span>
      </template>
      <!-- 成本负责人 -->
      <template #costLeaderStatus="Props">
        <span
          :style="{ color: costTextColor(Props.item.costLeaderStatus) }"
          style="display: flex; justify-content: center; align-items: center"
        >
          <Space>
            <div
              style="width: 5px; height: 5px; border-radius: 50%"
              :style="{
                background: costTextColor(Props.item.costLeaderStatus),
              }"
            ></div>
            {{ myCostStatusEnum[Props.item.costLeaderStatus] }}
          </Space>
        </span>
      </template>
      <!-- 运营部 -->
      <template #operationDeptStatus="Props">
        <span
          :style="{ color: costTextColor(Props.item.operationDeptStatus) }"
          style="display: flex; justify-content: center; align-items: center"
        >
          <Space>
            <div
              style="width: 5px; height: 5px; border-radius: 50%"
              :style="{
                background: costTextColor(Props.item.operationDeptStatus),
              }"
            ></div>
            {{ myCostStatusEnum[Props.item.operationDeptStatus] }}
          </Space>
        </span>
      </template>
      <template #auditOpinion="Props">
        <span :style="{ color: '#0960BD' }" @click="onAudit(Props.item)"
          >查看</span
        >
      </template>
    </uni-table>
  </view>
</template>

<script setup lang="ts">
import { Space, showDialog } from "vant";
import { myCostStatusEnum } from "enum/index";
import { computed, h, ref } from "vue";
import { projectAuditOpinionApi } from "api/index";

const props = defineProps({
  datasource: {
    type: Array,
    default: () => [],
  },
});
// 自定义插槽单元格点击事件
const log = (item: any) => {
  console.log(item);
};
// 表头配置参数
const column = ref([
  {
    title: "项目名称",
    key: "projectName",
    width: 3, // 宽度 width * 100 rpx,
  },
  {
    title: "阶段名称",
    key: "phaseTitle",
    width: 3, // 宽度 width * 100 rpx,
  },
  {
    title: "成本科目",
    key: "costTypeName",
    width: 3, // 宽度 width * 100 rpx,
  },
  {
    title: "金额",
    key: "phaseBudget",
    width: 3, // 宽度 width * 100 rpx,
  },
  {
    title: "提交时间",
    key: "costSubmitTime",
    width: 3, // 宽度 width * 100 rpx,
  },
  {
    title: "成本备注",
    key: "remark",
    width: 3, // 宽度 width * 100 rpx,
  },
  {
    title: "项目负责人",
    key: "projectLeaderStatus",
    width: 3, // 宽度 width * 100 rpx,
    slot: "projectLeaderStatus",
  },
  {
    title: "成本负责人",
    key: "costLeaderStatus",
    width: 3, // 宽度 width * 100 rpx,
    slot: "costLeaderStatus",
  },
  {
    title: "运营部",
    key: "operationDeptStatus",
    width: 3, // 宽度 width * 100 rpx,
    slot: "operationDeptStatus",
  },
  {
    title: "审批意见",
    key: "auditOpinion",
    width: 3, // 宽度 width * 100 rpx,
    slot: "auditOpinion",
  },
  {
    title: "操作",
    key: "action",
    width: 3, // 宽度 width * 100 rpx,
    slot: "action",
  },
]);

const costTextColor = (status: number) => {
  const colors = {
    0: "#EFAD03",
    1: "#27CB0D",
    2: "#FF7455",
    3: "#AAAAAA",
  };
  return colors[status];
};

// 行点击事件 可不传 默认参数: 整行数据
const tdClick = (item: any) => {
  console.log(item);
};
const onAudit = async (row: { id: string }) => {
  const { id } = row;
  const res = await projectAuditOpinionApi({
    current: 1,
    size: 10,
    projectPhaseCostId: id,
  });
  showDialog({
    title: "审批意见",
    confirmButtonText: "返回",
    message: () =>
      // res.data.records ||
      [
        { id: 1, createByName: "test", auditOpinion: "一个简单的意见" },
        {
          id: 1,
          createByName: "test",
          auditOpinion:
            "一个长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长的意见",
        },
      ].map((x: any) =>
        h("div", { key: x.id, style: { display: "flex" } }, [
          h(
            "div",
            { style: { color: "#AAAAAA", width: "100rpx" } },
            x.createByName
          ),
          " : ",
          h(
            "div",
            { style: { color: "#777777", width: "390rpx", textAlign: "left" } },
            x.auditOpinion
          ),
        ])
      ),
  }).then(() => {
    // on close
  });
};
</script>

<style></style>
