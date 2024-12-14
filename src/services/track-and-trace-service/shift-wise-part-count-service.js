import CrudService from "../crud-service";
import { TAT_PART_COUNT } from "../../helpers/const-service";

class ShiftWisePartCountService extends CrudService {
  url = TAT_PART_COUNT;
}

export default ShiftWisePartCountService;
