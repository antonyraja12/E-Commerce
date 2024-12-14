import CrudService from "../crud-service";
import { TAT_WORK_STATION_INSTANCE } from "../../helpers/const-service";

class WorkStationInstanceService extends CrudService {
  url = TAT_WORK_STATION_INSTANCE;

  callService(workStationId, serviceName, argument = {}) {
    return this.http.post(
      `${this.url}/${workStationId}/callService/${serviceName}`,
      argument
    );
  }
  activate(jobOrderId) {
    return this.http.post(`${this.url}/set-job/${jobOrderId}`);
  }

  start(workStationId) {
    return this.http.post(`${this.url}/${workStationId}/start`, {});
  }
  restart(workStationId) {
    return this.http.post(`${this.url}/${workStationId}/restart`, {});
  }
  connection(workStationId, connectionId) {
    return this.http.post(
      `${this.url}/${workStationId}/connection/${connectionId}`,
      {}
    );
  }

  getAll() {
    return this.http.get(`${this.url}/start-all`);
  }
}

export default WorkStationInstanceService;
