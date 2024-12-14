// import CrudService from "./crud-service";
// import { rootUrl } from "../helpers/url";
// class UploadDownloadService extends CrudService {
//   url = `${rootUrl}/upload`;
//   parameterUpload(file, id) {
//     let formData = new FormData();
//     formData.append("file", file);
//     return this.http.post(
//       `${this.url}/assetParameter-upload?id=${id}`,
//       formData
//     );
//   }
//   alertUpload(file, id) {
//     let formData = new FormData();
//     formData.append("file", file);
//     return this.http.post(`${this.url}/assetAlert-upload?id=${id}`, formData);
//   }

//   organisationUpload(file, orgName) {
//     let formData = new FormData();
//     formData.append("file", file);
//     formData.append("organisationName", orgName);
//     return this.http.post(`${this.url}/management-upload`, formData);
//   }

//   download(url) {
   
//     return this.http.get(url, {
//       responseType: "blob",
//       headers: {
//         Accept: '*/*'
//       },
     
//     });
//   }

// }
// export default UploadDownloadService;


import CrudService from "./crud-service";
import { CONFIGURATION_UPLOAD } from "../helpers/const-service";
class UploadDownloadService extends CrudService {
  url = CONFIGURATION_UPLOAD;
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
    return this.http.post(`${this.url}/check`, formData);
  }

  download(url) {
    return this.http.get(url, {
      responseType: "blob",
      headers:{
        Accept:'*/*'
      },
    });
  }
}
export default UploadDownloadService;

