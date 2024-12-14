import { BellFilled, DeploymentUnitOutlined } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Dropdown,
  Row,
  Switch,
  Tabs,
  Tooltip,
  Typography,
  notification,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { BsBarChartLine, BsFillFileEarmarkCheckFill } from "react-icons/bs";
import { GrServices, GrVmMaintenance } from "react-icons/gr";
import { HiDocumentSearch } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useSubscription } from "react-stomp-hooks";
import { primary } from "../../helpers/color";
import NotificationService from "./service/notification-service";

const { Text, Title } = Typography;

function NotificationSocket() {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.notificationReducer.list);
  const [updatedList, setUpdatedList] = useState(list); // Local state for the updated list

  const [toggleModal, setToggleModal] = useState(false);
  const [selectedSegment, setSelectSegment] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showUnreadMessages, setShowUnreadMessages] = useState(false);

  const [open, setOpen] = useState(false);

  const [selectedNotificationType, setSelectedNotificationType] = useState(
    "Preventive Maintenance"
  );
  const [activeKey, setActiveKey] = useState(null);
  const [cardStatus, setCardStatus] = useState(null);
  const [isPMClicked, setIsPMClicked] = useState(false);

  const togglePMClicked = () => {
    setIsPMClicked(!isPMClicked);
  };

  const handlePanelChange = (key) => {
    setActiveKey(key);
  };
  const moduleCount = list.map((type) => type.type);
  const { Panel } = Collapse;

  const buttonStyle = {
    marginLeft: "10px",
    background: "linear-gradient(to right, #ff9a9e, #fad0c4)",
    border: "none",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
    transition: "0.3s",
  };

  const truncate = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "120px",
  };
  const buttonFocusStyle = {
    outline: "none",
    boxShadow: "0px 4px 20px rgba(255, 105, 135, 0.5)",
  };
  const service = new NotificationService();

  const notificationList = () => {
    // const service = new NotificationService();
    return (dispatch) => {
      return service
        .list()
        .then(({ data }) => {
          dispatch({ type: "NOTIFICATION_LIST_", data: data });
        })
        .catch((error) => {
          console.error("Error fetching notification list:", error);
        });
    };
  };
  useEffect(() => {
    dispatch(notificationList());
  }, [dispatch]);

  useEffect(() => {
    setUpdatedList(list); // Update local state whenever the list changes
  }, [list]);

  useSubscription("/topic/notification", (message) => {
    let body = JSON.parse(message.body);
    const newList = [body, ...updatedList];
    setUpdatedList(newList); // Update local state
    dispatch({ type: "NOTIFICATION_LIST_", data: newList });
    const obj = {
      message: body.title,
      description: body.description,
      duration: null,
      placement: "topRight",
    };
    if (body?.priority === 1) {
      notification.error({ ...obj, duration: 5 });
    } else {
      notification.warning({ ...obj, duration: 10 });
    }
  });

  const removeDuplicates = (array, key) => {
    return array.filter(
      (item, index, self) =>
        self.findIndex((t) => t[key] === item[key]) === index
    );
  };

  const options =
    updatedList.length === 0
      ? null
      : [
          ...removeDuplicates(list, "type").map(({ type }) => ({
            label: type,
            value: type,
          })),
        ];

  const handleDropdown = () => {
    setOpen((prevOpen) => !prevOpen);
    // setSelectedNotificationType("null");
  };

  const cardName = options ? options.map((i) => i) : [];
  const getCountForModule = (moduleName) => {
    return updatedList.filter(
      (item) => item.type === moduleName && item.opened === true
    ).length;
  };

  const getCountForAll = () => {
    return updatedList.filter((item) => item.opened === true).length;
  };

  const totalCount = getCountForAll();

  const getCircleContent = (type) => {
    switch (type) {
      case "Preventive Maintenance":
        return (
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#8ed6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "0.5rem",
            }}
          >
            <span style={{ fontWeight: "700" }}>PM</span>
          </div>
        );
      case "Overall Equipment Efficiency":
        return (
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "0.5rem",
            }}
          >
            <span style={{ fontWeight: "700" }}>OEE</span>
          </div>
        );

      case "Inventory":
        return (
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#d2bdff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "0.5rem",
            }}
          >
            <span style={{ fontWeight: "700" }}>I</span>
          </div>
        );
      case "Quality Inspection":
        return (
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#ffed8f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "0.5rem",
            }}
          >
            <span style={{ fontWeight: "700" }}>QI</span>
          </div>
        );
      case "Inspection Management":
        return (
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#b2ffec",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "0.5rem",
            }}
          >
            <span style={{ fontWeight: "700" }}>IM</span>
          </div>
        );
      case "Parameter Alert":
        return (
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#d2bdff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "0.5rem",
            }}
          >
            <span style={{ fontWeight: "700" }}>A</span>
          </div>
        );
      default:
        return null;
    }
  };
  const activeStyle = {
    backgroundColor: isPMClicked ? "#FFA500" : "initial", // Orange color when clicked
  };

  const getAvatarInfo = (label) => {
    switch (label) {
      case "Preventive Maintenance":
        return {
          icon: <GrVmMaintenance />,
          icon: <GrVmMaintenance />,
          style: {
            ...activeStyle,
            backgroundImage: "linear-gradient(135deg,#8ed6ff, #17afd0)",
          },
        };
      case "Overall Equipment Efficiency":
        return {
          icon: <DeploymentUnitOutlined />,
          icon: <DeploymentUnitOutlined />,
          // style: {
          //   width: "50px",
          //   height: "50px",
          // },
        };
      case "All":
        return {
          icon: <DeploymentUnitOutlined />,
          icon: <DeploymentUnitOutlined />,
          style: {
            backgroundImage: "linear-gradient(135deg, #c9d8fe, #7b91ca)",
          },
        };
      case "Inventory":
        return {
          icon: <GrServices />,
          icon: <GrServices />,
          style: {
            backgroundImage: "linear-gradient(135deg, #d2bdff, #6648bb)",
          },
        };
      case "Quality Inspection":
        return {
          icon: <BsFillFileEarmarkCheckFill />,
          icon: <BsFillFileEarmarkCheckFill />,
          style: {
            backgroundImage: "linear-gradient(135deg,#ffed8f, #e8b912)",
          },
        };
      case "Inspection Management":
        return {
          icon: <HiDocumentSearch />,
          icon: <HiDocumentSearch />,
          style: {
            backgroundImage: "linear-gradient(135deg, #b2ffec, #19cca1)",
          },
        };
      case "Parameter Alert":
        return {
          icon: <BsBarChartLine />,
          icon: <BsBarChartLine />,
          style: {
            backgroundImage: "linear-gradient(135deg, #d2bdff, #6648bb)",
          },
        };
      default:
        return {
          icon: <DeploymentUnitOutlined style={{ fontSize: "30px" }} />,
          style: {},
        };
    }
  };
  const setCardValue = (data) => {
    service
      .updateStatus(data.notificationId, false)
      .then((response) => {
        const updatedList = list.map((item) =>
          item.notificationId === data.notificationId
            ? { ...item, opened: response.data.opened }
            : item
        );
        setUpdatedList(updatedList); // Update local state
        dispatch({ type: "UPDATE_NOTIFICATION_STATUS_", data: updatedList });
        setOpen(false); // Close the dropdown menu
      })
      .catch((error) => {
        console.error("Error updating notification status:", error);
      });
  };
  const menu = (
    <Card
      className="notification-card"
      cover={
        <div
          style={{
            // backgroundColor: "#DFE9F3",
            padding: "1em 0 0 1em",
            postion: "fixed",
            borderRadius: "10px 10px 0px 0px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* <div style={{ fontSize: 17 }}>Notifications</div> */}

          <Tabs
            defaultActiveKey="1"
            items={[
              { label: "Event", value: "Event", key: 1 },
              {
                label: "Task",
                value: "Task",
                key: 2,

                // disabled: true,
              },
              {
                label: "Alerts",
                value: "Alerts",
                key: 3,
                // disabled: true,
              },
            ]}
            onChange={(key) => {
              if (key === 3) {
                setSelectedNotificationType("Parameter Alert");
              }
              if (key === 1) {
                setSelectedNotificationType("Preventive Maintenance");
              }
              setSelectSegment(key);
            }}
            style={{
              borderRadius: "50px",
              // padding: "0.5em",
              // backgroundColor:"#4F03A6"
              // backgroundImage:"linear-gradient(135deg,, #FFBBEC)"
            }}
            block
          />
          <div>
            {selectedSegment === 1 && (
              <Switch
                style={{ marginRight: "1em" }}
                checkedChildren="Unread"
                unCheckedChildren="All"
                onChange={() => {
                  // Toggle between showing unread and read messages
                  setShowUnreadMessages(!showUnreadMessages);
                }}
              />
            )}
          </div>
          {/* </div> */}
        </div>
      }
      style={{
        display: "flex",
        flexDirection: "column",
        height: 400,
        width: 370,
        padding: "0em 0em 1em 0em",
        // backgroundColor: "#fdfbfb",
      }}
    >
      <Row gutter={[10, 10]} style={{ height: 320, overflowY: "auto" }}>
        {selectedSegment === 1 && (
          <Col
            span={5}
            style={{
              padding: "0 0 1em 0",
              // backgroundColor: "#fdfbfb",
              position: "absolute",
              top: "70px",
              zIndex: "1",
            }}
          >
            {cardName.map(
              (i, index) =>
                i.label != "Parameter Alert" && (
                  <Card
                    bordered={false}
                    style={{
                      height: 50,
                      width: 50,
                      borderRadius: "50px",
                      boxShadow: "none",
                      margin: "1em 0 0 1em",
                      // backgroundImage:
                      //   selectedNotificationType === i.label
                      //     ? "linear-gradient(135deg,#A9C9FF, #FFBBEC)"
                      //     : null,
                      backgroundColor:
                        selectedNotificationType === i.label ? "#ddd" : null,
                    }}
                  >
                    <Col key={index} span={24}>
                      <div style={{ display: "flex" }}>
                        <Tooltip title={i.label} placement="right">
                          <div
                            style={{
                              display: "flex",
                              margin: "0.7em 0.5em 0 0",
                            }}
                          >
                            <Badge
                              count={getCountForModule(i.label)}
                              style={{
                                backgroundColor: "#f0f0f0",
                                color: "black",
                                fontSize: "0.8em",
                              }}
                            >
                              <Avatar
                                style={{
                                  ...getAvatarInfo(i.label).style,
                                  backgroundColor:
                                    selectedAvatar === i.label
                                      ? "black"
                                      : getAvatarInfo(i.label).style
                                          .backgroundColor,
                                }}
                                icon={getAvatarInfo(i.label).icon}
                                onClick={() => {
                                  setSelectedNotificationType(i.label);
                                  if (selectedAvatar === i.label) {
                                    setSelectedAvatar(null);
                                  } else {
                                    setSelectedAvatar(i.label);
                                  }
                                }}
                              />
                            </Badge>
                          </div>
                        </Tooltip>
                      </div>
                    </Col>
                  </Card>
                )
            )}
          </Col>
        )}

        <Col
          span={selectedSegment === 1 ? 24 : 24}
          style={{
            padding:
              selectedSegment === 3 ? "0em 0.5em 1em 1em" : "0em 0.5em 1em 6em",
            // backgroundColor: "#fdfbfb",
          }}
        >
          {selectedNotificationType && (
            <div>
              {updatedList
                .filter(
                  (item) => item.type === selectedNotificationType
                  //  && moment(item.timestamp).isSame(moment(), 'day')
                )
                .slice(0, 10)
                .map((d) =>
                  d.type === "Parameter Alert" && selectedSegment === 3 ? (
                    <Col key={d.notificationId} span={24}>
                      <Link to={d.path}>
                        <div
                          style={{
                            // backgroundColor: d.opened ? "white" : "#F5F5F5",
                            padding: "0em 0.2em 0.5em 0.5em",
                            // paddingLeft: "0.5em",
                          }}
                          onClick={getCountForModule(selectedNotificationType)}
                        >
                          <div style={{ display: "flex" }}>
                            {/* Left side: Avatar */}
                            <div>
                              {getCircleContent(selectedNotificationType)}
                            </div>
                            {/* <div>
                              <Divider
                                type="vertical"
                                style={{ margingRight: "0.5em" }}
                              />
                            </div> */}
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <span
                                  style={{
                                    color: d.opened ? "#092635" : "#999",
                                    fontWeight: "600",
                                  }}
                                >
                                  {d.title}
                                </span>
                              </div>
                              <span
                                style={{ fontSize: "0.8em", color: "#999" }}
                              >
                                {/* {moment(d.timestamp).format("DD/MM/YY")}
                                  <br></br>
                                  {moment(d.timestamp).format("hh:mmA")} */}
                                {moment(d.timestamp).isSame(moment(), "day")
                                  ? moment(d.timestamp).format("hh:mm A")
                                  : moment(d.timestamp).format("DD/MM/YY")}
                              </span>
                              <span
                                style={{
                                  fontSize: "1em",
                                  color: d.opened ? "#092635" : "#999",
                                }}
                              >
                                {d.description}
                              </span>
                            </div>
                          </div>
                          {/* <Divider/> */}
                        </div>
                      </Link>
                      <Divider style={{ margin: "10px 0px" }} />
                    </Col>
                  ) : (
                    selectedSegment === 1 &&
                    d.type != "Parameter Alert" &&
                    ((showUnreadMessages && d.opened) ||
                      !showUnreadMessages) && (
                      <Col key={d.notificationId} span={24}>
                        <Link to={d.path}>
                          <div
                            onClick={() => setCardValue(d)}
                            style={
                              {
                                // backgroundColor: d.opened ? "white" : "#F5F5F5",
                                // padding: "0.5em 0.2em 0.5em 0.5em",
                              }
                            }
                          >
                            <div style={{ display: "flex" }}>
                              <div
                                style={{
                                  padding: "0 0 0",
                                  position: "relative",
                                }}
                              >
                                <div
                                  style={
                                    d.opened
                                      ? {
                                          position: "absolute",
                                          top: "0", // Adjust this value to position the dot as needed
                                          left: "30px", // Adjust this value to center the dot horizontally
                                          // transform: "translateX(150%)", // Center the dot horizontally
                                          width: "10px",
                                          height: "10px",
                                          borderRadius: "50%",
                                          backgroundColor: "blue",
                                        }
                                      : null
                                  }
                                />
                                {getCircleContent(selectedNotificationType)}
                              </div>
                              <div>
                                {/* <Divider
                                  type="vertical"
                                  style={{ margingRight: "0.5em" }}
                                /> */}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <span
                                    style={{
                                      color: d.opened ? "#092635" : "#999",
                                      fontWeight: "600",
                                      fontSize: "1em",
                                      ...truncate,
                                    }}
                                  >
                                    {d.title}
                                  </span>
                                  <span
                                    style={{ fontSize: "0.8em", color: "#999" }}
                                  >
                                    {moment(d.timestamp).isSame(moment(), "day")
                                      ? moment(d.timestamp).format("hh:mm A")
                                      : moment(d.timestamp).format("DD/MM/YY")}
                                  </span>
                                </div>
                                <span
                                  style={{
                                    fontSize: "1em",
                                    color: d.opened ? "#092635" : "#999",
                                    fontWeight: "600",
                                  }}
                                >
                                  {d.description}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Divider style={{ margin: "10px 0px" }} />
                        </Link>
                      </Col>
                    )
                  )
                )}
            </div>
          )}
        </Col>
      </Row>
    </Card>
    // </Card>
  );

  return (
    <>
      <Dropdown
        overlay={menu}
        trigger="click"
        placement="bottomLeft"
        visible={open}
        onVisibleChange={handleDropdown}
        arrow
      >
        <Badge count={totalCount} size="small" color={primary}>
          <Tooltip title={"Notification"}>
            <Button className="header-button" icon={<BellFilled />} />
          </Tooltip>
        </Badge>
      </Dropdown>
    </>
  );
}

export default NotificationSocket;
