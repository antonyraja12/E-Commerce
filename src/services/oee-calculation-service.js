import { OEE_CALCULATION } from "../helpers/const-service";
import CrudService from "./crud-service";

class OeeCalculationService extends CrudService {
  url = OEE_CALCULATION;
  getbyOverall(startDate, endDate, ahId) {
    return this.http.get(
      `${this.url}/dashboard-oee-value?startDate=${startDate}&endDate=${endDate}&ahId=${ahId}`
    );
  }
  getbyahId(ahId) {
    return this.http.get(`${this.url}`, {
      params: {
        ahId: ahId,
      },
    });
  }
  getByAssetId(assetId) {
    return this.http.get(`${this.url}/${assetId}`);
  }

  getbyassetId(assetId) {
    return this.http.get(`${this.url}/oee-calculation?assetId=${assetId}`);
  }
  getGraph(params = {}) {
    return this.http.get(`${this.url}/trends`, {
      params: params,
    });
  }
  getMachineStatus({ startDate, endDate, assetId }) {
    return this.http.get(`${this.url}/over-all-machine-status`, {
      params: {
        startDate: startDate,
        endDate: endDate,
        assetId: assetId,
      },
    });
  }
  getMachineStatusSummary({ startDate, endDate, assetId }) {
    return this.http.get(`${this.url}/machine-status-summary`, {
      params: {
        startDate: startDate,
        endDate: endDate,
        assetId: assetId,
      },
    });
  }

  getLossPercentage({ startDate, endDate, assetId }) {
    return this.http.get(`${this.url}/loss-percentage`, {
      params: {
        startDate: startDate,
        endDate: endDate,
        assetId: assetId,
      },
    });
  }

  getManualEntry(assetId) {
    return this.http.get(`${this.url}/oee-manual-entry`, {
      params: { assetId: assetId },
    });
  }
  postManualEntry(data) {
    return this.http.post(`${this.url}/oee-manual-entry`, data);
  }
  putManualEntry(id, data) {
    return this.http.put(`${this.url}/oee-manual-entry?manualId=${id}`, data);
  }
}
export default OeeCalculationService;
