import { rootUrl } from "../helpers/url";
import CrudService from "./crud-service";

class WorkflowService extends CrudService {
  url = `${rootUrl}/work-flow`;
}
export default WorkflowService;
