import CrudService from "../crud-service";
import { PM_RESOLUTION_WORK_ORDER_TIMELINE } from "../../helpers/const-service";
class WorkOrderTimelineService extends CrudService {
  url = PM_RESOLUTION_WORK_ORDER_TIMELINE;
}
export default WorkOrderTimelineService;
