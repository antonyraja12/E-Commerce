import CrudService from "./crud-service";
import { rootUrl } from "../helpers/url";
class EmailService extends CrudService{
    url=`${rootUrl}/location`;

}
export default EmailService;