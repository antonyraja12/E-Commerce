import { APP_HIERARCHY } from "../../helpers/const-service";
import CrudService from "../crud-service";
class AppHierarchyService extends CrudService {
  url = APP_HIERARCHY;

  getLocation(filter = {}) {
    return this.http.get(`${this.url}/location`, {
      params: filter,
    });
  }
  addOrganization(formData) {
    return this.http.post(`${this.url}/Organization`, formData);
  }
  updateOrganization(formData, id) {
    return this.http.put(`${this.url}/Organization/${id}`, formData);
  }
  convertToTree(data, parent = null) {
    let result = data
      .filter((e) => e.ahparentId === parent)
      .map((e) => {
        let obj = { ...e };
        let children = this.convertToTree(data, e.ahid);
        if (children.length > 0) obj = { ...e, children: children };
        return obj;
      });
    return result;
  }
  convertToSelectTree(data, parent = null) {
    let result = data
      .filter((e) => e.ahparentId === parent)
      .map((e) => {
        let obj = { value: e.ahid, title: e.ahname };
        let children = this.convertToSelectTree(data, e.ahid);
        if (children.length > 0)
          obj = { value: e.ahid, title: e.ahname, children: children };
        return obj;
      });

    return result;
  }
  destructureSelectTree(data, selectedId) {
    let result = [];
    const findAncestors = (id) => {
      const item = data.find((e) => e.ahid === id);
      if (item) {
        result.push({
          value: item.ahid,
          title: item.ahname,
          parentId: item.ahparentId,
        });
        if (item.ahparentId !== null) {
          findAncestors(item.ahparentId);
        }
      }
    };

    findAncestors(parseInt(selectedId));
    return result.reverse();
  }
}
export default AppHierarchyService;
