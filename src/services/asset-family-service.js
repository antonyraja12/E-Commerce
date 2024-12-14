import { CONFIGURATION_ASSET_FAMILY } from "../helpers/const-service";
import CrudService from "./crud-service";

class AssetFamilyService extends CrudService {
  url = CONFIGURATION_ASSET_FAMILY;
}
export default AssetFamilyService;
