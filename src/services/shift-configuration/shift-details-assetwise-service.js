import { SHIFT_DETAIL_ASSETWISE } from "../../helpers/const-service";
import { rootUrl } from "../../helpers/url";
import CrudService from "../crud-service";

class ShiftDetailsAssetwiseService extends CrudService {
  url = `${SHIFT_DETAIL_ASSETWISE}`;
  bulkAdd(data) {
    return this.http.post(`${SHIFT_DETAIL_ASSETWISE}/bulk`, data);
  }
}
export default ShiftDetailsAssetwiseService;
