<template>
  <view class="header">
    <Space :size="50">
      <view @click="onShowPicker('projectLeaderStatus')"
        >审核状态 <Icon class="icon" name="arrow-down"
      /></view>
      <view @click="onShowPicker('costTypeName')"
        >成本科目 <Icon class="icon" name="arrow-down"
      /></view>
    </Space>
    <Icon class="filter" name="filter-o" @click="showFilter" />
    <Icon name="replay" class="reflush" @click="onFlush" />
  </view>
  <ThTable :datasource="datasource" v-if="datasource" />
  <view class="bg-empty" v-else>
    <Image width="100" height="100" :src="emptyIcon" />
    <text>暂无更多数据</text>
  </view>

  <!-- Filter -->
  <view class="popup-filter" v-show="isShowFilter">
    <Form @submit="onSubmit" ref="formRef">
      <CellGroup>
        <Field
          v-model="model.projectNumber"
          name="projectNumber"
          label="项目编号"
          placeholder="请输入"
        />
        <Field
          v-model="model.projectName"
          name="projectName"
          label="项目名称"
          placeholder="请输入"
        />
        <Field
          v-model="model.startDate"
          is-link
          readonly
          name="startDate"
          label="开始时间"
          placeholder="点击选择时间"
          @click="onShowDate('startDate')"
        />
        <Field
          v-model="model.endDate"
          is-link
          readonly
          name="endDate"
          label="结束时间"
          placeholder="点击选择时间"
          @click="onShowDate('endDate')"
        />
        <view class="footer-button">
          <Button
            :class="{ btn: !Object.values(model).some((x) => x) }"
            round
            block
            type="primary"
            native-type="submit"
          >
            查询
          </Button>
        </view>
      </CellGroup>
    </Form>
  </view>

  <!-- Select弹框 -->
  <Popup v-model:show="showPicker" position="bottom">
    <Picker
      :columns="columns"
      @confirm="onConfirm"
      @cancel="showPicker = false"
    />
  </Popup>
  <!-- Date弹框 -->
  <Popup v-model:show="showDate" position="bottom">
    <DatePicker
      title="选择日期"
      @confirm="onDateConfirm"
      @cancel="showDate = false"
    />
  </Popup>
</template>

<script setup lang="ts">
import { costSubjectEnum, myCostStatusEnum } from "enum/index";
import {
  Field,
  Picker,
  Popup,
  Button,
  Icon,
  Space,
  CellGroup,
  Form,
  DatePicker,
  Image,
} from "vant";
import { ref, unref, watch, watchEffect } from "vue";
import ThTable from "./table-list.vue";
import { costListApi } from "api/index";
import { emptyIcon } from "constants/imageIcons";

const datasource = ref([]);

const isShowFilter = ref(false);
const showPicker = ref(false);
const showDate = ref(false);
const model = ref({
  projectNumber: "",
  projectName: "",
  startDate: "",
  endDate: "",
  projectLeaderStatus: "",
  costTypeName: "",
});
const columns = ref<{ text: string; value: string }[]>([]);
const dateType = ref("startDate");
const pickerType = ref("");

watch(
  () => pickerType.value,
  (val) => {
    if (val !== "costTypeName") {
      columns.value = Object.keys(myCostStatusEnum).map((key) => ({
        text: myCostStatusEnum[key],
        value: key,
      }));
    } else {
      columns.value = Object.values(costSubjectEnum).map((val) => ({
        text: val,
        value: val,
      }));
    }
  }
);

const query = ref({
  current: 1,
  size: 10,
});

const getCostList = async (params: any) => {
  const res = await costListApi(params);
  datasource.value = res.data.records;
};

// 监听筛选数据，自动请求数据
watchEffect(async () => {
  model.value.projectLeaderStatus;
  model.value.costTypeName;
  getCostList({
    ...unref(query),
    projectLeaderStatus: model.value.projectLeaderStatus,
    costTypeName: model.value.costTypeName,
  });
});

const onShowDate = (type: string) => {
  dateType.value = type;
  showDate.value = true;
};
const onShowPicker = (type: string) => {
  pickerType.value = type;
  showPicker.value = true;
};
const onConfirm = ({ selectedOptions }: any) => {
  model.value[pickerType.value] = selectedOptions[0]?.value;
  showPicker.value = false;
};
const onDateConfirm = (value: string) => {
  model.value[dateType.value] = value["selectedValues"].join("-");
  showDate.value = false;
};
const onSubmit = async (values: any) => {
  getCostList({ ...unref(query), ...values });
  isShowFilter.value = false;
};
const showFilter = () => {
  isShowFilter.value = !unref(isShowFilter);
};
const resetModel = () => {
  model.value = {
    projectNumber: "",
    projectName: "",
    startDate: "",
    endDate: "",
    projectLeaderStatus: "",
    costTypeName: "",
  };
};
const onFlush = () => {
  resetModel();
  isShowFilter.value = false;
};
</script>

<style lang="less" scoped>
.header {
  padding: 24rpx 24rpx;
  display: flex;
  justify-content: space-between;
  .reflush {
    position: absolute;
    right: 24rpx;
    top: -60rpx;
    z-index: 999;
    font-size: 40rpx;
    transform: rotate(-50deg);
  }
  .icon {
    width: 16rpx;
    height: 10rpx;
    color: #999999;
  }
  .filter {
    width: 34rpx;
    height: 34rpx;
    color: #000000;
  }
}

.popup-filter {
  position: fixed;
  width: 100%;
  top: 160rpx;
  z-index: 999;
  border-radius: 40rpx;

  .footer-button {
    display: flex;
    justify-content: center;
    align-items: center;
    .btn {
      background: #cacaca;
      border-color: #cacaca;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
    }
    padding: 24rpx;
  }
}

.bg-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 75vh;
  text {
    color: #999999;
    font-size: 28rpx;
    margin-top: 20rpx;
  }
}
</style>
