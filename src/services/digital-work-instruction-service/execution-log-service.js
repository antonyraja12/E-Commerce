import CrudService from "../crud-service";
import { EXECUTION_LOG } from "../../helpers/const-service";

class ExecutionLogService extends CrudService {
  url = EXECUTION_LOG;

  save(data) {
    return this.http.post(`${this.url}`, data);
  }
  TaskEndTime(id, endTime) {
    return this.http.put(`${this.url}/log-end-time/${id}?endTime=${endTime}`);
  }
}
export default ExecutionLogService;
