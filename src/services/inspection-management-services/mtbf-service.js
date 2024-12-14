import { IM_RESOLUTION_WORK_ORDER } from "../../helpers/const-service";

import CrudService from "../crud-service";
class MtbfService extends CrudService {
  url = IM_RESOLUTION_WORK_ORDER;
  getbyaHId(aHId) {
    return this.http.get(`${this.url}/MTBF-Value?aHId=${aHId}`);
  }
}
export default MtbfService;
