import { httpClient } from "utils/httpClient";
import { RandomSentence } from "types/apiResponseData";
export function getRandomSentence() {
  return httpClient.get<RandomSentence>(
    "?c=d&c=k&c=a&min_length=20&max_length=100"
  );
}

const prefix = "/api/bim-cost-control-backend";
enum Api {
  add = `${prefix}/project/add`,
  edit = `${prefix}/project/edit`,
  page = `${prefix}/project/page`,
  remove = `${prefix}/project/remove/`,
  detail = `${prefix}/project/detail/`,
  import = `${prefix}/project/import`,
  export = `${prefix}/project/export?ids=`,
  getProjectNameAndId = `${prefix}/project/getProjectNameAndId`,
  logs = `${prefix}/project_operation_log/page`,
  controlDetermine = `${prefix}/project/controlDetermine/`,
  controlEndApply = `${prefix}/project/controlEndApply/`,
  controlExtensionApply = `${prefix}/project/controlExtensionApply/`,
  statisticsProject = `${prefix}/project/statisticsProject`,
  statisticsProjectByDept = `${prefix}/project/statisticsProjectByDept`,
  deptList = `${prefix}/project/deptList`,
}

/**
 * @description: 获取项目名称和id
 */
export const getProjectNameAndId = () => {
  return httpClient.get(Api.getProjectNameAndId);
};
