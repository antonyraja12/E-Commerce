import { ENERGY, ENERGY_CALCULATION } from "../../helpers/const-service";
import { rootUrl } from "../../helpers/url";
import HttpClient from "../http";
class EnergyConsumptionDashboardService {
  http = new HttpClient();
  url = ENERGY;
  getbyOverallenergy(startDate, endDate, ahId) {
    return this.http.get(
      `${this.url}/total-consumption?startDate=${startDate}&endDate=${endDate}&ahId=${ahId}`
    );
  }
  getEnergyData(filter = {}) {
    return this.http.get(`${this.url}/list-energy-calc`, {
      params: filter,
    });
  }

  getEnergyDataShiftWise(filter = {}) {
    return this.http.get(`${this.url}/list-energy-shift-wise`, {
      params: filter,
    });
  }

  getLiveMonitoringData(filter = {}) {
    return this.http.get(`${ENERGY_CALCULATION}/get-energy-report`, {
      params: filter,
    });
  }

  getBarGraphData(filter = {}) {
    return this.http.get(`${this.url}/bar-graph`, {
      params: filter,
    });
  }
}
export default EnergyConsumptionDashboardService;
