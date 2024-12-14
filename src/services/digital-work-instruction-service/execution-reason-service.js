import CrudService from "../crud-service";

import { PAUSE_REASON } from "../../helpers/const-service";

class WorkInstructionPauseReasonService extends CrudService {
  url = PAUSE_REASON;

  ResumeHit(id, endTime) {
    return this.http.put(`${this.url}/resume-time/${id}?endTime=${endTime}`);
  }
}
export default WorkInstructionPauseReasonService;
