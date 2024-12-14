import { CONFIGURATION_EMAIL } from "../helpers/const-service";
import CrudService from "./crud-service";
class MailConfigurationService extends CrudService {
  url = CONFIGURATION_EMAIL;
}
export default MailConfigurationService;
