import { CONFIGURATION_FLOOR } from "../helpers/const-service";
import CrudService from "./crud-service";
class FloorService extends CrudService {
  url = CONFIGURATION_FLOOR;
}
export default FloorService;
