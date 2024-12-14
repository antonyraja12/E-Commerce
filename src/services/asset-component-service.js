import { CONFIGURATION_COMPONENT } from "../helpers/const-service";
import CrudService from "./crud-service";

class ComponentService extends CrudService {
  url = CONFIGURATION_COMPONENT;
}
export default ComponentService;
