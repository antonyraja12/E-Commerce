import { CONFIGURATION_GATEWAY_CONFIG } from "../helpers/const-service";
import CrudService from "./crud-service";

class GatewayMappingService extends CrudService {
  url = CONFIGURATION_GATEWAY_CONFIG;
}
export default GatewayMappingService;
