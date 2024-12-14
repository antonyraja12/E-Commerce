import { rootUrl } from "../helpers/url";
import CrudService from "./crud-service";
import HttpClient from "./http";

class RepeatedAbnormalityService extends CrudService {
  url = `${rootUrl}/report/homeMonitoring/repeatedAbnormality`;
  http = new HttpClient();
  getTicketCount() {
    return this.http.get(url, {
      params: {},
    });
  }
}
export default RepeatedAbnormalityService;
