import CrudService from "./crud-service";
import { rootUrl } from "../helpers/url";
class ParameterGraphService extends CrudService {
  url = `${rootUrl}/thingworx`;
  getbyparameterassetId(assetId, parameterName) {
    return this.http.get(
      `${this.url}/parameter-report?assetId=${assetId}&parameterName=${parameterName}`
    );
  }
}
export default ParameterGraphService;
