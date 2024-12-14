import { CONFIGURATION_MODULE_CONFIG } from "../helpers/const-service";
import CrudService from "./crud-service";
class SmsMailAutoService extends CrudService {
  url = CONFIGURATION_MODULE_CONFIG;
}
export default SmsMailAutoService;
