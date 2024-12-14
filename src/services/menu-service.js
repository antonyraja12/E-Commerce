import { NavLink } from "react-router-dom";
import { CONFIGURATION_MENU } from "../helpers/const-service";
import CrudService from "./crud-service";
export default class MenuService extends CrudService {
  url = CONFIGURATION_MENU;
  // url = `${rootUrl}/module-selection/menu-list`;

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
        obj.label = <NavLink to={e.path}> {e.menuName} </NavLink>;
      } else obj.label = e.menuName;
      if (children.length > 0) {
        obj.children = children;
        obj.label = e.menuName;
      }
      return obj;
    });
  }
  convertTreeOption(l) {
    var map = {},
      node,
      roots = [],
      i;
    let list = [];
    let originalList = l.sort((a, b) => a.orderNumber - b.orderNumber);

    for (i = 0; i < originalList.length; i += 1) {
      map[originalList[i].menuId] = i; // initialize the map
      list.push({
        parentId: originalList[i].parentId,
        value: originalList[i].menuId,
        label: originalList[i].menuName,
        children: [],
      }); // initialize the children
    }
    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.parentId !== null && node.parentId !== 0) {
        // if you have dangling branches check that map[node.parentId] exists
        list[map[node.parentId]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  getMenuData() {
    return this.list({ status: true });
  }
}
