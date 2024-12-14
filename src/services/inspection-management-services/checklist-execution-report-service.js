import CrudService from "../crud-service";
import HttpClient from "../http";
import { rootUrl } from "../../helpers/url";
import { IM_CHECKLIST_EXECUTION_REPORT } from "../../helpers/const-service";
class ChecklistExecutionReportService {
  http = new HttpClient();
  getChecklistExecution(filter = {}) {
    return this.http.get(IM_CHECKLIST_EXECUTION_REPORT, {
      params: filter,
    });
  }
  status(value) {
    switch (value) {
      case 0:
        return "Scheduled";
      case 1:
        return "InProgress";
      case 2:
        return "Closed";
      default:
        return "";
    }
  }
}
export default ChecklistExecutionReportService;
