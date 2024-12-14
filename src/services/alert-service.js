import { CONFIGURATION_ALERTS } from "../helpers/const-service";
import { rootUrl } from "../helpers/url";
import CrudService from "./crud-service";

class AlertService extends CrudService {
  url = CONFIGURATION_ALERTS;
}
export default AlertService;
