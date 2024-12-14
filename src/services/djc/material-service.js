import { DJC_MATERIAL } from "../../helpers/const-service";
import CrudService from "../crud-service";

export class MaterialService extends CrudService {
  url = DJC_MATERIAL;

  getProductionProduct() {
    return this.http.get(`${this.url}/production_master`);
  }
}
