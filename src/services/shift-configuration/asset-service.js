import CrudService from "../crud-service";
import { rootUrl } from "../../helpers/url";

class AssetService extends CrudService{
    url=`${rootUrl}/asset`;
}
export default AssetService ;