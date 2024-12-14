import { FILTER_MASTER } from "../../../helpers/const-service";
import CrudService from "../../../services/crud-service";

class FilterService extends CrudService {
  url = FILTER_MASTER;
}
export default FilterService;
