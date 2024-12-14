import HttpClient from "../http";

import { TAT_ASSEMBLY_REWORK_SUB } from "../../helpers/const-service";
import CrudService from "../crud-service";

class AssemblyReworkSubService extends CrudService {
  url = TAT_ASSEMBLY_REWORK_SUB;
  //   http = new HttpClient();
  //   list(filter = {}) {
  //     return this.http.get(`${this.url}`, {
  //       params: filter,
  //     });
  //   }
}

export default AssemblyReworkSubService;
