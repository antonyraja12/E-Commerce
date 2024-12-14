import { CONFIGURATION_LOGO } from "../helpers/const-service";
import CrudService from "./crud-service";
class LogoService extends CrudService {
  url = CONFIGURATION_LOGO;

  logoUpload(file, type, ahId) {
    let formData = new FormData();
    if (type === "mainLogo") {
      formData.append("mainLogo", file);
    } else if (type === "collapsedLogo") {
      formData.append("collapsedLogo", file);
    }
    return this.http.post(`${this.url}/logo?aHId=${ahId}`, formData);
  }

  deleteFile(mode,ahId) {
    return this.http.delete(`${this.url}/logo/${mode}?aHId=${ahId}`);
  }

  getData(ahId) {
    return this.http.get(`${this.url}?aHId=${ahId}`);
  }
}
export default LogoService;
