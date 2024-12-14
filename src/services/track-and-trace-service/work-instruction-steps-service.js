import CrudService from "../crud-service";
import { TAT_WORK_INSTRUCTION } from "../../helpers/const-service";

class WorkInstructionStepsService extends CrudService {
  url = TAT_WORK_INSTRUCTION;

 retrieveByIds(data) {
    return this.http.get(`${this.url}/${data.workInstructionId}/task/${data.workStationId}/step`,data);
  }
 save(data,workInstructionId,workStationId) {
    return this.http.post(`${this.url}/${workInstructionId}/task/${workStationId}/step`, data);
}  
update(data,workInstructionId,workStationId) {
    return this.http.put(`${this.url}/${workInstructionId}/task/${workStationId}/step/${data.sequenceNumber}`, data, );
} 
}

export default WorkInstructionStepsService;
