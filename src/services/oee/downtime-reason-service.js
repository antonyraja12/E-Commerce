import { OEE_DOWNTIMEREASON } from "../../helpers/const-service";
import CrudService from "../crud-service";

class DowntimeReasonService extends CrudService {
  url = OEE_DOWNTIMEREASON;

  convertToTree(data, parent = null) {
    let result = data
      .filter((e) => e.parentId === parent)
      .map((e) => {
        let obj = { ...e };
        let children = this.convertToTree(data, e.downtimeReasonId);
        if (children.length > 0) obj = { ...e, children: children };
        return obj;
      });
    return result;
  }
}
export default DowntimeReasonService;
