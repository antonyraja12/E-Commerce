import CrudService from "./crud-service";

import {CONFIGURATION_MENULIST } from "../helpers/const-service";
class UserAccessFeatureService extends CrudService {
  url = CONFIGURATION_MENULIST;
  
}
export default UserAccessFeatureService;