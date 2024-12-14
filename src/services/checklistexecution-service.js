import { PM_CHECKLIST_EXECUTION } from "../helpers/const-service";
import CrudService from "./crud-service";
class CheckListExecutionService extends CrudService {
  url = PM_CHECKLIST_EXECUTION;
}
export default CheckListExecutionService;
