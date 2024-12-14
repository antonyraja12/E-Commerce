import CrudService from "./crud-service";
import { rootUrl } from "../helpers/url";
class WorkOrderReportService extends CrudService {
  url = `${rootUrl}/resolution-work-order/report`;
}
export default WorkOrderReportService;
