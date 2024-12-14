import CrudService from "./crud-service";
import { rootUrl } from "../helpers/url";
import { PM_CHECKLIST } from "../helpers/const-service";
class CardService extends CrudService {
  url = PM_CHECKLIST;
}
export default CardService;
