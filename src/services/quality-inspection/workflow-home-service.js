import CrudService from "../crud-service";
import HttpClient from "../http";
import { QI_WORK_FLOW_HOME } from "../../helpers/const-service";
class WorkFlowHomeService {
  http = new HttpClient();
  dashboard(filter = {}) {
    return this.http.get(QI_WORK_FLOW_HOME, {
      params: filter,
    });
  }
}
export default WorkFlowHomeService;