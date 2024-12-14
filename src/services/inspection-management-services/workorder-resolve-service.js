import CrudService from "../crud-service";
import { IM_RESOLUTION_WORK_ORDER_RESOLVE } from "../../helpers/const-service";
class WorkOrderResolveService extends CrudService {
  url = IM_RESOLUTION_WORK_ORDER_RESOLVE;
}
export default WorkOrderResolveService;
