import { OEE_AVAILABILITY } from "../../helpers/const-service";
import CrudService from "../crud-service";
class AvailabilityCalculationService extends CrudService {
  url = OEE_AVAILABILITY;
}
export default AvailabilityCalculationService;
