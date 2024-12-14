import { DJC_ASSEMBLY_PLANNING_ITEM } from "../../../../helpers/const-service";
import CrudService from "./crud-service";

export class AssemblyPlanningItemService extends CrudService {
  url = DJC_ASSEMBLY_PLANNING_ITEM;
  production(data, id) {
    return this.http.put(`${this.url}/production/${id}`, data);
  }
}
