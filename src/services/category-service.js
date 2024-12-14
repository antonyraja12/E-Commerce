import { CONFIGURATION_CATEGORY } from "../helpers/const-service";
import CrudService from "./crud-service";
class CategoryService extends CrudService {
  url = CONFIGURATION_CATEGORY;
}
export default CategoryService;
