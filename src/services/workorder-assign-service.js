import CrudService from "./crud-service";
import { rootUrl } from "../helpers/url";
class WorkOrderAssignService extends CrudService {
  url = `${rootUrl}/resolution-work-order/conduct`;
}
export default WorkOrderAssignService;
