import CrudService from "../crud-service";
import { PM_CHECKLIST_EXECUTION_IMAGEUPLOAD } from "../../helpers/const-service";

class ImageUploadService extends CrudService {
  url = PM_CHECKLIST_EXECUTION_IMAGEUPLOAD;
  image(id, files, checkid, remarks, status) {
    let formData = new FormData();
    files.forEach((file, index) => {
      if (file.originFileObj) formData.append(`files`, file.originFileObj);
      else formData.append(`imageUrlList`, file.path);
    });
    // formData.append("file", file);
    formData.append("id", checkid);
    if (remarks) formData.append("remark", remarks);
    if (status) formData.append("status", status);
    return this.http.put(`${this.url}/image/${checkid}`, formData);
  }
}
export default ImageUploadService;
