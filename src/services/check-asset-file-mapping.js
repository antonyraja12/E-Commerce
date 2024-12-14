// import CrudService from "./crud-service";
// import { rootUrl } from "../helpers/url";
// class CheckAssetFileMappingService extends CrudService{
//     url=`${rootUrl}/pm-check-assets-file-mapping`

// }
// export default CheckAssetFileMappingService;

import { PM_CHECK_ASSET_FILE_MAPPING } from "../helpers/const-service";
import CrudService from "./crud-service";

class CheckAssetFileMappingService extends CrudService {
  url = PM_CHECK_ASSET_FILE_MAPPING;

  uploadFile = (file) => {
    // console.log("service trigred", file);
    const response = this.http.post(
      `${this.url}/file`,
      { file },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  };
  delete(id) {
    return this.http.post(`${this.url}/${id}`, {});
  }
}

export default CheckAssetFileMappingService;
