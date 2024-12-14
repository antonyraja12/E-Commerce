import CrudService from "../crud-service";
import { PM_PRIORITY } from "../../helpers/const-service";

class PriorityService extends CrudService {
  url = PM_PRIORITY;
}
export default PriorityService;
