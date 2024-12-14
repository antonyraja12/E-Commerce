import CrudService from "../crud-service";
import { TAT_LINE_MASTER } from "../../helpers/const-service";

class LineMasterService extends CrudService {
  url = TAT_LINE_MASTER;
  uploadFile(data) {
    return this.http.post(`${this.url}/excel/upload`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  exportFile() {
    return this.http.get(`${this.url}/excel/download`, {
      responseType: "blob",
    });
  }
}

export default LineMasterService;
