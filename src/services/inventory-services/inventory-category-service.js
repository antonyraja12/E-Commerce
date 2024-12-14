import { SPARE_PART_TYPE } from "../../helpers/const-service";
import CrudService from "../crud-service";

class InventoryCategoryService extends CrudService {
  url = SPARE_PART_TYPE;
}

export default InventoryCategoryService;
