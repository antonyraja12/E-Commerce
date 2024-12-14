import CrudService from "../crud-service";
import { DISPATCH } from "../../helpers/const-service";
class DispatchSpareService extends CrudService {
  url = DISPATCH;

  upadteStatus(status, id) {
    return this.http.put(`${this.url}/status-update/${id}?status=${status}`);
  }
}
export default DispatchSpareService;
