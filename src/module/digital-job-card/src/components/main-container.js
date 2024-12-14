import { useState } from "react";
import { Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
const { Header, Sider, Content } = Layout;
function MainContainer() {
  const [collapsed, isCollapsed] = useState(false);
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const items = [
    {
      label: "Master",
      key: "master",
      children: [
        {
          label: <Link to="./master/operator">Department</Link>,
          key: "department",
        },
        {
          label: <Link to="./master/operator">Machine Category</Link>,
          key: "machine-category",
        },
        {
          label: <Link to="./master/machine">Machine</Link>,
          key: "machine-master",
        },
        {
          label: <Link to="./master/operator">Operator</Link>,
          key: "operator-master",
        },

        {
          label: <Link to="./master/shift-calendar">Shift Calendar</Link>,
          key: "shift-calendar-master",
        },
        {
          label: <Link to="./master/shift">Shift</Link>,
          key: "shift-master",
        },
      ],
    },

    {
      label: "Inventory",
      key: "inventory",
      children: [
        {
          label: <Link to="./shift/planning">Raw Material</Link>,
          key: "raw-material",
        },
        {
          label: <Link to="./product-module">Product</Link>,
          key: "product_module",
        },
      ],
    },
    {
      label: "Job Card",
      key: "jobcard",
      children: [
        {
          label: <Link to="./shift/planning">Planning</Link>,
          key: "shift-planning",
        },
      ],
    },
  ];
  return (
    <Layout
      style={{
        minHeight: "100vh",
        // padding: "10px",
      }}
    >
      {/* <Sider
        collapsed={collapsed}
        style={{
          height: "100vh",
          backgroundColor: "#ffffff",
        }}
      >
        <Header
          style={{
            backgroundColor: "#ffffff",
          }}
        ></Header>
        <Menu mode="inline" items={items} />
      </Sider> */}
      <Layout>
        {/* <Header style={{ backgroundColor: colorPrimary }}></Header> */}
        <Content>
          <div
          // style={{
          //   padding: "10px",
          // }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainContainer;
