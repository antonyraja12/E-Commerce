import CrudService from "../crud-service";
import HttpClient from "../http";
import { QI_CHECKLIST_EXECUTION_REPORT } from "../../helpers/const-service";
class ChecklistExecutionReportServices {
  http = new HttpClient();
  getChecklistExecution(filter = {}) {
    return this.http.get(QI_CHECKLIST_EXECUTION_REPORT, {
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
export default ChecklistExecutionReportServices;
