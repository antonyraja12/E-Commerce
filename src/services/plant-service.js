import CrudService from "./crud-service";
import { rootUrl } from "../helpers/url";
import { CONFIGURATION_PLANT } from "../helpers/const-service";
class PlantService extends CrudService {
  url = CONFIGURATION_PLANT;
}
export default PlantService;
