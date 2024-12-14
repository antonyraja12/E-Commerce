import { CONFIGURATION_ADD_WARRANTY } from "../helpers/const-service";
import { rootUrl } from "../helpers/url";
import CrudService from "./crud-service";

class AddWarrantyService extends CrudService {
  url = CONFIGURATION_ADD_WARRANTY;
}
export default AddWarrantyService;
