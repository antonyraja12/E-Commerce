import { CONFIGURATION_GATEWAY } from "../helpers/const-service";
import CrudService from "./crud-service";
class GatewayService extends CrudService {
  url = CONFIGURATION_GATEWAY;
}
export default GatewayService;
