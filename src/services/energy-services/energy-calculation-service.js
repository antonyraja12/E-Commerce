import { ENERGY, ENERGY_CALC } from "../../helpers/const-service";
import HttpClient from "../http";
class EnergyCalculationService {
  http = new HttpClient();
  url = ENERGY_CALC;

  getLiveMonitoringData(filter = {}) {
    return this.http.get(`${this.url}/get-energy-report`, {
      params: filter,
    });
  }
  getCurrentEnergyData(filter = {}) {
    return this.http.get(`${this.url}/get-current-energy`, {
      params: filter,
    });
  }
}
export default EnergyCalculationService;
