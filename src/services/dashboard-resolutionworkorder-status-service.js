import { rootUrl } from "../helpers/url";
import CrudService from "./crud-service";
import HttpClient from "./http";
class ResolutionWorkorderStatusService extends CrudService {
  //url = `${rootUrl}/report/homeMonitoring/ticketStatus`;
  http = new HttpClient();
  getTicketCount() {
    return this.http.get(`${rootUrl}/report/homeMonitoring/ticketStatus`, {
      params: {},
    });
  }
}
export default ResolutionWorkorderStatusService;
