import { DJC_JOB_ORDER } from "../../helpers/const-service";
import CrudService from "../crud-service";

export class JobOrderService extends CrudService {
  url = DJC_JOB_ORDER;
}
