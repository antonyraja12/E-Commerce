import CrudService from "../crud-service";

import { SHIFT_MASTER } from "../../helpers/const-service";

class ShiftMasterService extends CrudService {
  url = SHIFT_MASTER;
}
export default ShiftMasterService;
