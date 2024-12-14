import {
  DownOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Dropdown,
  Image,
  Layout,
  Space,
  Typography,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import UserChangePassword from "../../component/change-password/user-change-password";
import { primary } from "../../helpers/color";
import { useAuth } from "../../hooks/useAuth";
import SideMenu from "./SideMenu";
import "./main-container.css";
import moment from "moment";
import UserChangePassword from "../../component/change-password/user-change-password";
import { useAuth } from "../../hooks/useAuth";
const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;
const MainContainerThree = (props) => {
  // console.log("prop1", props);
  const auth = new LoginService();
  const { logout } = useAuth();
  const history = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState(moment());
  const [collapse, setCollapse] = React.useState(false);
  const [passwordPopup, setPasswordPopup] = useState(false);

  const breadcrumbItems = [
    {
      path: "/oee/downtime/reason-configuration",
      // title: "Downtime Configuration / Reason Configuration",
    },
  ];

  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const breadcrumbs = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    const item = breadcrumbItems.find((item) => item.path === url);
    return item ? (
      <Breadcrumb.Item key={url}>
        <div style={{ color: "black" }} to={url}>
          {item.title}
        </div>
      </Breadcrumb.Item>
    ) : null;
  });

  const getUserName = () => {
    return auth.getUserName();
  };
  const signOut = () => {
    logout();
  };
  useEffect(() => {
    setInterval(() => {
      setTime(moment());
    }, 1000);
  }, []);

  return auth.getToken() ? (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        onBreakpoint={(broken) => {
          setCollapse(broken);
        }}
        onCollapse={(collapsed, type) => {}}
        theme="dark"
        width={220}
        collapsed={collapse}
        style={{
          position: "sticky",
          height: "100vh",
          top: 0,
          left: 0,
          overflow: "auto",
          backgroundColor: primary,
          zIndex: 1000,
          width: "100%",
        }}
      >
        <Header
          theme="dark"
          style={{
            position: "sticky",
            top: 0,
            border: 0,
            boxShadow: "none",
            backgroundColor: "inherit",
            zIndex: 1000,
            width: "100%",
          }}
        >
          <Image
            src={collapse === true ? " /byteFactory.png" : " /byteFactory.png"}
            preview={false}
            style={{
              margin: "auto",
              maxWidth: "150px",
              position: "relative",
              top: "-0.2rem",
              zIndex: 1000,
            }}
          />
        </Header>
        <SideMenu
          style={{
            zIndex: 1000,
            width: "100%",
            backgroundColor: "inherit",
          }}
        />
      </Sider>

      <Layout style={{ zIndex: 1000, display: "100%", width: "100%" }}>
        <Header
          className="bg-white"
          style={{
            position: "sticky",
            top: 0,
            boxShadow: "none",
            height: "40px",
            backgroundColor: "inherit",
            padding: "0 10px",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            zIndex: 1000,
            width: "100%",
          }}
        >
          <Button
            type="text"
            onClick={() => setCollapse((value) => !value)}
            icon={collapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            style={{ zIndex: 1000 }}
          />

          <Breadcrumb
            separator={<span className="breadcrumb-separator">/</span>}
            style={{ margin: "16px 0", color: "	silver" }}
          >
            {breadcrumbs}
          </Breadcrumb>

          <span style={{ marginRight: "auto", zIndex: 1000 }}></span>

          <Avatar
            icon={<UserOutlined />}
            style={{
              backgroundColor: "grey",
            }}
          ></Avatar>
          <div>
            <Dropdown
              arrow={true}
              trigger="click"
              menu={{
                items: [
                  {
                    key: "1",
                    label: (
                      <a
                        href="#"
                        onClick={() => setPasswordPopup(!passwordPopup)}
                      >
                        Change Password
                      </a>
                    ),
                    icon: <LockOutlined />,
                  },
                  {
                    key: "2",
                    label: (
                      <a href="#" onClick={signOut}>
                        Logout
                      </a>
                    ),
                    icon: <LogoutOutlined />,
                  },
                ],
              }}
            >
              <a
                onClick={(e) => e.preventDefault()}
                style={{ color: "inherit" }}
              >
                <Space>
                  <Text strong>{getUserName()}</Text>
                  <Text style={{ fontSize: "10px" }}>
                    <DownOutlined />
                  </Text>
                </Space>
              </a>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            padding: "10px 10px",
            margin: 0,
            minHeight: 280,
            width: "100%",
          }}
        >
          <Outlet style={{ width: "100%" }} />
          <UserChangePassword
            open={passwordPopup}
            close={() => setPasswordPopup(!passwordPopup)}
          />
        </Content>
      </Layout>
    </Layout>
  ) : (
    <Navigate to="/login" />
  );
};

export default MainContainerThree;
