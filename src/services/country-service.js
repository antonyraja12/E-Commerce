import { CONFIGURATION_COUNTRY } from "../helpers/const-service";
import CrudService from "./crud-service";
class CountryService extends CrudService {
  url = CONFIGURATION_COUNTRY;
}
export default CountryService;
