import { Menu, Tooltip } from "antd";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { MenuItemContext } from "./container";
import { useContext, useState, useEffect } from "react";
import UserService from "../../services/user-service";
import { icon } from "@fortawesome/fontawesome-svg-core";
function MainMenu({ mode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuData, setMenuData] = useState([]);

  const userService = new UserService();
  // const onMenuClick = (e) => {
  //   navigate(e.key);
  // };
  const items = useContext(MenuItemContext);
  const findKeyByLabel = (items, targetLabel) => {
    for (const item of items) {
      if (item.label === targetLabel) {
        return item.key;
      }
      if (item.children) {
        const foundKey = findKeyByLabel(item.children, targetLabel);
        if (foundKey) return foundKey;
      }
    }
    return null;
  };

  const selectedKey = pathname.includes("work-instruction")
    ? findKeyByLabel(menuData, "Work Instruction Master")
    : pathname.includes("work-station")
    ? findKeyByLabel(menuData, "Work Station Master")
    : pathname;

  const tooltipLengthThreshold = 13;
  const shouldShowTooltip = (name) => {
    return name.length > tooltipLengthThreshold;
  };
  const transformTreeData = (tree) => {
    return tree.map((node) => {
      const transformedNode = {
        key: `menu_${node.menuId}`,
        path: node.path ? node.path : node.children.map((e) => e?.path),

        label: node.children ? (
          shouldShowTooltip(node.menuName) ? (
            <Tooltip title={node.menuName} mouseLeaveDelay={0}>
              {node.menuName}
            </Tooltip>
          ) : (
            node.menuName
          )
        ) : shouldShowTooltip(node.menuName) ? (
          <Tooltip title={node.menuName} mouseLeaveDelay={0}>
            <NavLink
              className={({ isActive }) => (isActive ? "custom-active" : "")}
              to={node.path}
            >
              {node.menuName}
            </NavLink>
          </Tooltip>
        ) : (
          <NavLink
            className={({ isActive }) => (isActive ? "custom-active" : "")}
            to={node.path}
          >
            {node.menuName}
          </NavLink>
        ),
        children: node.children ? transformTreeData(node.children) : null,
        // className: node.children == null && "custom-menu-item",
        // className:
        //   node.children == null &&
        //   `custom-menu-item${isSelected ? ".selected" : ""}`,
      };

      return transformedNode;
    });
  };

  useEffect(() => {
    userService.getMenu().then(({ data }) => {
      setMenuData(transformTreeData(data));
    });
  }, []);
  //

  return (
    <>
      {menuData.length > 0 && (
        <Menu
          theme="dark"
          defaultOpenKeys={[`${menuData[0]?.key}`]}
          mode={mode ?? "horizontal"}
          items={menuData}
          style={{ backgroundColor: "inherit" }}
        />
      )}
    </>
  );
}

export default MainMenu;
