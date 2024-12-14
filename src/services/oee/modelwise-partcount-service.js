import { OEE_PERFORMANCE_CALCULATION } from "../../helpers/const-service";
import CrudService from "../crud-service";
class ModelWisePartCountService extends CrudService {
  url = OEE_PERFORMANCE_CALCULATION;
  getModelWisePartCount(data) {
    return this.http.get(`${this.url}/model-wise-partcount`, {
      params: data,
    });
  }
}
export default ModelWisePartCountService;
