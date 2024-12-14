import { SPARE_DASHBOARD, STOCK_JOURNAL } from "../../helpers/const-service";
import CrudService from "../crud-service";

class DashboardService extends CrudService {
  url = SPARE_DASHBOARD;

  dashboard(filter = {}) {
    return this.http.get(`${this.url}/dashboard`, { params: filter });
  }
}

export default DashboardService;
