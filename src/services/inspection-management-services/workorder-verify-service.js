import CrudService from "../crud-service";
import { IM_RESOLUTION_WORK_ORDER_VERIFY } from "../../helpers/const-service";
class WorkOrderVerifyService extends CrudService {
  url = IM_RESOLUTION_WORK_ORDER_VERIFY;
}
export default WorkOrderVerifyService;