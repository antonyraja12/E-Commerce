import { TAT_DOWNTIME } from "../../helpers/const-service";
import CrudService from "../crud-service";

class DowntimeReasonService extends CrudService {
  url = TAT_DOWNTIME;

  getShiftDownTime = (id) => {
    return this.http.get(`${this.url}/shift-downtime-log/${id}`);
  };
}

export default DowntimeReasonService;
