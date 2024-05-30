<template>
  <Success v-if="showOk" />
  <view v-else>
    <view>
      <Form @submit="onSubmit" ref="formRef">
        <CellGroup>
          <view class="van-cell title">报销信息</view>
          <Field
            required
            v-model="getProjectText"
            is-link
            readonly
            name="projectId"
            label="成本项目"
            placeholder="请输入"
            :rules="[{ required: true, message: '请输入' }]"
            @click="showModal('projectList')"
          />
          <Popup v-model:show="showPicker" position="bottom" height="30%">
            <Picker
              :columns="columns"
              @confirm="onConfirm"
              @cancel="showPicker = false"
            />
          </Popup>
          <Field
            required
            is-link
            readonly
            v-model="model.costTypeName"
            name="costTypeName"
            label="成本科目"
            placeholder="请输入"
            @click="showModal('costTypeList')"
            :rules="[{ required: true, message: '请输入' }]"
          />
          <Field
            required
            v-model="model.phaseBudget"
            name="phaseBudget"
            label="成本金额"
            placeholder="请输入"
            :rules="[{ validator: validateGreaterThanZero, message: '请输入' }]"
          />
          <Field
            v-model="model.nickName"
            name="nickName"
            label="填报人"
            placeholder="请输入"
            disabled
            :rules="[{ required: true, message: '请输入' }]"
          />
          <Field
            v-model="model.time"
            name="time"
            label="填写时间"
            disabled
            placeholder="用户请输入名"
            :rules="[{ required: true, message: '请输入' }]"
          />
          <Field
            v-model="model.remark"
            name="remark"
            label="备注"
            placeholder="备注信息不超过15个字"
            :maxlength="15"
            :rules="[{ required: true, message: '请输入' }]"
          />
        </CellGroup>
      </Form>
    </view>
    <view class="tips van-cell">
      提示：提交后项目负责人审核，驳回后可以修改。
    </view>

    <CellGroup class="project-info" v-if="model.projectId">
      <view class="van-cell title">项目信息</view>
      <Cell title="阶段标题" :value="detail.phaseTitle" />
      <Cell
        title="阶段时间"
        :value="`${detail.phaseStartDate} - ${detail.phaseEndDate}`"
      />
      <Cell title="归属部门" :value="detail.deptName" />
      <Cell title="项目负责人" :value="detail.projectOwnerName" />
      <Cell title="成本负责人" :value="detail.costLeader" />
      <Cell title="阶段预算" :value="detail.phaseBudgetCost" />
      <Cell title="当前花销" :value="detail.phaseOutlayCost" />
      <Cell
        title="阶段管控状态"
        :value="milestoneControlStatusEnum[detail.controlStatus]"
      />
    </CellGroup>

    <view class="footer-button">
      <Button round block type="primary" @click="formRef?.submit">
        提交
      </Button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { Form, Field, CellGroup, Cell, Button, Picker, Popup } from "vant";
import { milestoneControlStatusEnum } from "enum/index";
import { computed, onMounted, reactive, ref, watch, watchEffect } from "vue";

import { useAppStore } from "store/store";
import {
  addCostApi,
  findNowPhasesByProjectIdApi,
  getProjectNameAndId,
} from "api/index";
import { costSubjectEnum } from "enum/index";
import Success from "components/Success.vue";

type Types = "projectList" | "costTypeList";

const store = useAppStore();
const formRef = ref<typeof Form>();
const showOk = ref(false);
// data
const pickerType = ref<Types>("projectList");
const detail = ref({
  phaseTitle: "",
  phaseStartDate: "",
  phaseEndDate: "",
  deptName: "",
  projectOwnerName: "",
  costLeader: "",
  phaseBudgetCost: 0,
  phaseOutlayCost: 0,
  controlStatus: 0,
});
const model = ref({
  projectId: "",
  costTypeName: "",
  phaseBudget: 0,
  nickName: store.getUserInfo.nickName,
  time: new Date().toISOString().split("T")[0],
  remark: "",
});
const columns = ref<{ text: string; value: string }[]>([]);
const options = reactive<{
  projectList: any[];
  costTypeList: { text: string; value: string }[];
}>({
  projectList: [],
  costTypeList: Object.values(costSubjectEnum).map((item) => {
    return {
      text: item,
      value: item,
    };
  }),
});
// lifecycle
onMounted(() => {
  getProjectList();
});

const getProjectText = computed(() => {
  return options.projectList.find((x) => x.value == model.value.projectId)
    ?.text;
});

watch(
  () => model.value.projectId,
  (val) => {
    getDetails(val);
  }
);
// util
const validateGreaterThanZero = (value: number) => {
  return value > 0;
};

// methods
const showModal = (type: Types) => {
  columns.value = options[type];
  pickerType.value = type;
  showPicker.value = true;
};
const getProjectList = async () => {
  const res = await getProjectNameAndId();
  options.projectList = res.data.map((item: any) => {
    return {
      text: item.projectName,
      value: item.id,
    };
  });
};

const resetModel = () => {
  model.value = {
    projectId: "",
    costTypeName: "",
    phaseBudget: 0,
    nickName: store.getUserInfo.nickName,
    time: new Date().toISOString().split("T")[0],
    remark: "",
  };
  formRef?.value?.resetValidation?.();
};

const onSubmit = async (values: any) => {
  await addCostApi({ ...values, createByName: store.getUserInfo.nickName });
  resetModel();
  showOk.value = true;
};

const fieldValue = ref("");
const showPicker = ref(false);

const onConfirm = ({
  selectedOptions,
}: {
  selectedOptions: { value: string }[];
}) => {
  const keys = {
    projectList: "projectId",
    costTypeList: "costTypeName",
  };
  model.value[keys[pickerType.value]] = selectedOptions[0].value;
  showPicker.value = false;
};
const getDetails = async (id: string) => {
  const res = await findNowPhasesByProjectIdApi(id);
  detail.value = res.data;
};
</script>

<style lang="less">
.footer-button {
  box-sizing: border-box;
  padding: 32rpx;
  width: 100%;
  left: 0;
  bottom: 0;
}

.tips {
  font-weight: 400;
  color: #aaaaaa;
  font-size: 24rpx;
}
.project-info {
  margin-top: 38rpx;
}
.title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}
</style>
