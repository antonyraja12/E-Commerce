import {
  LockOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Dropdown,
  Image,
  Layout,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import UserChangePassword from "../../component/change-password/user-change-password";
import { useAccess } from "../../hooks/useAccess";
import { useAuth } from "../../hooks/useAuth";
import NotificationSocket from "../../module/notification/notification";
import ActiveUserService from "../../services/current-user-service ";
import LoginService from "../../services/login-service";
import withStompSessionProvider from "../with-stomp-session-provider";
import SideMenu from "./SideMenu";
import "./main-container.css";
const { Header, Sider, Content, Footer } = Layout;
const { Text, Title } = Typography;
const MainContainer = (props) => {
  const [access, loading] = useAccess();
  const user = new ActiveUserService();
  const history = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const location = useLocation();
  const [time, setTime] = useState(moment());
  const dispatch = useDispatch();
  const [collapse, setCollapse] = React.useState(false);
  const [passwordPopup, setPasswordPopup] = useState(false);
  const [activeUserId, setActiveUserId] = useState();
  const [showChatbot, setShowChatbot] = useState(true);
  const { logout } = useAuth();
  const breadcrumbItems = [
    {
      path: "/dashboard",
      title: "Dashboard",
    },

    {
      path: "/reports",
      title: "Reports",
    },

    {
      path: "/scheduler",
      title: "Scheduler",
    },

    {
      path: "/configuration/checklist",
      title: "Configuration / Checklist",
    },
    {
      path: "/configuration/check-type",
      title: "Configuration / CheckType",
    },
    {
      path: "/configuration/app-hierarchy",
      title: "Configuration / Hierarchy",
    },
    {
      path: "/configuration/general/role",
      title: "Configuration / Role ",
    },
    {
      path: "/configuration/general/user",
      title: "Configuration / User",
    },
    {
      path: "/configuration/general/sms-mail-configuration",
      title: "Configuration / Mail - Sms - Configuration",
    },
    {
      path: "/configuration/general/useraccess",
      title: "Configuration / Useraccess",
    },
    {
      path: "/configuration/check",
      title: "Configuration / Check",
    },

    {
      path: "/checklist-execution",
      title: "ChecklistExecution",
    },
    {
      path: "/resolution-work-order",
      title: "Work-Order-Resolution",
    },
    {
      path: "/configuration/configuration",
      title: "Management-Console  /  Dashboard",
    },
    {
      path: "/configuration/region",
      title: "Management-Console  / Location / Region",
    },
    {
      path: "/configuration/country",
      title: "Management-Console  / Location / Country",
    },
    {
      path: "/configuration/state",
      title: "Management-Console  / Location / State",
    },
    {
      path: "/configuration/organisation",
      title: "Management-Console  /  Sites / Organisation",
    },
    {
      path: "/configuration/plant",
      title: "Management-Console  /  Sites / Site",
    },
    {
      path: "/configuration/user",
      title: "Management-Console  / Users /  User",
    },
    {
      path: "/configuration/role",
      title: "Management-Console  / Users / Role",
    },

    {
      path: "/configuration/gateway",
      title: "Management-Console  / IoT Gateway",
    },
    {
      path: "/configuration/asset-library",
      title: "Management-Console  /  Assets / Asset-Library",
    },
    {
      path: "/configuration/asset",
      title: "Configuration / Asset  ",
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

  const signOut = async () => {
    await logout();
  };

  const navigate = useNavigate();

  const adamNavlink = () => {
    navigate("/adam");
  };

  const marketPlaceButtonClick = () => {
    window.open("http://20.44.56.231/market-place", "_blank");
  };

  const getUserName = () => {
    const auth = new LoginService();
    return auth.getUserName();
  };

  useEffect(() => {
    setInterval(() => {
      setTime(moment());
    }, 1000);
    getCurrentUserList();
  }, []);
  const getCurrentUserList = () => {
    user.list().then((response) => {
      setActiveUserId(response.data.roleId);
    });
  };
  const handleCloseChatbot = () => {
    console.log(showChatbot, "showchatbot");
    setShowChatbot(false);
  };

  const handleChatBotOpen = () => {
    setShowChatbot(true);
  };
  const [paddingTop, setPaddingTop] = useState(220);

  useEffect(() => {
    // Example of how to update the padding dynamically
    const handleResize = () => {
      const newPaddingTop = window.innerWidth < 600 ? 150 : 220;
      setPaddingTop(newPaddingTop);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!isFullscreen && (
        <Sider
          breakpoint="lg"
          onBreakpoint={(broken) => {
            setCollapse(broken);
          }}
          onCollapse={(collapsed, type) => {}}
          theme="light"
          width={220}
          collapsed={collapse}
          style={{
            position: "sticky",
            height: "100vh",
            top: 0,
            left: 0,
            overflow: "auto",
            // backgroundColor: primary,
            // backgroundColor: "#233e7f",
            zIndex: 5,
            width: "100%",
          }}
        >
          <Link to="../main">
            <Header
              // theme="dark"
              style={{
                position: "sticky",
                top: 0,
                border: 0,
                boxShadow: "none",
                backgroundColor: "inherit",
                zIndex: -1,
                width: "100%",
                cursor: "pointer",
              }}
            >
              <Image
                src={`${process.env.PUBLIC_URL}${
                  collapse === true ? "/byteFactory.png" : "/byteFactory.png"
                }`}
                preview={false}
                style={{
                  margin: "auto",
                  maxWidth: "150px",
                  position: "relative",
                  top: "-0.2rem",
                  zIndex: -1,
                }}
              />
            </Header>
          </Link>
          <div
            className="menu"
            style={{ flex: 1, overflowY: "auto", height: "77vh" }}
          >
            <SideMenu style={{ zIndex: 2000, width: "100%" }} />
          </div>
          {!collapse && (
            <Footer
              style={{
                position: "sticky",
                bottom: 0,
                left: 0,
                width: "100%",
                textAlign: "center",
                // borderTop: "1px solid #f0f0f0",
                padding: "16px",
                backgroundColor: "white",
                zIndex: 1,
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontStyle: "italic",
                  fontWeight: "bold",
                }}
              >
                powered by
              </span>{" "}
              <Image
                src="/byteFactory.png"
                preview={false}
                style={{ maxWidth: "50%", display: "block", margin: "0 auto" }}
              />
            </Footer>
          )}
        </Sider>
      )}
      <Layout style={{ zIndex: 1000, display: "100%" }}>
        {!isFullscreen && (
          <Header
            className="bg-white"
            style={{
              position: "sticky",
              top: 0,
              // boxShadow: "none",
              // height: "40px",
              backgroundColor: "#ffffff",
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
            {!showChatbot && (
              <Tooltip title={"Adam Chatbot"}>
                <Button
                  className="header-button"
                  icon={
                    <img
                      src="/chatbot logo.png"
                      width="20px"
                      height="20px"
                      alt="Adam icon"
                      onClick={handleChatBotOpen}
                      style={{ cursor: "pointer" }}
                    />
                  }
                ></Button>
              </Tooltip>
            )}

            {/* <Tooltip title={"Market Place"}>
            <Button
              className="header-button"
              icon={<HiMiniShoppingBag />}
              onClick={marketPlaceButtonClick}
              style={{ width: 40 }}
            />
          </Tooltip> */}

            {/* <Button className="header-button"> */}

            <NotificationSocket />

            {/* </Button> */}

            <div>
              <Dropdown
                arrow={true}
                trigger="click"
                dropdownRender={(menu) => {
                  return (
                    <Card
                      bodyStyle={{ padding: "4px" }}
                      title={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <Avatar>A</Avatar>
                          <Typography.Title
                            level={5}
                            style={{ marginBottom: 0 }}
                          >
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
                  <Button className="header-button" icon={<UserOutlined />} />
                </Tooltip>
              </Dropdown>
            </div>
          </Header>
        )}

        <Content
          style={{
            padding: "10px 10px",
            margin: 0,
            minHeight: 280,
            width: "100%",
          }}
        >
          {/* {access == null || access.length == 0 ? (
            <Result
              status={"403"}
              title="403"
              subTitle="Sorry You are not authorized to access this page"
            />
          ) : (
            <Outlet style={{ width: "100%" }} />
          )} */}

          <Outlet
            style={{ width: "100%" }}
            context={{ isFullscreen, toggleFullscreen }}
          />

          <UserChangePassword
            open={passwordPopup}
            close={() => setPasswordPopup(!passwordPopup)}
          />
          {/* {showChatbot && (
            <AdamChatBot
              showChatbot={showChatbot}
              onCloseChatbot={handleCloseChatbot}
            />
          )} */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default withStompSessionProvider(MainContainer);
