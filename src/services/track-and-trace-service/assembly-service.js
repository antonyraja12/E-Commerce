import HttpClient from "../http";

import { TAT_ASSEMBLY } from "../../helpers/const-service";
import CrudService from "../crud-service";

class AssemblyService extends CrudService {
  url = TAT_ASSEMBLY;
  http = new HttpClient();
  list(filter = {}) {
    return this.http.get(`${this.url}`, {
      params: filter,
    });
  }
  updateStatus(status, id) {
    return this.http.put(`${this.url}/status-update/${id}?status=${status}`);
  }
  getLastEntryList(filter = {}) {
    return this.http.get(`${this.url}/last-entries`, {
      params: filter,
    });
  }
  labelRePrint(id, label) {
    return this.http.post(
      `${this.url}/reprint?assemblyId=${id}&label=${label}`
    );
  }
}

export default AssemblyService;
