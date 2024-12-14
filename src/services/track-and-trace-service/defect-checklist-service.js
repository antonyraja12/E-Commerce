import CrudService from "../crud-service";
import { TAT_DEFECT_CHECKLIST } from "../../helpers/const-service";

class DefectChecklistService extends CrudService {
  url = TAT_DEFECT_CHECKLIST;
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
  updateSequence(data) {
    return this.http.put(`${this.url}/update-sequence`, data);
  }
}

export default DefectChecklistService;
