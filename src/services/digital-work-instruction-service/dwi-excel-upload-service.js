import CrudService from "../crud-service";
import {
  TASK_CONFIG,
  WI_CONFIG,
  WI_EXCEL_UPLOAD,
} from "../../helpers/const-service";
class DigitalWorkInstructionExcelUploadService extends CrudService {
  url = WI_EXCEL_UPLOAD;
  url2 = WI_CONFIG;
  url3 = TASK_CONFIG;
  uploadFile(file) {
    let formData = new FormData();
    formData.append("file", file);
    return this.http.post(`${this.url}/excelFile`, formData);
  }
  template(name) {
    return this.http.get(`${this.url}/template?name=${name}`);
  }

  uploadDataId(id, data) {
    return this.http.post(`${this.url}/uploadData/${id}`, data);
  }

  uploadDataPreview(id, data, modeName) {
    return this.http.post(
      `${this.url}/preview/${id}?modeName=${modeName}`,
      data
    );
  }

  checkUpload(file) {
    let formData = new FormData();
    formData.append("file", file);
    return this.http.post(`${this.url}/check`, formData);
  }

  download(url) {
    return this.http.get(url, {
      responseType: "blob",
      headers: {
        Accept: "*/*",
      },
    });
  }
  mergeTask(id, tasks) {
    // console.log(id)
    const queryParams = tasks?.map((task) => `task=${task}`).join("&");
    return this.http.put(`${this.url2}/add-task/${id}?${queryParams}`);
  }
  imageUpload(file, id) {
    let formData = new FormData();
    formData.append("file", file);
    return this.http.put(`${this.url3}/update-image/${id}`, formData);
  }
}
export default DigitalWorkInstructionExcelUploadService;
