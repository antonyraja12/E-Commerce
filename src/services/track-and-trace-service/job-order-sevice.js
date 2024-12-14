import CrudService from "../crud-service";
import { TAT_JOB_ORDER } from "../../helpers/const-service";

class TatJobOrderService extends CrudService {
  url = TAT_JOB_ORDER;
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
  setJobOrderStatus(jobOrderId, status) {
    return this.http.put(
      `${this.url}/status-update/${jobOrderId}?status=${status}`
    );
  }
}

export default TatJobOrderService;
