import {
  CalendarOutlined,
  LockOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Flex,
  Image,
  Layout,
  Menu,
  Tooltip,
  Typography,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { publicUrl } from "../../helpers/url";
import LoginService from "../../services/login-service";
import LogoService from "../../services/logo-service";
import "./main-container.css";

import { useSubscription } from "react-stomp-hooks";

import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { IoMdContract, IoMdExpand, IoMdPerson } from "react-icons/io";
import UserChangePassword from "../../component/change-password/user-change-password";
import { useAccess } from "../../hooks/useAccess";
import { useAuth } from "../../hooks/useAuth";
import NotificationSocket from "../../module/notification/notification";
import NotificationService from "../../module/notification/service/notification-service";
import UserService from "../../services/user-service";
import { setMainDashboard } from "../../store/actions";
import withStompSessionProvider from "../with-stomp-session-provider";

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;
const MainContainerTat = (props) => {
  const location = useLocation();
  const hideHeader = location.pathname.includes("tat/work-station");
  const [access, loading] = useAccess();
  const notificationservice = new NotificationService();
  const [visible, setVisible] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const [showChatbot, setShowChatbot] = useState(true);
  const { logout } = useAuth();
  const dispatch = useDispatch();
  const list = useSelector((state) => state.notificationReducer.list);
  const userservice = new UserService();

  useEffect(() => {
    const service = new NotificationService();
    service.list().then(({ data }) => {
      dispatch({ type: "NOTIFICATION_LIST_", data: data });
    });
  }, [dispatch]);
  useSubscription("/topic/notification", (message) => {
    let body = JSON.parse(message.body);
    dispatch({ type: "NOTIFICATION_LIST_", data: [body, ...list] });
    const obj = {
      message: body.title,
      description: body.description,
      duration: null,
      placement: "topRight",
    };
    if (body?.priority === 1) {
      notification.error({ ...obj, duration: 5 });
    }
    //  else {
    //   notification.warning({ ...obj, duration: 10 });
    // }
  });
  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };
  const handleCloseChatbot = () => {
    console.log(showChatbot, "showchatbot");
    setShowChatbot(false);
  };

  const handleChatBotOpen = () => {
    setShowChatbot(true);
  };
  const Data = () => {
    return notificationservice
      .list()
      .then((response) => {
        setNotificationData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Notification data:", error);
      });
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await userservice.getCurrentUser();
      const setUserRoleName = response.data?.role?.roleName;
      const setUserName = response.data.userName;
      auth.saveUserRoleName(setUserRoleName);
      auth.saveUserName(setUserName);
    } catch (error) {
      console.error("Error fetching current user data:", error);
    }
  };
  const userData = fetchCurrentUser();
  useEffect(() => {
    Data();
  }, []);
  const notificationContent = (
    <Menu>
      {notificationData.map((notification) => (
        <Menu.Item key={notification.notificationId}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              style={{ backgroundColor: "#1EDBAE" }}
              icon={<CalendarOutlined />}
            />
            <div style={{ marginLeft: "8px" }}>
              <Text strong>{notification.title}</Text>
              <br />
              <Text type="secondary">{notification.description}</Text>
            </div>
          </div>
        </Menu.Item>
      ))}
      <Menu.Divider />
    </Menu>
  );
  const reduxAhId = useSelector((state) => state.mainDashboardReducer.ahId);
  const reduxAssetId = useSelector(
    (state) => state.mainDashboardReducer.selectedAssetId
  );

  useEffect(() => {
    if (reduxAhId === null) {
      const localStorageAhId = localStorage.getItem("AHID");
      if (localStorageAhId !== null) {
        dispatch(setMainDashboard("SET_AHID", localStorageAhId));
      }
    }
  }, []);
  const auth = new LoginService();
  const Logoservice = new LogoService();
  const history = useNavigate();

  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [logoUrl, setLogoUrl] = useState([]);
  const [passwordPopup, setPasswordPopup] = useState(false);

  const signOut = () => {
    logout();
  };
  const getLogo = () => {
    Logoservice.getData().then(({ data }) => {
      const mainLogoArray = data[0].mainLogo
        ? [
            {
              uid: "-1",
              name: data[0].mainLogo,
              status: "done",
              url: `${publicUrl}/${data[0].mainLogo}`,
            },
          ]
        : [];
      setLogoUrl(mainLogoArray);
    });
  };

  const navigate = useNavigate();

  const adamNavlink = () => {
    navigate("adam");
  };

  const getUserName = () => {
    return auth.getUserName();
  };

  const getUserRoleName = () => {
    return auth.getUserRoleName();
  };

  const marketPlaceButtonClick = () => {
    window.open("http://20.44.56.231/market-place");
  };

  // useEffect(() => {
  //   fetchCurrentUser();
  // }, []);
  const handleFull = useFullScreenHandle();
  return auth.getToken() ? (
    <FullScreen handle={handleFull}>
      {/* <StompSessionProvider url={webSocketUrl}> */}
      <Layout style={{ minHeight: "100vh" }}>
        {!hideHeader && (
          <Header
            style={{
              position: "sticky",
              top: 0,
              boxShadow: "2px 0 10px #0000000d",
              height: "70px",
              background: "#ffffff",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: "15px",
              zIndex: 1000,
              width: "100%",
              borderBottom: 0,
            }}
          >
            <Flex
              style={{
                padding: "0 10px",
                width: "100%",
                margin: "auto",
                maxWidth: "1240px",
              }}
            >
              <Flex gap={10} align="baseline">
                {/* <Button icon={<MenuOutlined />} type="text" /> */}
                <Link to="../main">
                  <Image
                    src="/Panasonic.png"
                    preview={false}
                    style={{
                      maxWidth: "150px",
                      position: "relative",
                    }}
                  />
                </Link>
              </Flex>
              <span style={{ marginRight: "auto", zIndex: 1000 }}></span>
              <Flex gap={25} align="center">
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
                {/* <Tooltip title={"Dashboard Designer"}>
                  <Link to="dashboard-designer" style={{ display: "flex" }}>
                    <Button
                      className="header-button"
                      icon={<MdDashboardCustomize />}
                    />
                  </Link>
                </Tooltip> */}
                {/* <Tooltip title={"Market Place"}>
                  <Button
                    className="header-button"
                    onClick={marketPlaceButtonClick}
                    icon={<HiMiniShoppingBag />}
                  />
                </Tooltip> */}
                {/* <Tooltip placement="topRight" title={"Power BI"}>
                <Button
                  className="header-button"
                  onClick={adamNavlink}
                  icon={<SiPowerbi />}
                />
              </Tooltip> */}

                {fullScreenMode ? (
                  <Tooltip title={"Exit Full-screen"}>
                    <Button
                      className="header-button"
                      icon={<IoMdContract />}
                      onClick={() => {
                        setFullScreenMode(false);
                        handleFull.exit();
                      }}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title={"Full-screen"}>
                    <Button
                      className="header-button"
                      icon={<IoMdExpand />}
                      onClick={() => {
                        setFullScreenMode(true);
                        handleFull.enter();
                      }}
                    />
                  </Tooltip>
                )}

                <NotificationSocket />
                <Dropdown
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  arrow={true}
                  trigger="click"
                  menu={{
                    items: [
                      {
                        key: "1",
                        disabled: true,
                        label: (
                          <>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {/* <Avatar size="small" icon={<UserOutlined />} src={profilePicture} /> */}
                              <Avatar icon={<UserOutlined />} />
                              <div style={{ marginLeft: "8px" }}>
                                <Text strong>{getUserName()}</Text>
                                <br />
                                <Text type="secondary">
                                  {getUserRoleName()}
                                </Text>
                              </div>
                            </div>
                            <Divider style={{ margin: 0 }} />
                          </>
                        ),
                      },
                      {
                        key: "2",
                        label: <a href="/settings/user-profile">My Profile</a>,
                        icon: <UserOutlined />,
                      },
                      {
                        key: "3",
                        label: <Link to="/settings/user">Settings</Link>,
                        // label: <Link to="/oee/daifuku-main">Settings</Link>,
                        icon: <SettingOutlined />,
                      },
                      {
                        key: "4",
                        label: (
                          <a onClick={() => setPasswordPopup(!passwordPopup)}>
                            Change Password
                          </a>
                        ),
                        icon: <LockOutlined />,
                      },
                      {
                        key: "5",
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
                  <Button className="header-button" icon={<IoMdPerson />} />
                </Dropdown>
              </Flex>
            </Flex>
          </Header>
        )}

        <Content
          style={{
            minHeight: 280,
            width: "100%",
            padding: "10px",
            backgroundColor: "inherit",
          }}
        >
          <Outlet style={{ width: "100%" }} />

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
      {/* </StompSessionProvider> */}
    </FullScreen>
  ) : (
    <Navigate to="/login" />
  );
};

export default withStompSessionProvider(MainContainerTat);
