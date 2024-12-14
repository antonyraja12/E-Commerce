import { rootUrl } from "../helpers/url";
import CrudService from "./crud-service";
import HttpClient from "./http";

class AgingofTicketService extends CrudService {
  url = `${rootUrl}/report/homeMonitoring/ageingOfTicket`;
  http = new HttpClient();
  getTicketCount() {
    return this.http.get(url, {
      params: {},
    });
  }
}
export default AgingofTicketService;
