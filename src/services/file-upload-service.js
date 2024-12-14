import { TAT_FILE_UPLOAD } from "../helpers/const-service";
import HttpClient from "./http";
import LoginService from "./login-service";

export class FileUploadService {
  http = new HttpClient();
  url = TAT_FILE_UPLOAD;

  getUrl() {
    return this.url;
  }

  getToken() {
    const service = new LoginService();
    const token = service.getToken();
    return `Bearer ${token.token}`;
  }

  uploadFile(data, config = {}) {
    return this.http.post(this.url, data, config);
  }
  deleteFile(path) {
    return this.http.delete(`${this.url}`, {
      params: { path: path },
    });
  }
}
