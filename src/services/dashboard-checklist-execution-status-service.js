import { rootUrl } from "../helpers/url";
import CrudService from "./crud-service";
import HttpClient from "./http";

class ChecklistExecutionStatusService extends CrudService {
  // url = `${rootUrl}/report/homeMonitoring/executionStatus`;
  http = new HttpClient();
  getTicketCount() {
    return this.http.get(`${rootUrl}/report/homeMonitoring/executionStatus`, {
      params: {},
    });
  }
}
export default ChecklistExecutionStatusService;
