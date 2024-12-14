import { CONFIGURATION_FIRE_ALERT } from "../helpers/const-service";
import HttpClient from "./http";

class FireAlertService {
  url = CONFIGURATION_FIRE_ALERT;
  http = new HttpClient();
  alerts() {
    return this.http.get(`${this.url}/alert`);
  }
  confirmation(id) {
    return this.http.post(`${this.url}/confirmation`, {
      fireAlertId: id,
    });
  }
  acknowledgement(id, confirmation) {
    return this.http.post(`${this.url}/acknowledgement`, {
      fireAlertId: id,
      confirmation: confirmation,
    });
  }
}
export default FireAlertService;
