import { rootUrl } from "../../helpers/url";
import CrudService from "../crud-service";
class AppHierarchyCustomerListService extends CrudService {
  url = `${rootUrl}/customer`;
  getCustomerData(filter = {}) {
    return this.http.get(`${this.url}/customer-details`, {
      params: filter,
    });
  }
}
export default AppHierarchyCustomerListService;
