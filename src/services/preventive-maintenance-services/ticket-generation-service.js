import CrudService from "../crud-service";
import { PM_TICKET_GENERATION } from "../../helpers/const-service";

class TicketGenerationService extends CrudService {
  url = PM_TICKET_GENERATION;

  getTicketGeneration(alertName, assetId) {
    return this.http.get(
      `${this.url}/list?assetId=${assetId}&alertName=${alertName}`
    );
  }
}
export default TicketGenerationService;
