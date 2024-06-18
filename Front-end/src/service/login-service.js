import { LOGIN_URL, REGISTER_URL } from "../helper/service-url";
import CrudService from "./crud-service";

class LoginService extends CrudService {
  url = LOGIN_URL;

  login(data) {
    return this.http.post(`${LOGIN_URL}`, data);
  }

  saveToken(token) {
    localStorage.setItem("token", token);
  }
  saveUserName(name) {
    localStorage.setItem("uName", name);
  }
}
export default LoginService;
