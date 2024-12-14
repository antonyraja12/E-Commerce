import { CONFIGURATION_USERLIST } from "../helpers/const-service";
import CrudService from "./crud-service";
class ActiveUserService extends CrudService {
  url = CONFIGURATION_USERLIST;
}
export default ActiveUserService;
