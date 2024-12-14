import { OEE_MODEL_TARGETED_PART_COUNT } from "../../helpers/const-service";
import CrudService from "../crud-service";

class ModelTotalPartCountService extends CrudService {
  url = OEE_MODEL_TARGETED_PART_COUNT;

  postTargetedPartCount(data) {
    return this.http.post(`${this.url}`, data);
  }
}
export default ModelTotalPartCountService;
