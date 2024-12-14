import CrudService from "../crud-service";
import { rootUrl } from "../../helpers/url";
import { SHIFT_MASTER_ASSETWISE } from "../../helpers/const-service";

class ShiftDetailAssetWiseservice extends CrudService {
  url = SHIFT_MASTER_ASSETWISE;
}
export default ShiftDetailAssetWiseservice;
