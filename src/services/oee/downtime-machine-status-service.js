import { rootUrl } from "../../helpers/url";
import CrudService from "../crud-service";

class DownTimeMachineStatusService extends CrudService {
  url = `${rootUrl}/downtime`;
  getmachinestatus(data) {
    return this.http.post(`${this.url}/down-time`, data);
  }
}

export default DownTimeMachineStatusService;
