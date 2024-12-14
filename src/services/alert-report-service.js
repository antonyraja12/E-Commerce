import HttpClient from "./http";
import { rootUrl } from "../helpers/url";
class AlertReportService {
  http = new HttpClient();
  list(filter = {}) {
    return this.http.get(`${rootUrl}/remote-monitoring/alert-report`, {
      params: filter,
    });
  }
}
export default AlertReportService;
