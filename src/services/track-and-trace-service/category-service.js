import CrudService from "../crud-service";
import { TAT_CATEGORY } from "../../helpers/const-service";

class CategoryService extends CrudService {
  url = TAT_CATEGORY;
}
export default CategoryService;
