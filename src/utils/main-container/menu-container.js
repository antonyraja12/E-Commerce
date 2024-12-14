import {
  CaretLeftOutlined,
  CaretRightOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Button, Layout, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import MenuService from "../../services/menu-service";
import MenuList from "./menu-list";

const { Header, Content, Sider } = Layout;
function MenuContainer(props) {
  // const dispatch = useDispatch();
  const menuService = new MenuService();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [collapse, setCollapse] = useState(false);
  const menuList = useSelector((state) => state.loggedReducer.menuList);
  useEffect(() => {
    // dispatch(customerStatus());
    setCollapse(false);
    let path;
    let m = menuList?.map((e) => {
      if (e.path) {
        let paths = e.path?.split("/");
        if (paths.length > 1) paths = paths.slice(1);
        path = paths?.join("/");
      } else path = e.path;

      let obj = {
        ...e,
        path: path,
      };
      return obj;
    });

    let menu = menuService.convertTree(m);
    setSelectedItem(
      menu.find((e) => {
        let path = `/${e.path}`;
        return location.pathname.indexOf(path) !== -1;
      })
    );
  }, [location.pathname, menuList]);

  return (
    <Layout>
      <Sider
        hidden
        width={250}
        collapsed={collapse}
        collapsedWidth={0}
        className="site-layout-background"
        style={{
          flexDirection: "column",
          borderRight: 0,
          position: "sticky",
          height: "100vh",
          padding: 0,
          top: 0,
          left: 0,

          overflowX: "scroll",
          display: "flex",
        }}
      >
        <div
          style={{
            flexDirection: "column",
            height: "100vh",
            display: "flex",
          }}
        >
          <Header
            style={{
              // flex: "1 1 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingLeft: 25,
              background: "transparent",
              boxShadow: "none",
            }}
          >
            <Button
              type="text"
              onClick={() => setCollapse((value) => !value)}
              icon={collapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            />
            <Typography.Title level={5} style={{ margin: 0 }}>
              {selectedItem?.menuName}
            </Typography.Title>
            <Button
              type="default"
              shape="circle"
              size="small"
              icon={collapse ? <CaretRightOutlined /> : <CaretLeftOutlined />}
              onClick={() => setCollapse(!collapse)}
              style={{
                position: "absolute",
                right: 0,
                zIndex: 9,
                top: "70px",
                transform: "translateX(50%)",
              }}
            />
            {/* {collapse ? (
            <img src="/naffco-logo.png" className="logo collapse" />
          ) : (
            <img src="/logo.png" className="logo" />
          )} */}
          </Header>
          <div
            style={{
              flexGrow: "1",
              //  height: "calc(100% - 64px)",
              overflowX: "hidden",
            }}
          >
            <MenuList list={selectedItem?.children} />
          </div>
          <div style={{ display: "flex", alignSelf: "center" }}>
            <img src="/logo.png" className="logo" />
          </div>
        </div>
      </Sider>
      <Layout>
        <Content
          style={{
            padding: "10px 10px",
            margin: 0,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MenuContainer;
