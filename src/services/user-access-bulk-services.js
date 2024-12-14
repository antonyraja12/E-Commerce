import CrudService from "./crud-service";
import { CONFIGURATION_USER_ACCESS_BULK_ADD } from "../helpers/const-service";
class UserAccessBulkService extends CrudService {
  url = CONFIGURATION_USER_ACCESS_BULK_ADD;
}
export default UserAccessBulkService;
