import HttpClient from "./http";
import { rootUrl } from "../helpers/url";
class WorkFlowHomeService {
  http = new HttpClient();
  ageingOfTicket(filter = {}) {
    return this.http.get(`${rootUrl}/report/home-monitoring/ageing-of-ticket`, {
      params: filter,
    });
  }
  executionStatus(filter = {}) {
    return this.http.get(`${rootUrl}/report/home-monitoring/execution-status`, {
      params: filter,
    });
  }
  repeatedAbnormality(filter = {}) {
    return this.http.get(
      `${rootUrl}/report/home-monitoring/repeated-abnormality`,
      {
        params: filter,
      }
    );
  }
  ticketCount(filter = {}) {
    return this.http.get(`${rootUrl}/report/home-monitoring/ticket-count`, {
      params: filter,
    });
  }
  ticketStatus(filter = {}) {
    return this.http.get(`${rootUrl}/report/home-monitoring/ticket-status`, {
      params: filter,
    });
  }
}
export default WorkFlowHomeService;
