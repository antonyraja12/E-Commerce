import { CONFIGURATION_ASSET_PARAMETER } from "../helpers/const-service";
import CrudService from "./crud-service";

class AssetParametersService extends CrudService {
  url = CONFIGURATION_ASSET_PARAMETER;
  retrieve(assetId, parameterName) {
    return this.http.get(`${this.url}/${assetId}/${parameterName}`);
  }
  delete(assetId, parameterName) {
    return this.http.delete(`${this.url}/${assetId}/${parameterName}`);
  }
}
export default AssetParametersService;
