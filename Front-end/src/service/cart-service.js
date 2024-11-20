import { LOGIN_URL, CART_URL } from "../helper/service-url";
import CrudService from "./crud-service";

class CartService extends CrudService {
  url = CART_URL;
}
export default CartService;
