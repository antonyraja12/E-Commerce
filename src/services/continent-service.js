import { CONFIGURATION_CONTINENT } from "../helpers/const-service";
import CrudService from "./crud-service";
class ContinentService extends CrudService {
  url = CONFIGURATION_CONTINENT;
}
export default ContinentService;
