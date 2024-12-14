import CrudService from "./crud-service";
import { rootUrl } from "../helpers/url";
class WorkOrderService extends CrudService{
    url=`${rootUrl}/country`

}
export default WorkOrderService;