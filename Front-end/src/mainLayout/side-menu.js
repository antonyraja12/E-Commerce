import React from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router-dom";
function SideMenu() {
  return (
    <Menu
      style={{
        width: 256,
      }}
      defaultSelectedKeys={["home"]}
      //   defaultOpenKeys={["sub1"]}
      mode="inline"
    >
      <Menu.Item key="home" icon={<AppstoreOutlined />}>
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="category" icon={<MailOutlined />}>
        <Link to="/category">Category</Link>
      </Menu.Item>
      <Menu.Item key="about" icon={<SettingOutlined />}>
        <Link to="/about">About</Link>
      </Menu.Item>
    </Menu>
  );
}

export default SideMenu;
