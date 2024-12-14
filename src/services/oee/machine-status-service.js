import { OEE_MACHINE_STATUS } from "../../helpers/const-service";
import CrudService from "../crud-service";

class MachineStatusService extends CrudService {
  url = OEE_MACHINE_STATUS;
  getassetId(assetId, startDate, endDate, ahId, shiftName) {
    return this.http.get(
      `${this.url}?aHId=${ahId}&assetId=${assetId}&startDate=${startDate}&endDate=${endDate}&shiftName=${shiftName}`
    );
  }
  machineStatus(assetId) {
    return this.http.get(`${this.url}/machineStatus?id=${assetId}`);
  }
}
export default MachineStatusService;
