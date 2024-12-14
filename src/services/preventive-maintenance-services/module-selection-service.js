import CrudService from "../crud-service";
import { PM_MODULE_SELECTION } from "../../helpers/const-service";

class ModuleSelectionService extends CrudService {
  url = PM_MODULE_SELECTION;
  basedOnAhid = (ahid) => {
    return this.http.get(`${this.url}/based-on-aHId?ahId=${ahid}`);
  };
}
export default ModuleSelectionService;
