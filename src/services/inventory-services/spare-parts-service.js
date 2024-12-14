import CrudService from "../crud-service";
import { INQUIRE } from "../../helpers/const-service";
class InquireService extends CrudService {
  url = INQUIRE;

  product() {
    return this.http.get(`${this.url}/dashboard`, {
      params: { closed: false },
    });
  }
}
export default InquireService;
