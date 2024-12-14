import CrudService from "../crud-service";
import { QI_RESOLUTION_WORK_ORDER_RESOLVE } from "../../helpers/const-service";
class WorkOrderResolveService extends CrudService {
  url = QI_RESOLUTION_WORK_ORDER_RESOLVE;
}
export default WorkOrderResolveService;
