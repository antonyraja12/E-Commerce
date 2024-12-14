import { OEE_DOWNTIME } from "../../helpers/const-service";
import { rootUrl } from "../../helpers/url";
import CrudService from "../crud-service";

class DowntimeService extends CrudService {
  url = OEE_DOWNTIME;

  add(machineStatusId, data) {
    return this.http.post(`${this.url}/${machineStatusId}`, data);
  }

  updateDataById(dtStreamId, updatedData) {
    return this.http.put(`${this.url}/${dtStreamId}`, updatedData);
  }
  getmachinestatus(data) {
    return this.http.post(`${this.url}/downtime`, data);
  }

  getdowntimelist(filter = {}) {
    return this.http.get(`${this.url}/downTimeList`, {
      params: filter,
    });
  }
}

export default DowntimeService;
