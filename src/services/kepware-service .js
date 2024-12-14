import { CONFIGURATION_KEPWARE } from "../helpers/const-service";
import CrudService from "./crud-service";
class KepwareService extends CrudService {
  url = CONFIGURATION_KEPWARE;
}
export default KepwareService;
