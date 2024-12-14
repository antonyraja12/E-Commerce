import { DJC_PRODUCTION } from "../../helpers/const-service";
import CrudService from "../crud-service";

export class ProductionService extends CrudService {
  url = DJC_PRODUCTION;
}
