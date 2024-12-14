import CrudService from "./crud-service";
import HttpClient from "./http";
import { CONFIGURATION_USER_ACCESS } from "../helpers/const-service";
class UserAccessService extends CrudService {
  url = CONFIGURATION_USER_ACCESS;
  constructor() {
    super();
    this.http = new HttpClient();
  }
  authorization(pageId = null) {
    if (pageId) {
      return this.http.get(`${this.url}/authorization/${pageId}`);
    }
    return this.http.get(`${this.url}/authorization`);
  }

  retrieveById(id, menuId) {
    return this.http.get(`${this.url}?roleId=${id}&menuId=${menuId}`);
  }
  retrieveByPath(path) {
    return this.http.get(`${this.url}/path`, {
      params: {
        path: path,
      },
    });
  }
  retrieveByRoleId(id) {
    return this.http.get(`${this.url}?roleId=${id}`);
  }
  retrieveByMenuId(id) {
    return this.http.get(`${this.url}/menu/${id}`);
  }
  // rolefilter() {

  //   return this.http.get(`${this.url}/role-filter`);

  // }
}
export default UserAccessService;
