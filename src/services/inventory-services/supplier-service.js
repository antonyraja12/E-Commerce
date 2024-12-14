import { SUPPLIER } from "../../helpers/const-service";
import CrudService from "../crud-service";

class SupplierService extends CrudService {
  url = SUPPLIER;
}

export default SupplierService;
