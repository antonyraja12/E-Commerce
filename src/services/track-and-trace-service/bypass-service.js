import { TAT_BYPASS } from "../../helpers/const-service";
import HttpClient from "../http";

export default class BypassService {
  http = new HttpClient();
  url = TAT_BYPASS;
  list(filter = {}) {
    return this.http.get(this.url, {
      params: filter,
    });
  }
  retrieve(workStationId, deviceType) {
    return this.http.get(`${this.url}/${workStationId}/${deviceType}`);
  }
  save(workStationId, deviceType, status) {
    return this.http.post(`${this.url}/${workStationId}`, {
      status,
      deviceType,
    });
  }
  delete(workStationId, deviceType) {
    return this.http.delete(`${this.url}/${workStationId}/${deviceType}`);
  }
}
