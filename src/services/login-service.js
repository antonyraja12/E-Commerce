import HttpClient from "./http";
import { rootUrl } from "../helpers/url";
import { CURRENT_USER, LOGIN, LOGOUT } from "../helpers/const-service";
class LoginService {
  http = new HttpClient();
  login(data) {
    return this.http.post(`${LOGIN}`, data);
  }
  forgotPassword(data) {
    this.setChangePasswordDetail(data);
    return this.http.post(`${LOGIN}/forgot-password`, data);
  }
  validateOtp(data) {
    this.setChangePasswordDetail(data);
    return this.http.post(`${LOGIN}/validate-otp`, data);
  }
  changePassword(data) {
    return this.http.post(`${LOGIN}/change-password`, data);
  }
  saveToken(token) {
    localStorage.setItem("token", token);
  }
  updatePassword(data) {
    return this.http.post(`${LOGIN}/update-password`, data);
  }
  getToken() {
    return JSON.parse(localStorage.getItem("token"));
  }
  saveUserName(name) {
    localStorage.setItem("uName", name);
  }
  saveUserRoleName(name) {
    localStorage.setItem("uRoleName", name);
  }
  getUserName() {
    let token = this.getToken();
    return token.userName;
  }
  getUserRoleName() {
    return localStorage.getItem("uRoleName");
  }
  getUserDetails() {
    return this.http.get(`${CURRENT_USER}`);
  }
  logout() {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${LOGOUT}`)
        .then((response) => {
          resolve("Logged out successfully");
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  getChangePasswordDetail() {
    return JSON.parse(localStorage.getItem("cp"));
  }
  setChangePasswordDetail(data) {
    let exists = this.getChangePasswordDetail();
    localStorage.setItem("cp", JSON.stringify({ ...exists, ...data }));
  }
  clearChangePasswordDetail() {
    localStorage.removeItem("cp");
  }
}

export default LoginService;
