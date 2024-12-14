import HttpClient from "../http";
import { QI_DASHBOARD } from "../../helpers/const-service";
class DashboardService {
  http = new HttpClient();
  dashboard(filter = {}) {
    return this.http.get(
      QI_DASHBOARD,

      {
        params: filter,
      }
    );
  }
}
export default DashboardService;
