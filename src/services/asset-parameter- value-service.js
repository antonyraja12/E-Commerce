import { CBM_PARAMETER_VALUE } from "../helpers/const-service";
import CrudService from "./crud-service";

class AssetParametersValueService extends CrudService {
  url = CBM_PARAMETER_VALUE;

  getParameterValue(assetId) {
    return this.http.get(`${this.url}`, {
      params: {
        assetId: assetId,
      },
    });
  }
}
export default AssetParametersValueService;
