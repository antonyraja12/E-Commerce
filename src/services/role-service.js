import { CONFIGURATION_ROLE } from "../helpers/const-service";
import CrudService from "./crud-service";
class RoleService extends CrudService {
  url = CONFIGURATION_ROLE;
}
export default RoleService;
