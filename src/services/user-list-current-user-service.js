import CrudService from "./crud-service";
import { rootUrl } from "../helpers/url";
import { USER_LIST } from "../helpers/const-service";
class CurrentUserService extends CrudService {
  url = `${USER_LIST}`;

  getUser() {
    return this.http.get(`${this.url}/current-user`);
  }
  save(data, id) {
    return this.http.put(`${this.url}/${id}`, data);
  }
}
export default CurrentUserService;
