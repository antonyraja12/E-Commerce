import CrudService from "../crud-service";
import HttpClient from "../http";
import {
  PM_RESOLUTION_WORK_ORDER_REPORT,
  PM_RESOLUTION_WORK_ORDER_SHIFT_REPORT,
} from "../../helpers/const-service";
class ReportService {
  http = new HttpClient();
  getResolutionWorkOrder(filter = {}) {
    return this.http.get(PM_RESOLUTION_WORK_ORDER_REPORT, {
      params: filter,
    });
  }
  getShiftResolutionWorkOrder(filter = {}) {
    return this.http.get(PM_RESOLUTION_WORK_ORDER_SHIFT_REPORT, {
      params: filter,
    });
  }
  status(value) {
    switch (value) {
      case 0:
        return "Opened";
      case 1:
        return "Assigned";
      case 2:
        return "Resolved";
      case 3:
        return "Verified";
      case 4:
        return "Rejected";
      case 5:
        return "Completed";
      default:
        return "";
    }
  }
}
export default ReportService;
