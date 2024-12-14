import HttpClient from "./http";
import { rootUrl } from "../helpers/url";
class RemoteStartService {
  http = new HttpClient();
  start(data) {
    return this.http.post(`${rootUrl}/remote-start`, data);
  }
}
export default RemoteStartService;
