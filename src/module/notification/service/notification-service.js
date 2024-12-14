import { WEB_SOCKET_NOTIFICATION } from "../../../helpers/const-service";
import { rootUrl } from "../../../helpers/url";
import HttpClient from "../../../services/http";

export default class NotificationService {
  httpService = new HttpClient();
  list() {
    return this.httpService.get(`${WEB_SOCKET_NOTIFICATION}`);
  }
  updateStatus(id, status) {
    return this.httpService.put(`${WEB_SOCKET_NOTIFICATION}/${id}`, {
      status: status,
    });
  }
  retrive(id) {
    return this.httpService.get(`${WEB_SOCKET_NOTIFICATION}/${id}`);
  }
}
