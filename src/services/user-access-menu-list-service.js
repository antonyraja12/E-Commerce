import { NavLink } from "react-router-dom";
import { CONFIGURATION_USER_ACCESS_MENULIST } from "../helpers/const-service";
import CrudService from "./crud-service";
export default class UserAccessMenuListService extends CrudService {
  url = CONFIGURATION_USER_ACCESS_MENULIST;
  convertTree(list) {
    let l = list.sort((a, b) => a.orderNumber - b.orderNumber);
    return this.children(l, null);
  }
  children(list, parent) {
    let filtered = list.filter((e) => e.parentId == parent);
    return filtered.map((e) => {
      let children = this.children(list, e.menuId);
      let obj = { ...e, key: "MENU" + e.menuId };
      if (e.path) {
        obj.label = <NavLink to={e.path}>{e.menuName}</NavLink>;
      } else obj.label = e.menuName;
      if (children.length > 0) {
        obj.children = children;
        obj.label = e.menuName;
      }
      return obj;
    });
  }

  getMenuData() {
    return this.list({ status: true });
  }
}
