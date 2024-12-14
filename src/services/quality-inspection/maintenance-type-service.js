import CrudService from "../crud-service";
import PriorityService from "./priority-service";
import { response } from "msw";
import { QI_MAINTENANCE } from "../../helpers/const-service";

class MaintenanceTypeService extends CrudService {
  priority = new PriorityService();
  // service=new newRwoForm
  url = QI_MAINTENANCE;

  convertToTree(data, parent = null) {
    let result = data
      .filter((e) => e.maintenanceTypeParentId === parent)
      .map((e) => {
        let obj = { ...e };
        let children = this.convertToTree(data, e.maintenanceTypeId);
        if (children.length > 0) obj = { ...e, children: children };
        return obj;
      });
    return result;
  }
  convertToSelectTree(data, parent = null) {
    let result = data
      .filter((e) => e.maintenanceTypeParentId === parent)
      .map((e) => {
        let obj = { value: e.maintenanceTypeId, title: e.maintenanceTypeName };
        let children = this.convertToSelectTree(data, e.maintenanceTypeId);
        if (children.length > 0)
          obj = {
            value: e.maintenanceTypeId,
            title: e.maintenanceTypeName,
            children: children,
          };
        return obj;
      });

    return result;
  }
}

export default MaintenanceTypeService;
