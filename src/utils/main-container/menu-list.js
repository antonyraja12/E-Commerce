import { Avatar, Menu } from "antd";
import { useEffect, useState } from "react";
// import MenuService from "../services/menu-service";
import MenuService from "../../services/menu-service";
function MenuList(props) {
  const service = new MenuService();
  const [items, setItems] = useState([]);
  const [rootSubmenuKeys] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const [openKeys, setOpenKeys] = useState(["Mkey1"]);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  const menuSet = (data, level = 0) => {
    return data?.map((e) => {
      // console.log("eee",e)
      let obj = {
        ...e,
        icon: e.icon && level === 0 ? e.icon : null,
      };
      if (e.children) obj.children = menuSet(e.children, level + 1);
      return obj;
    });
  };
  // useEffect(() => {
  //   setItems(menuSet(props.list));
  // }, [props.list]);
  // useEffect(() => {
  //   setItems(menuSet(props.list));
  // }, [props.list]);
  useEffect(() => {
    // service
    //   .userMenu()
    //   .then((response) => {
    //     console.log(service.convertTree(response.data));
    //     setItems(menuSet(service.convertTree(response.data)));
    //   })
    //   .catch((error) => console.log(error));
  }, []);
  return (
    <>
      <Menu
        mode="inline"
        theme="dark"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={items}
        //  inlineCollapsed={true}
        // collapsed={collapsed}
        // collapsible={false}
        style={{
          backgroundColor: "transparent",
          border: 0,
        }}
      />
    </>
  );
}

export default MenuList;
