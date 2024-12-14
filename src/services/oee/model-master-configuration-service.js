import { OEE_MODEL_MASTER } from "../../helpers/const-service";
import CrudService from "../crud-service";

class ModelMasterConfigurationService extends CrudService {
  url = OEE_MODEL_MASTER;
}
export default ModelMasterConfigurationService;
