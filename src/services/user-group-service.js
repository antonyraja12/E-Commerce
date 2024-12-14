import CrudService from "./crud-service";
import { CONFIGURATION_USER_GROUP } from "../helpers/const-service";
class UserGroupService extends CrudService {
  url = CONFIGURATION_USER_GROUP;
}
export default UserGroupService;
