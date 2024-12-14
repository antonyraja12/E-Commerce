import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb, Layout, Menu } from "antd";
import { useContext } from "react";
import { MenuItemContext } from "./container";

const findBreadcrumb = (path, menu) => {
  let breadcrumb = [];

  // Recursive function to search through nested menus
  const searchMenu = (items, paths = []) => {
    for (let item of items) {
      const newPaths = [...paths, item];
      if (item.key === path) {
        breadcrumb = newPaths;
        return true;
      } else if (item.children) {
        if (searchMenu(item.children, newPaths)) {
          return true;
        }
      }
    }
    return false;
  };

  searchMenu(menu);
  return breadcrumb;
};
const DynamicBreadcrumb = (props) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const menuItems = useContext(MenuItemContext);

  // Find breadcrumb from the current URL
  const breadcrumbItems = findBreadcrumb(currentPath, menuItems ?? []);

  return (
    <Breadcrumb {...props}>
      {breadcrumbItems.map((item, index) => (
        <Breadcrumb.Item key={item.key}>
          {index !== breadcrumbItems.length - 1 ? (
            <Link to={item.key}>{item.label}</Link>
          ) : (
            item.label
          )}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
