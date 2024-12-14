import { CONFIGURATION_ASSET_LIBRARY_ALERT } from "../helpers/const-service";
import CrudService from "./crud-service";

class AssetLibraryAlertsService extends CrudService {
  url = CONFIGURATION_ASSET_LIBRARY_ALERT;

  AddAlert = (id, data) => {
    return this.http.post(`${this.url}/${id}/alert`, data);
  };
}
export default AssetLibraryAlertsService;
