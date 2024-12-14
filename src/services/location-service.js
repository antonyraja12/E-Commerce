import { CONFIGURATION_LOCATION } from "../helpers/const-service";
import CrudService from "./crud-service";
class LocationService extends CrudService {
  url = CONFIGURATION_LOCATION;


  convertToSelectTree(data, parent = null) {
    let result = data
      .filter((e) => e.parentId === parent)
      .map((e) => {
        let obj = { value: e.locationId, title: e.locationName };
        let children = this.convertToSelectTree(data, e.locationId);
        if (children.length > 0)
          obj = { value: e.locationId, title: e.locationName, children: children };
        return obj;
      });

    return result;
  }
}
export default LocationService;
