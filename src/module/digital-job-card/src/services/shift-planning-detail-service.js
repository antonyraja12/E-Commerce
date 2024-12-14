import { DJC_SHIFT_PLANNING_DETAIL } from "../../../../helpers/const-service";
import CrudService from "./crud-service";

export class ShiftPlanningDetailService extends CrudService {
  url = DJC_SHIFT_PLANNING_DETAIL;
  production(data, id) {
    return this.http.put(`${this.url}/production/${id}`, data);
  }
}
