import CrudService from "../crud-service";
import { QI_CHECKLIST_EXECUTION_ASSIGN } from "../../helpers/const-service";
class CheckListExecutionAssigService extends CrudService {
  url = QI_CHECKLIST_EXECUTION_ASSIGN;
  groupAssign(id, userId) {
    return this.http.put(`${this.url}/${id}?userId=${userId}`);
  }
}
export default CheckListExecutionAssigService;
