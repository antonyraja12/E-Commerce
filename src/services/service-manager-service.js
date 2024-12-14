import { CONFIGURATION_SERVICE_MANAGER } from "../helpers/const-service";
import CrudService from "./crud-service";
class ServiceManagerService extends CrudService {
  url = CONFIGURATION_SERVICE_MANAGER;
}
export default ServiceManagerService;
