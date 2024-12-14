import CrudService from "../crud-service";
import { IM_RESOLUTION_WORK_ORDER_TIMELINE } from "../../helpers/const-service";
class WorkOrderTimelineService extends CrudService {
  url = IM_RESOLUTION_WORK_ORDER_TIMELINE;
}
export default WorkOrderTimelineService;
