import { CONFIGURATION_ASSET_ALERT } from "../helpers/const-service";
import { rootUrl } from "../helpers/url";
import CrudService from "./crud-service";

class AssetAlertsService extends CrudService {
  url = CONFIGURATION_ASSET_ALERT;
  list(assetId, filter = {}) {
    return this.http.get(`${this.url}/${assetId}`, {
      params: filter,
    });
  }
  edit(assetId, parameterName, alertName) {
    return this.http.get(
      `${this.url}/${assetId}/${parameterName}/${alertName}`
    );
  }
  delete(assetId, parameterName, alertName) {
    return this.http.delete(
      `${this.url}/${assetId}/${parameterName}/${alertName}`
    );
  }
  retrieve(assetId, parameterName, alertName) {
    return this.http.get(
      `${this.url}/${assetId}/${parameterName}/${alertName}`
    );
  }
}
export default AssetAlertsService;
