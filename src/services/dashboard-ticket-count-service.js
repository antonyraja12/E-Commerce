import { rootUrl } from "../helpers/url";
import CrudService from "./crud-service";
import HttpClient from "./http";

class TicketService extends CrudService {
  url = `${rootUrl}/report/homeMonitoring/ticketCount`;
  http = new HttpClient();
  getTicketCount() {
    return this.http.get(url, {
      params: {},
    });
  }
}
export default TicketService;
