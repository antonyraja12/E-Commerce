import CrudService from "../crud-service";
import { TASK_CONFIG } from "../../helpers/const-service";

class WorkInstructionTaskService extends CrudService {
  url = TASK_CONFIG;

  update = (id, data) => {
    return this.http.put(`${this.url}/${id}`, data);
  };
  getTasks = (ids) => {
    return this.http.get(`${this.url}/retrieve-all/${ids}`);
  };

  convertToTree(data, parent = null) {
    let result = data
      .filter((e) => e.parentId === parent)
      .map((e) => {
        let obj = { ...e };
        let children = this.convertToTree(data, e.taskId);
        if (children.length > 0) obj = { ...e, children: children };
        return obj;
      });
    return result;
  }
}
export default WorkInstructionTaskService;
