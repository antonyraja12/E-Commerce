import CrudService from "../crud-service";
import { WI_EXECUTION } from "../../helpers/const-service";

class WorkInstructionExeccutoinService extends CrudService {
  url = WI_EXECUTION;

  HandleTime(id, endTime) {
    this.http.put(`${this.url}/execution-end-time/${id}?endTime=${endTime}`);
  }
}
export default WorkInstructionExeccutoinService;
