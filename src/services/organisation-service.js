import { CONFIGURATION_ORGANISATION } from "../helpers/const-service";
import CrudService from "./crud-service";
class OrganisationService extends CrudService {
  url = CONFIGURATION_ORGANISATION;
  saveAll(data) {
    return this.http.post(`${this.url}/save-all`, data);
  }
  convertTree(list) {
    // let l = list.sort((a, b) => a.orderNumber - b.orderNumber);
    return this.children(list, null);
  }
  children(list, parent) {
    let filtered = list.filter((e) => e.parentId === parent);
    return filtered.map((e) => {
      let children = this.children(list, e.orgHierarchyId);
      let obj = { ...e };
      if (children.length > 0) {
        obj.children = children;
      }
      return obj;
    });
  }
}
export default OrganisationService;
