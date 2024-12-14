import { CONFIGURATION_COLOR } from "../helpers/const-service";
import CrudService from "./crud-service";

class ColorService extends CrudService {
  url = CONFIGURATION_COLOR;
}
export default ColorService;
