import CrudService from "../crud-service";
import { TAT_WORK_INSTRUCTION } from "../../helpers/const-service";

class WorkInstructionTaskService extends CrudService {
  url = TAT_WORK_INSTRUCTION;

  retrieveByWorkInstructionId(workInstructionId) {
    return this.http.get(`${this.url}/${workInstructionId}/task`);
  }
  save(data, id, workStationId, workInstructionTaskName, seqNo) {
    console.log("seqNoseqNo", seqNo);

    return this.http.post(
      `${this.url}/${id}/task/add/${workStationId}?workInstructionTaskName=${workInstructionTaskName}&seqNo=${seqNo}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }
  update(data, workInstructionId, workStationId) {
    return this.http.put(
      `${this.url}/${workInstructionId}/task/${workStationId}`,
      data
      // {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // }
    );
  }
}

export default WorkInstructionTaskService;
