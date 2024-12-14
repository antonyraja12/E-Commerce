import CrudService from "../crud-service";
import { TAT_WORK_INSTRUCTION } from "../../helpers/const-service";

class WorkInstructionService extends CrudService {
  url = TAT_WORK_INSTRUCTION;
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

export default WorkInstructionService;
