<template>
  <view>
    <!-- height 单元格高度  border 是否带有纵向边框 type值为type="selection" 时开启多选 loading显示加载中(默认false) emptyText 空数据时显示的文本内容-->
    <view class="uni-container">
      <uni-table
        ref="table"
        border
        rowKey="id"
        type="selection"
        emptyText="暂无更多数据"
        @selection-change="selectionChange"
      >
        <uni-tr>
          <uni-th
            v-for="item of column"
            align="center"
            :class="{ 'fixed-column': item.fixed }"
            :key="item.key"
          >
            {{ item.title }}
          </uni-th>
        </uni-tr>
        <!-- body cell -->
        <uni-tr v-for="(item, index) of props.datasource" :key="index">
          <template v-for="c of column" :key="c.key">
            <uni-td
              align="center"
              :class="{ 'fixed-column': c.fixed }"
              v-if="['projectName'].includes(c.key)"
            >
              {{ item[c.key] }}
            </uni-td>
            <!-- 动态column渲染  -->
            <uni-td
              align="center"
              v-if="
                ![
                  'projectName',
                  'projectLeaderStatus',
                  'costLeaderStatus',
                  'operationDeptStatus',
                  'auditOpinion',
                ].includes(c.key)
              "
            >
              {{ item[c.key] }}
            </uni-td>
            <!-- 项目负责人 -->
            <uni-td
              align="center"
              v-if="['projectLeaderStatus'].includes(c.key)"
            >
              <view v-if="item.projectLeaderStatus == 0">
                <Space>
                  <text class="text-link" @click="onOpenDialog(true, item, 1)"
                    >通过</text
                  >
                  <text class="text-link" @click="onOpenDialog(false, item, 1)"
                    >驳回</text
                  >
                </Space>
              </view>
              <span
                v-else
                :style="{
                  color: costTextColor(item.projectLeaderStatus),
                }"
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <Space>
                  <div
                    style="width: 5px; height: 5px; border-radius: 50%"
                    :style="{
                      background: costTextColor(item.projectLeaderStatus),
                    }"
                  ></div>
                  {{ myCostStatusEnum[item.projectLeaderStatus] }}
                </Space>
              </span>
            </uni-td>
            <!-- 成本负责人 -->
            <uni-td align="center" v-if="['costLeaderStatus'].includes(c.key)">
              <view v-if="item.costLeaderStatus == 0">
                <Space>
                  <text class="text-link" @click="onOpenDialog(true, item, 2)"
                    >通过</text
                  >
                  <text class="text-link" @click="onOpenDialog(false, item, 2)"
                    >驳回</text
                  >
                </Space>
              </view>
              <span
                v-else
                :style="{
                  color: costTextColor(item.costLeaderStatus),
                }"
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <Space>
                  <div
                    style="width: 5px; height: 5px; border-radius: 50%"
                    :style="{
                      background: costTextColor(item.costLeaderStatus),
                    }"
                  ></div>
                  {{ myCostStatusEnum[item.costLeaderStatus] }}
                </Space>
              </span>
            </uni-td>
            <!-- 运营部 -->
            <uni-td
              align="center"
              v-if="['operationDeptStatus'].includes(c.key)"
            >
              <view v-if="item.operationDeptStatus == 0">
                <Space>
                  <text class="text-link" @click="onOpenDialog(true, item, 3)"
                    >通过</text
                  >
                  <text class="text-link" @click="onOpenDialog(false, item, 3)"
                    >驳回</text
                  >
                </Space>
              </view>
              <span
                v-else
                :style="{
                  color: costTextColor(item.operationDeptStatus),
                }"
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <Space>
                  <div
                    style="width: 5px; height: 5px; border-radius: 50%"
                    :style="{
                      background: costTextColor(item.operationDeptStatus),
                    }"
                  ></div>
                  {{ myCostStatusEnum[item.operationDeptStatus] }}
                </Space>
              </span>
            </uni-td>
            <!-- 审批意见 -->
            <uni-td align="center" v-if="['auditOpinion'].includes(c.key)">
              <text class="text-link"
                ><navigator url="/pages/audit-list/index">查看</navigator></text
              >
            </uni-td>
          </template>
        </uni-tr>
      </uni-table>
    </view>
    <!-- Dialog -->
    <Dialog
      v-model:show="visible"
      show-cancel-button
      :before-close="onBeforeClose"
    >
      <view class="dialog-wrap">
        <view class="d-header">
          请确认审批{{ isPass ? "通过" : "不通过" }}，并备注
        </view>
        <Field
          v-model="remark"
          rows="3"
          autosize
          :maxlength="15"
          type="textarea"
          placeholder="非必填，备注信息不超过15个字"
        />
      </view>
    </Dialog>
    <!-- 批量操作 -->
    <view
      class="all_check"
      :class="{ all_bg: selectedRows.length > 0 }"
      @click="onBatchModel"
    >
      <Icon class="check_ico" name="brush-o" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { Space, showDialog, Dialog, Field, Icon, showToast } from "vant";
