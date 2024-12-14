import { OEE_MODEL_CONFIGURATION } from "../../helpers/const-service";
import { rootUrl } from "../../helpers/url";
import CrudService from "../crud-service";

class ModelConfigurationService extends CrudService {
  url = `${OEE_MODEL_CONFIGURATION}`;
  getassetIdlist(assetId) {
    // console.log("assetId", assetId);
    return this.http.get(`${this.url}/assetId?assetId=${assetId}`);
  }
}
export default ModelConfigurationService;
