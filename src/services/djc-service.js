import CrudService from "./crud-service";
import { djcUrl } from "../helpers/url";

export class djcService extends CrudService {
  url = djcUrl + "/master/machine";
}