import { myCostStatusEnum } from "enum/index";
import { computed, h, ref } from "vue";
import {
  addAuditOpinionApi,
  auditApi,
  projectAuditOpinionApi,
} from "api/index";
import { useAppStore } from "store/store";

const props = defineProps({
  datasource: {
    type: Array,
    default: () => [],
  },
});
const emits = defineEmits(["reload"]);
const visible = ref(false);
const isPass = ref(false);
const remark = ref("");

const btnRow = ref({ id: "" });
const auditOpinionFlag = ref(0);
/**
 *
 * @param type isPass
 * @param row current row
 * @param person 0-项目意见 1-项目负责人审核意见 2-成本负责人审核意见 3-运营部审核意见
 */
const onOpenDialog = (type: boolean, row: { id: string }, person: number) => {
  isPass.value = type;
  visible.value = true;
  btnRow.value = row;
  auditOpinionFlag.value = person;
};

const store = useAppStore();
const onBeforeClose = (action: string) =>
  new Promise(async (resolve) => {
    const key = {
      1: "projectLeaderStatus",
      2: "costLeaderStatus",
      3: "operationDeptStatus",
    };
    if (action === "cancel") {
      resolve(true);
    } else {
      await auditApi({
        ids: [btnRow.value.id],
        [key[auditOpinionFlag.value]]: isPass.value ? "1" : "2",
      });
      await addAuditOpinionApi({
        projectPhaseCostId: btnRow.value.id,
        auditOpinion: remark.value,
        auditOpinionFlag: auditOpinionFlag.value,
        createByName: store.getUserInfo.nickName,
      });
      emits("reload");
      showToast({
        message: "操作成功",
      });
      resolve(true);
    }
    remark.value = "";
  });

// 表头配置参数
const column = ref([
  {
    title: "项目名称",
    key: "projectName",
    width: 3, // 宽度 width * 100 rpx,
    fixed: true,
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

const selectedRows = ref([]);

function selectionChange(e: any) {
  selectedRows.value = [];
  const selectIds = e.detail.index;
  selectIds.map((x: any) => {
    selectedRows.value.push(props.datasource[x]);
  });
  // 去重
  selectedRows.value = [...new Set(selectedRows.value)];
}
// 批量操作
const onBatchModel = () => {
  if (selectedRows.value.length === 0) {
    showDialog({
      title: "提示",
      message: "请选择需要操作的数据",
    });
    return;
  }
  showDialog({
    message: "请选择审批意见",
    showCancelButton: true,
    cancelButtonText: "批量驳回",
    confirmButtonText: "批量通过",
  })
    .then(async () => {
      await auditApi({
        ids: selectedRows.value.map((x: { id: string }) => x.id),
        projectLeaderStatus: 1,
      });
    })
    .catch(async () => {
      await auditApi({
        ids: selectedRows.value.map((x: { id: string }) => x.id),
        projectLeaderStatus: 2,
      });
    })
    .finally(() => {
      emits("reload");
      showToast({
        message: "操作成功",
      });
    });
};
</script>

<style lang="less" scoped>
.fixed-column {
  position: sticky;
  left: 0;
  z-index: 1;
  background-color: #fff;
}
.text-link {
  color: #0960bd;
}
.dialog-wrap {
  .d-header {
    font-weight: 500;
    font-size: 28rpx;
    color: #777777;
    margin-top: 60rpx;
    display: flex;
    justify-content: center;
  }
}

.all_check {
  width: 90rpx;
  height: 90rpx;
  background: #cccccc;
  box-shadow: -4rpx 8rpx 12rpx 0rpx rgba(18, 102, 192, 0.18);
  border-radius: 52rpx;
  position: fixed;
  right: 20rpx;
  bottom: 210rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  .check_ico {
    font-size: 40rpx;
    color: #fff;
  }
}
.all_bg {
  background: linear-gradient(135deg, #82bdfd 0%, #0960bd 100%);
}
</style>
