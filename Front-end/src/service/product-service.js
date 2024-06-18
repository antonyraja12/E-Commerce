import { LOGIN_URL, PRODUCT_URL } from "../helper/service-url";
import CrudService from "./crud-service";

class ProductService extends CrudService {
  url = PRODUCT_URL;
}
export default ProductService;
