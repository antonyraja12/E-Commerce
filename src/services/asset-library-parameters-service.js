import { CONFIGURATION_ASSET_LIBRARY_PARAMETER } from "../helpers/const-service";
import CrudService from "./crud-service";

class AssetLibraryParametersService extends CrudService {
  url = CONFIGURATION_ASSET_LIBRARY_PARAMETER;

  AddParameter = (id, data) => {
    return this.http.post(`${this.url}/${id}/parameter`, data);
  };
  getParameter = (id) => {
    return this.http.get(`${this.url}/${id}/parameter`);
  };

  retrieve(assetId, parameterName) {
    return this.http.get(`${this.url}/${assetId}/${parameterName}`);
  }
  delete(assetId, parameterName) {
    return this.http.delete(`${this.url}/${assetId}/${parameterName}`);
  }
}
export default AssetLibraryParametersService;
