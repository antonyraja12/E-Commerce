import HttpClient from "../http";
import { IM_WORK_FLOW_HOME } from "../../helpers/const-service";
class WorkFlowHomeService {
  http = new HttpClient();
  dashboard(filter = {}) {
    return this.http.get(IM_WORK_FLOW_HOME, {
      params: filter,
    });
  }
}
export default WorkFlowHomeService;
