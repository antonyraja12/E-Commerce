import { rootUrl } from "../helpers/url";
import HttpClient from "./http";
class ReportService {
  http = new HttpClient();
  getResolutionWorkOrder(filter = {}) {
    return this.http.get(`${rootUrl}/resolution-work-order/report`, {
      params: filter,
    });
  }
}
export default ReportService;
