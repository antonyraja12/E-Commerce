import CrudService from "../crud-service";
import { PRODUCT } from "../../helpers/const-service";
class ProductService extends CrudService {
  url = PRODUCT;

  productVerification(id) {
    return this.http.post(`${this.url}/product`, {
      alertId: id,
    });
  }
}
export default ProductService;
