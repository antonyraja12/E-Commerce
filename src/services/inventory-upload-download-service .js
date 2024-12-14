import CrudService from "./crud-service";
import { CONFIGURATION_INVENTORY_UPLOAD } from "../helpers/const-service";
class InventoryUploadDownloadService extends CrudService {
  url = CONFIGURATION_INVENTORY_UPLOAD;
  uploadFile(file) {
    let formData = new FormData();
    formData.append("file", file);
    return this.http.post(`${this.url}/excelFile`, formData);
  }
  template(name) {
    return this.http.get(`${this.url}/template?name=${name}`);
  }

  uploadDataId(id, data) {
    // let formData = new FormData();
    // formData.append("data", data);
    return this.http.post(`${this.url}/uploadData/${id}`, data);
  }

  uploadDataPreview(id, data, modeName) {
    // let formData = new FormData();
    // formData.append("data", data);
    // formData.append("modeName", modeName);
    return this.http.post(
      `${this.url}/preview/${id}?modeName=${modeName}`,
      data
    );
  }

  checkUpload(file) {
    let formData = new FormData();
    formData.append("file", file);
    return this.http.post(`${this.url}/spareParts`, formData);
  }

  download(url) {
    return this.http.get(url, {
      responseType: "blob",
      headers: {
        Accept: "*/*",
      },
    });
  }
}
export default InventoryUploadDownloadService;
