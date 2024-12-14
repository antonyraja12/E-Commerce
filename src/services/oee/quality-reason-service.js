import { OEE_QUALITY_REJECTION_REASON } from "../../helpers/const-service";
import CrudService from "../crud-service";

class QualityReasonService extends CrudService {
  url = OEE_QUALITY_REJECTION_REASON;

  convertToTree(data, parent = null) {
    let result = data
      .filter((e) => e.parentId === parent)
      .map((e) => {
        let obj = { ...e };
        let children = this.convertToTree(data, e.qualityRejectionReasonId);
        if (children.length > 0) obj = { ...e, children: children };
        return obj;
      });
    return result;
  }
}
export default QualityReasonService;
