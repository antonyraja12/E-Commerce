import { OEE_QUALITY_CONFIGURATION } from "../../helpers/const-service";
import CrudService from "../crud-service";

class QualityCalculationService extends CrudService {
  url = OEE_QUALITY_CONFIGURATION;
}
export default QualityCalculationService;
