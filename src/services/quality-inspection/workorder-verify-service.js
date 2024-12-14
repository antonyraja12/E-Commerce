import CrudService from "../crud-service";
import { QI_RESOLUTION_WORK_ORDER_VERIFY } from "../../helpers/const-service";
class WorkOrderVerifyService extends CrudService {
  url = QI_RESOLUTION_WORK_ORDER_VERIFY;
}
export default WorkOrderVerifyService;
