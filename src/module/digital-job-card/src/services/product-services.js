import { DJC_PRODUCT } from "../../../../helpers/const-service";
import CrudService from "./crud-service";

export class ProductService extends CrudService {
  url = DJC_PRODUCT;
}
