import { httpClient } from "utils/httpClient";
import { RandomSentence } from "types/apiResponseData";
export function getRandomSentence() {
  return httpClient.get<RandomSentence>(
    "?c=d&c=k&c=a&min_length=20&max_length=100"
  );
}

const prefix = "/api/bim-cost-control-backend";
const userPrefix = "/api/cmct-auth";
enum Api {
  add = `${prefix}/project_phase_cost/add`,
  getProjectNameAndId = `${prefix}/project/getProjectNameAndId`,
  deptList = `${prefix}/project/deptList`,
  userInfo = `${userPrefix}/user/userInfo`,
  findNowPhasesByProjectId = `${prefix}/project_phase/findNowPhasesByProjectId`,
  costList = `${prefix}/project_phase_cost/page`,
  project_audit_opinion = `${prefix}/project_audit_opinion/page`,
  audit = `${prefix}/project_phase_cost/audit`,
  addAuditOpinion = `${prefix}/project_audit_opinion/add`,
  costLeaderAudit = `${prefix}/project_month_audit/costLeaderAudit`,
  operationDeptAudit = `${prefix}/project_month_audit/operationDeptAudit`,
  remove = `${prefix}/project_phase_cost/remove/`,
}
/**
 * @description: 获取用户信息
 */
export const getUserInfo = () => {
  return httpClient.get(Api.userInfo);
};

/**
 * @description: 获取项目名称和id
 */
export const getProjectNameAndId = () => {
  return httpClient.get(Api.getProjectNameAndId);
};

/**
 * @description: 新增项目阶段成本明细
 */

export const addCostApi = (params: any) => {
  return httpClient.post(Api.add, params);
};

/**
 * @description: 查找某个阶段的详情
 */
export const findNowPhasesByProjectIdApi = (id: string) => {
  return httpClient.get(`${Api.findNowPhasesByProjectId}/${id}`);
};

/**
 *
 * @description 成本列表
 */
export const costListApi = (params: any) => {
  return httpClient.get(Api.costList, { params });
};
interface AuditParams {
  /**月度意见 */
  monthAuditId?: string;
  /**审核意见标识 */
  auditOpinionFlag?: string;
  /**成本意见 */
  projectPhaseCostId?: string;
  [x: string]: any;
}

/**
 * @description: 获取意见列表
 * @param {AuditParams} params
 */

export const projectAuditOpinionApi = (params: AuditParams) => {
  return httpClient.get(Api.project_audit_opinion, { params });
};

/**
 * 项目负责人审批通过驳回
 */
export const auditApi = (params: any, type: number) => {
  switch (type) {
    case 1:
      return httpClient.post(Api.audit, params);
    case 2:
      return httpClient.post(Api.costLeaderAudit, params);
    case 3:
      return httpClient.post(Api.operationDeptAudit, params);
    default:
      return httpClient.post(Api.audit, params);
  }
};

/**
 *
 * 成本负责人审核通过驳回
 */
export const costLeaderAuditApi = (params: any) => {
  return;
};
/**运营部负审核 */
export const operationDeptAuditApi = (params: any) => {
  return httpClient.post(Api.operationDeptAudit, params);
};

/**
 * 成本意见
 */
export const addAuditOpinionApi = (params: any) => {
  return httpClient.post(Api.addAuditOpinion, params);
};

/**删除成本记录 */
export const removeApi = (id: string) => {
  return httpClient.get(`${Api.remove}/${id}`);
};
