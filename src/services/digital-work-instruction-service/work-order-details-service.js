import CrudService from "../crud-service";
import { WI_CONFIG } from "../../helpers/const-service";

class WorkInstructionService extends CrudService {
  url = WI_CONFIG;
  mergeTask(id, tasks) {
    const queryParams = tasks?.map((task) => `task=${task}`).join("&");
    return this.http.put(`${this.url}/add-task/${id}?${queryParams}`);
  }
  updateStatus = (id) => {
    return this.http.put(`${this.url}/${id}`, { status: true });
  };
}
export default WorkInstructionService;
