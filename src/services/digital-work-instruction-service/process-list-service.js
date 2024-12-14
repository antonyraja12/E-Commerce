import CrudService from "../crud-service";
import { PROCESS_LIST } from "../../helpers/const-service";

class ProcessListService extends CrudService {
  url = PROCESS_LIST;
}
export default ProcessListService;
