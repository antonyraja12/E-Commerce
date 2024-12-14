import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LockOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Image,
  Layout,
  Tooltip,
  Typography,
  theme,
} from "antd";
import React, { useContext, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import LoginService from "../../services/login-service";
import MainMenu from "./main-menu";
import DynamicBreadcrumb from "./dynamic-breadcrumb";
import { ContainerContext } from "./container";
import UserChangePassword from "../../component/change-password/user-change-password";

const { Header, Sider } = Layout;
function TatHeader() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { collapse, setCollapse } = useContext(ContainerContext);
  const [passwordPopup, setPasswordPopup] = useState(false);
  const { logout } = useAuth();
  const signOut = async () => {
    await logout();
  };
  const getUserName = () => {
    const auth = new LoginService();
    return auth.getUserName();
  };

  return (
    <>
      <Header
        className="bg-white"
        style={{
          position: "sticky",
          top: 0,
          padding: "0px 10px",

          // boxShadow: "none",
          // height: "40px",
          backgroundColor: colorBgContainer,
          // padding: "0 10px",
          display: "flex",
          alignItems: "center",

          gap: 15,
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

        <DynamicBreadcrumb />
        <span style={{ marginRight: "auto" }}></span>
        {/* <NotificationSocket /> */}
        <div>
          <Dropdown
            arrow={true}
            trigger="click"
            dropdownRender={(menu) => {
              return (
                <Card
                  title={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <Avatar>A</Avatar>
                      <Typography.Title level={5} style={{ marginBottom: 0 }}>
                        {getUserName()}
                      </Typography.Title>
                    </div>
                  }
                >
                  {React.cloneElement(menu, {
                    style: { boxShadow: "none" },
                  })}
                </Card>
              );
            }}
            menu={{
              items: [
                // {
                //   key: "0",
                //   label: <h2>{getUserName}</h2>,
                //   disabled: true,
                // },
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
            <Tooltip title={getUserName()} placement="left">
              <Button icon={<UserOutlined />} />
            </Tooltip>
          </Dropdown>
        </div>
      </Header>
      <UserChangePassword
        open={passwordPopup}
        close={() => setPasswordPopup(!passwordPopup)}
      />
    </>
  );
}

export default TatHeader;
