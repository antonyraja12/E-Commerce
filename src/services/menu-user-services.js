import { CONFIGURATION_MENU } from "../helpers/const-service";
import CrudService from "./crud-service";
class MenuUserService extends CrudService {
  url = CONFIGURATION_MENU;
}
export default MenuUserService;
