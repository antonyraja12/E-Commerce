import CrudService from "./crud-service";
import { rootUrl } from "../helpers/url";
class OverAllDashboardService extends CrudService {
  url=`${rootUrl}/main-dashboard`;
  getAll() {
    return this.http.get(`${this.url}/over-all-machines`);
  }
}

export default OverAllDashboardService;
