import { DJC_PRODUCT_ASSEMBLY_ROUTING } from "../../../../helpers/const-service";
import { rootUrl } from "../utils/helper";
import CrudService from "./crud-service";

export class ProductAssemblyRoutingService extends CrudService {
  url = DJC_PRODUCT_ASSEMBLY_ROUTING;
}
