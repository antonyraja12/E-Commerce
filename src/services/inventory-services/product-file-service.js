import CrudService from "../crud-service";
import { PRODUCT_FILE } from "../../helpers/const-service";
class ProductFileService extends CrudService {
  url = PRODUCT_FILE;
}
export default ProductFileService;
