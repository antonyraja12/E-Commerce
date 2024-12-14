import CrudService from "../crud-service";
import { rootUrl, suggestionAI } from "../../helpers/url";
import { QI_RESOLUTION_WORK_ORDER } from "../../helpers/const-service";

class WorkOrderResolutionService extends CrudService {
  url = QI_RESOLUTION_WORK_ORDER;

  rcaSuggestUrl = `${suggestionAI}`;
  getbyOverallqa(startDate, endDate, aHId) {
    return this.http.get(
      `${this.url}/dashboard-report?aHId=${aHId}&startDate=${startDate}&endDate=${endDate}`
    );
  }
  reject(id,reason) {
    return this.http.post(`${this.url}/reject?resolutionWorkOrderId=${id}&rejectedReason=${reason}`);
  }
  // reject(data) {
  //   return this.http.post(`${this.url}/reject`, data);
  // }
  reOpen(data) {
    return this.http.post(`${this.url}/reopen`, data);
  }
  // reject(data) {
  //   return this.http.post(`${this.url}/reject`, data);
  // }
  approve(data) {
    return this.http.post(`${this.url}/approve`, data);
  }
  closed(data) {
    return this.http.post(`${this.url}/close`, data);
  }
  resolve(id, rca, ca, pa, data) {
    return this.http.post(
      `${this.url}/resolve?resolutionWorkOrderId=${id}&rca=${rca}&ca=${ca}&pa=${pa}`,
      data
    );
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
  getSuggestion(searchString, checkDescription, rca, ca) {
    return this.http.get(`${this.rcaSuggestUrl}/suggestion`, {
      params: {
        search_string: searchString,
        check_description: checkDescription,
        rca: rca,
        ca: ca,
      },
    });
  }
}
export default WorkOrderResolutionService;
