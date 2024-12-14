import { DYNAMIC_DASHBOARD_CONFIGURATION } from "../helpers/const-service";
import CrudService from "./crud-service";

class DynamicDashboardConfigurationService extends CrudService {
  url = DYNAMIC_DASHBOARD_CONFIGURATION;
}
export default DynamicDashboardConfigurationService;
