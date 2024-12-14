import { CONFIGURATION_CAMERA } from "../helpers/const-service";
import CrudService from "./crud-service";
class CameraService extends CrudService {
  url = CONFIGURATION_CAMERA;
}
export default CameraService;
