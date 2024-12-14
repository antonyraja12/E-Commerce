import CrudService from "./crud-service";
import { rootUrl } from "../helpers/url";
import { CONFIGURATION_UPLOAD } from "../helpers/const-service";
class UploadService extends CrudService {
  url = CONFIGURATION_UPLOAD;
  parameterUpload(file, id) {
    let formData = new FormData();
    formData.append("file", file);
    return this.http.post(
      `${this.url}/assetParameter-upload?id=${id}`,
      formData
    );
  }
  alertUpload(file, id) {
    let formData = new FormData();
    formData.append("file", file);
    return this.http.post(`${this.url}/assetAlert-upload?id=${id}`, formData);
  }
}
export default UploadService;
