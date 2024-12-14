import CrudService from "./crud-service";
import { CONFIGURATION_FILTER } from "../helpers/const-service";
class FilterService extends CrudService {
  url = CONFIGURATION_FILTER;
}
export default FilterService;
