import { CONFIGURATION_SMS } from "../helpers/const-service";
import CrudService from "./crud-service";
class SmsConfigurationService extends CrudService {
  url = CONFIGURATION_SMS;
}
export default SmsConfigurationService;
