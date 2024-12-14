import HttpClient from "../services/http";
import { rootUrl } from "../helpers/url";
class EnergyParameterGraphService {
  constructor() {
    this.http = new HttpClient();
  }
  list(data = {}) {
    return this.http.get(`${rootUrl}/remote-monitoring/timeseries`, {
      params: data,
    });
  }
  parameterReport(data = {}) {
    return this.http.get(`${rootUrl}/remote-monitoring/parameter-report`, {
      params: data,
    });
  }
}
export default EnergyParameterGraphService;
