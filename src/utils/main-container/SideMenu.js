import { Menu, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import UserService from "../../services/user-service";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { menuRefresh } from "../../store/actions";
// import "./menu-test.css";
const SideMenu = () => {
  const [selectedKey, setSelectedKey] = useState([""]);
  const [menuData, setMenuData] = useState([]); // Initialize with an empty array
  const [collapsed, setCollapsed] = useState(false);
  const [menuRef, setMenuRef] = useState(false);
  const menuList = useSelector((state) => state.loggedReducer.menuList);
  const tatMenu = [
    {
      menuId: 1001,
      menuName: "Dashboard",
      path: "/tat/dashboard",
      children: null,
    },
    {
      menuId: 1002,
      menuName: "Andon",
      path: "/tat/andon",
      children: null,
    },
    {
      menuId: 1003,
      menuName: "Traceability",
      path: "/tat/traceability",
      children: null,
    },
    // {
    //   menuId: 1004,
    //   menuName: "Reports",
    //   path: "/tat/report",
    //   children: null,
    // },
    {
      menuId: 1005,
      menuName: "Configuration",
      path: "/tat",
      children: null,
    },
  ];
  const menuRefreshData = useSelector(
    (state) => state.loggedReducer.menuRefresh
  );
  const dispatch = useDispatch();
  const userService = new UserService();
  const location = useLocation();

  useEffect(() => {
    if (menuRefreshData) {
      if (location.pathname.includes("/tat")) {
        setMenuData(transformTreeData(tatMenu));
      } else {
        userService.getMenu().then(({ data }) => {
          setMenuData(transformTreeData(data));
        });
      }
      dispatch(menuRefresh(false));
    } else if (location.pathname.includes("/tat")) {
      setMenuData(transformTreeData(tatMenu));
      setMenuRef(true);
    } else if (menuRef) {
      userService.getMenu().then(({ data }) => {
        setMenuData(transformTreeData(data));
      });
      setMenuRef(false);
    }
  }, [menuRefreshData, location.pathname]);
  useEffect(() => {
    if (location.pathname.includes("/tat")) {
      setMenuData(transformTreeData(tatMenu));
    } else {
      userService.getMenu().then(({ data }) => {
        setMenuData(transformTreeData(data));
      });
    }
  }, []);
  const tooltipLengthThreshold = 13; // Adjust this as needed

  // Function to determine if tooltip should be shown
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
            <NavLink to={node.path}>{node.menuName}</NavLink>
          </Tooltip>
        ) : (
          <NavLink to={node.path}>{node.menuName}</NavLink>
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
  const getSelectedKey = (pathname, nodes) => {
    for (const node of nodes) {
      if (node?.children) {
        for (const child of node?.children) {
          if (Array.isArray(child?.path)) {
            const menuId = child.children.find((e) => e.path == pathname);

            if (menuId) {
              setSelectedKey(menuId.key);
              return;
            }
          } else {
            if (child.path == pathname) {
              setSelectedKey(child.key);
              return;
            }
          }
        }
      } else {
        setSelectedKey(node?.key);
      }
    }
  };
  useEffect(() => {
    // getSelectedKey(location.pathname, menuData);
  }, [location.pathname]);

  return (
    <Menu
      selectedKeys={selectedKey}
      mode="inline"
      theme="light"
      inlineCollapsed={collapsed}
      items={menuData}
    />
  );
};

export default SideMenu;
