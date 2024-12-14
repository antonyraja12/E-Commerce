import CrudService from "./crud-service";
import { rootUrl } from "../helpers/url";
import { USER_LIST } from "../helpers/const-service";
class UserService extends CrudService {
  url = `${USER_LIST}`;
  listToken(filter) {
    return this.http.get(`${this.url}/token/list`, { params: filter });
  }
  deactivateToken(id) {
    return this.http.put(`${this.url}/token/deactivate/${id}`, {});
  }
  getCurrentUser() {
    return this.http.get(`${this.url}/current-user`);
  }
  getGeneratedPassword() {
    return this.http.get(`${this.url}/auto-generate`);
  }
  resetPassword(data) {
    return this.http.post(`${this.url}/reset-password`, data);
  }
  uploadPreview(file) {
    let formData = new FormData();
    formData.append("file", file);
    return this.http.post(`${this.url}/user-excel-upload-preview`, formData);
  }
  uploadFile(file) {
    let formData = new FormData();
    formData.append("file", file);
    return this.http.post(`${this.url}/user-excel-upload`, formData);
  }
  getMenu() {
    return this.http.get(`${this.url}/menu`);
  }
}
export default UserService;
