import HttpClient from "../http";
import { IM_DASHBOARD } from "../../helpers/const-service";
class DashboardService {
  http = new HttpClient();
  dashboard(filter = {}) {
    return this.http.get(
      IM_DASHBOARD,

      {
        params: filter,
      }
    );
  }
}
export default DashboardService;
