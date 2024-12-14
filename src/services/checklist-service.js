import { PM_CHECKLIST } from "../helpers/const-service";
import CrudService from "./crud-service";
class CheckListService extends CrudService {
  url = PM_CHECKLIST;
}
export default CheckListService;
