import CrudService from "../crud-service";
import { SUGGESTION_CONFIGURATION } from "../../helpers/const-service";
class SuggestionConfigurationService extends CrudService {
  url = SUGGESTION_CONFIGURATION;
}
export default SuggestionConfigurationService;
