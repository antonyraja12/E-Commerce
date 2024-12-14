import CrudService from "../crud-service";
import { QI_RESOLUTION_WORK_ORDER_TIMELINE } from "../../helpers/const-service";
class WorkOrderTimelineService extends CrudService {
  url = QI_RESOLUTION_WORK_ORDER_TIMELINE;
}
export default WorkOrderTimelineService;
