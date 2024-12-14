import CrudService from "./crud-service";
import { CBM_ALERT_LOG } from "../helpers/const-service";
class AlertReportService extends CrudService {
  url = CBM_ALERT_LOG;
  getAlertReport(filter) {
    return this.http.get(`${this.url}`, {
      params: filter,
    });
  }
  getAlertCount(filter) {
    return this.http.get(`${this.url}/entity`, {
      params: filter,
    });
  }
}
export default AlertReportService;
