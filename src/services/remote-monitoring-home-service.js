import HttpClient from "./http";
import { rootUrl } from "../helpers/url";
class RemoteMonitoringHomeService {
  http = new HttpClient();
  getTotal(filter = {}) {
    return this.http.get(`${rootUrl}/remote-monitoring/asset-count`, {
      params: filter,
    });
  }
  getCustomerSummary(filter = {}) {
    return this.http.get(`${rootUrl}/remote-monitoring/customer-summary`, {
      params: filter,
    });
  }
  getCustomerSummaryWithCategory(filter={}){
    return this.http.get(`${rootUrl}/remote-monitoring/asset-category`, {
      params: filter,
    });
  }
  getCustomerStatus(filter = {}) {
    return this.http.get(`${rootUrl}/remote-monitoring/customer-status`, {
      params: filter,
    });
  }
}
export default RemoteMonitoringHomeService;
