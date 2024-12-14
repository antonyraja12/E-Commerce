import CrudService from "./crud-service";
import { CBM_PARAMETER_GRAPH } from "../helpers/const-service";
class ParameterGraphService extends CrudService {
  url = CBM_PARAMETER_GRAPH;
  getbyparameterassetId(assetId, parameterName, startDate, endDate) {
    return this.http.get(
      `${this.url}/parameter-report?assetId=${assetId}&parameterName=${parameterName}&startDate=${startDate}&endDate=${endDate}`
    );
  }
}
export default ParameterGraphService;
