import HttpClient from "./http";
import { rootUrl } from "../helpers/url";
import { ENERGY } from "../helpers/const-service";
class EnergyLiveMonitoringService {
  http = new HttpClient();
  url = `${ENERGY}`;
  getEnergyData(filter = {}) {
    return this.http.get(`${this.url}/list-energy-shift-wise`, {
      params: filter,
    });
  }

  getLiveMonitoringData(filter = {}) {
    return this.http.get(`${ENERGY}/get-energy-report`, {
      params: filter,
    });
  }

  getTotal(filter = {}) {
    return this.http.get(`${ENERGY}/energyMonitoring`, {
      params: filter,
    });
  }

  getCumulativeEnergy(filter = {}) {
    return this.http.get(`${ENERGY}/cumulative-energy-consumption`, {
      params: filter,
    });
  }

  list(filter = {}) {
    return this.http.get(`${ENERGY}/list-energy-calc`, {
      params: filter,
    });
  }

  saveTodaysComsumption(data) {
    return this.http.post(`${this.url}/save-todayconsumption`, data);
  }
}
export default EnergyLiveMonitoringService;
