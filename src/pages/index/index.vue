<template>
  <view>
    <Form @submit="onSubmit">
      <CellGroup inset>
        <view>报销信息</view>
        <Field
          required
          v-model="model.projectId"
          is-link
          readonly
          name="projectId"
          label="成本项目"
          placeholder="用户名"
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
          placeholder="用户名"
          @click="showModal('costTypeList')"
          :rules="[{ required: true, message: '请输入' }]"
        />
        <Field
          required
          v-model="model.phaseBudget"
          name="phaseBudget"
          label="成本金额(元)"
          placeholder="用户名"
          :rules="[{ required: true, message: '请输入' }]"
        />
        <Field
          v-model="model.nickName"
          name="nickName"
          label="填报人"
          placeholder="请输入"
          :rules="[{ required: true, message: '请输入' }]"
        />
        <Field
          v-model="model.time"
          name="time"
          label="填写时间"
          placeholder="用户请输入名"
          :rules="[{ required: true, message: '请输入' }]"
        />
        <Field
          v-model="model.remark"
          name="remark"
          label="备注"
          placeholder="请输入"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
      </CellGroup>
      <div style="margin: 16px">
        <Button round block type="primary" native-type="submit"> 提交 </Button>
      </div>
    </Form>
  </view>
</template>

<script setup lang="ts">
import { Form, Field, CellGroup, Button, Picker, Popup } from "vant";
import { onMounted, reactive, ref } from "vue";

import { useAppStore } from "store/store";
import { getProjectNameAndId } from "api/index";
import { costSubjectEnum } from "enum/index";

const store = useAppStore();
// data
const model = ref({
  projectId: "",
  costTypeName: "",
  phaseBudget: 0,
  nickName: "",
  time: new Date().toISOString().split("T")[0],
  remark: "",
});
const columns = ref([]);
const options = reactive({
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

// methods
type Types = "projectList" | "costTypeList";
const showModal = (type: Types) => {
  columns.value = options[type];
  showPicker.value = true;
};
const getProjectList = async () => {
  const res = await getProjectNameAndId();
  options.projectList = res.data.map((item: any) => {
    return {
      text: item.projectName,
      value: item.projectId,
    };
  });
};

const onSubmit = (values: any) => {
  store.setPageLoading(true);
  console.log("submit", values, showPicker.value);
};

const fieldValue = ref("");
const showPicker = ref(false);

const onConfirm = ({
  selectedOptions,
}: {
  selectedOptions: { text: string }[];
}) => {
  showPicker.value = false;
  model.value.projectId = selectedOptions[0].text;
};
</script>

<style lang="less"></style>
