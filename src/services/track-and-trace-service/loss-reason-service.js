import CrudService from "../crud-service";
import { TAT_LOSS_REASON } from "../../helpers/const-service";

class LossReasonService extends CrudService {
  url = TAT_LOSS_REASON;
}

export default LossReasonService;
