import HttpClient from "../http";
import { PM_DASHBOARD } from "../../helpers/const-service";
class DashboardService {
  http = new HttpClient();
  dashboard(filter = {}) {
    return this.http.get(
      PM_DASHBOARD,

      {
        params: filter,
      }
    );
  }
}
export default DashboardService;
