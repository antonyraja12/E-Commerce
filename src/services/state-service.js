import { CONFIGURATION_STATE } from "../helpers/const-service";
import CrudService from "./crud-service";
class StateService extends CrudService {
  url = CONFIGURATION_STATE;
}
export default StateService;
