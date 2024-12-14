import CrudService from "./crud-service";
import { rootUrl } from "../helpers/url";
class ProcessService extends CrudService{
    url=`${rootUrl}/role`;
}
export default ProcessService;