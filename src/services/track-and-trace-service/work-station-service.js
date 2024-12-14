import CrudService from "../crud-service";
import { TAT_WORK_STATION } from "../../helpers/const-service";

class WorkStationService extends CrudService {
  url = TAT_WORK_STATION;
  uploadFile(data) {
    return this.http.post(`${this.url}/excel/upload`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  exportFile() {
    return this.http.get(`${this.url}/excel/download`, {
      responseType: "blob",
    });
  }
  addorUpdateDevice(id, deviceId, data) {
    return this.http.post(`${this.url}/${id}/item/${deviceId}`, data);
  }
  listDevice(id) {
    return this.http.get(`${this.url}/${id}/item`);
  }
  retrieveDevice(id, deviceId) {
    return this.http.get(`${this.url}/${id}/item/${deviceId}`);
  }
  deleteDevice(id, deviceId) {
    return this.http.delete(`${this.url}/${id}/item/${deviceId}`);
  }
  addorUpdateProperty(id, data) {
    return this.http.post(`${this.url}/${id}/property`, data);
  }
  retrieveByPropertyName(id, propertyName) {
    return this.http.get(`${this.url}/${id}/property/${propertyName}`);
  }
  deletePropertyByName(id, propertyName) {
    return this.http.delete(`${this.url}/${id}/property/${propertyName}`);
  }
  addorUpdateSubscription(id, data) {
    return this.http.post(`${this.url}/${id}/subscription`, data);
  }
  retrieveBySubscriptionName(id, name) {
    return this.http.get(`${this.url}/${id}/subscription/${name}`);
  }
  deleteSubscriptionByName(id, name) {
    return this.http.delete(`${this.url}/${id}/subscription/${name}`);
  }
  addorUpdateService(id, data) {
    return this.http.post(`${this.url}/${id}/service`, data);
  }
  retrieveByServiceName(id, name) {
    return this.http.get(`${this.url}/${id}/service/${name}`);
  }
  deleteServiceByName(id, name) {
    return this.http.delete(`${this.url}/${id}/service/${name}`);
  }
  updatePropertyValue(id, parameterName, value) {
    return this.http.post(`${this.url}/${id}/update-values`, {
      [parameterName]: value,
    });
  }
  updateScanValue(id, data) {
    return this.http.post(`${this.url}/${id}/update-values`, data);
  }

  addCycleTime(data) {
    return this.http.post(`${this.url}/work-delay`, data);
  }
  getPropertyValue() {
    return this.http.get(`${this.url}/property-values`);
  }
}

export default WorkStationService;
