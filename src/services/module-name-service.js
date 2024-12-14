import { CONFIGURATION_MODULE } from "../helpers/const-service";
import CrudService from "./crud-service";
class ModuleNameService extends CrudService {
  url = CONFIGURATION_MODULE;
}
export default ModuleNameService;
