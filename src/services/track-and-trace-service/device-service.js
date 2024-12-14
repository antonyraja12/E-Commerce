import CrudService from "../crud-service";
import { TAT_DEVICE } from "../../helpers/const-service";

class DeviceService extends CrudService {
  url = TAT_DEVICE;
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

export default DeviceService;
