import { DJC_MASTER_SALE_ORDER } from "../../../../helpers/const-service";
import CrudService from "./crud-service";

export class SaleOrderService extends CrudService {
  url = DJC_MASTER_SALE_ORDER;
}
