import { REGISTER_URL } from "../helper/service-url";
import CrudService from "./crud-service";

class UserService extends CrudService {
  url = REGISTER_URL;
}
export default UserService;
