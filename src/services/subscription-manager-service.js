import { CONFIGURATION_SUBSCRIPTION_MANAGER } from "../helpers/const-service";
import CrudService from "./crud-service";
class SubscriptionManagerService extends CrudService {
  url = CONFIGURATION_SUBSCRIPTION_MANAGER;
  retrieve(assetId, name) {
    return this.http.get(`${this.url}/${assetId}/${name}`);
  }
  delete(assetId, name) {
    return this.http.delete(`${this.url}/${assetId}/${name}`);
  }
}
export default SubscriptionManagerService;
