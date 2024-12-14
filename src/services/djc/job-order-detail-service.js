import {
  DJC_JOB_ORDER,
  DJC_JOB_ORDER_DETAIL,
} from "../../helpers/const-service";
import CrudService from "../crud-service";

export class JobOrderDetailService extends CrudService {
  url = DJC_JOB_ORDER_DETAIL;
}
