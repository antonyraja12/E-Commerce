import { CONFIGURATION_GATEWAY } from "../helpers/const-service";
import CrudService from "./crud-service";
class MqttService extends CrudService {
  url = CONFIGURATION_GATEWAY;
}
export default MqttService;
