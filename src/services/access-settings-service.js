import HttpClient from "./http";
import { rootUrl } from "../helpers/url";
import { CONFIGURATION_ACCESS_SETTING } from "../helpers/const-service";
class AccessSettingsService {
  http = new HttpClient();
  list(filter = {}) {
    return this.http.get(CONFIGURATION_ACCESS_SETTING, {
      params: filter,
    });
  }
  save(data) {
    return this.http.post(CONFIGURATION_ACCESS_SETTING, data);
  }
}
export default AccessSettingsService;
