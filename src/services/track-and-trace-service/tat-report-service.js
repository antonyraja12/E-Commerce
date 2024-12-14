import { TAT_REPORT } from "../../helpers/const-service";
import HttpClient from "../http";

class TatReportService {
  url = TAT_REPORT;
  http = new HttpClient();
  traceability(filter = {}) {
    return this.http.get(`${this.url}/traceability`, {
      params: filter,
    });
  }

  getPartCount(filter = {}) {
    return this.http.get(`${this.url}/shiftwise-part-count`, {
      params: filter,
    });
  }

  getOle(filter = {}) {
    return this.http.get(`${this.url}/ole`, {
      params: filter,
    });
  }

  getChildPartTracking(filter = {}) {
    return this.http.get(`${this.url}/child-Part-track`, {
      params: filter,
    });
  }

  getShiftWisePartCount(filter = {}) {
    return this.http.get(`${this.url}/shift-wise-part-count`, {
      params: filter,
    });
  }
}

export default TatReportService;
