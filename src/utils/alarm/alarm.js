// import { LeftOutlined, RightOutlined, WarningFilled } from "@ant-design/icons";
// import {
//   Avatar,
//   Button,
//   Card,
//   Col,
//   Descriptions,
//   Divider,
//   message,
//   Modal,
//   Row,
//   Space,
//   Typography,
// } from "antd";
// import React, { Component } from "react";
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";
// import { connect } from "react-redux";
// import AlertsService from "../../services/alerts-service";
// import { setAlertData } from "../../store/actions";
// import { BiBuildingHouse } from "react-icons/bi";
// import {
//   MobileOutlined,
//   PhoneOutlined,
//   FireFilled,
//   StopFilled,
// } from "@ant-design/icons";
// import { HiBellSnooze } from "react-icons/hi2";
// import { FaMapMarkerAlt } from "react-icons/fa";
// import { Link } from "react-router-dom";

// //import StompClient from "react-stomp-client";
// import Stomp from "stompjs";
// import SockJS from "sockjs-client";
// import { rootUrl } from "../../helpers/url";
// import { withRouter } from "../with-router";

// const { Meta } = Card;
// const { Text, Title } = Typography;
// const responsive = {
//   superLargeDesktop: {
//     // the naming can be any, depends on you.
//     breakpoint: { max: 4000, min: 3000 },
//     items: 1,
//     slidesToSlide: 1,
//     partialVisibilityGutter: 40,
//   },
//   desktop: {
//     breakpoint: { max: 3000, min: 1024 },
//     items: 1,
//     slidesToSlide: 1,
//     partialVisibilityGutter: 40,
//   },
//   tablet: {
//     breakpoint: { max: 1024, min: 464 },
//     items: 1,
//     slidesToSlide: 1,
//     partialVisibilityGutter: 40,
//   },
//   mobile: {
//     breakpoint: { max: 464, min: 0 },
//     items: 1,
//     slidesToSlide: 1,
//     partialVisibilityGutter: 40,
//   },
// };
// class Alarm extends Component {
//   topic = "/topic/alert";
//   service = new AlertsService();
//   state = { open: false, acc: false };
//   siren = new Audio("/alarm2.wav");
//   interval;
//   constructor(props) {
//     super(props);
//   }
//   connect = () => {
//     let ws = new SockJS(`${rootUrl}/ws`);
//     this.stompClient = Stomp.over(ws);
//     const _this = this;
//     this.stompClient.connect(
//       {},
//       (frame) => {
//         this.stompClient.subscribe(_this.topic, (sdkEvent) => {
//           this.onMessageReceived(sdkEvent.body);
//         });
//         //_this.stompClient.reconnect_delay = 2000;
//       },
//       this.errorCallBack
//     );
//   };
//   onMessageReceived = (event) => {
//     let jsonRes = JSON.parse(event);
//     let alerts = [...this.props.alertList];

//     for (let x of jsonRes) {
//       let index = alerts.findIndex((e) => e.alertId === x.alertId);
//       if (index != -1) {
//         alerts[index] = x;
//       } else alerts.push(x);
//     }
//     this.props.setAlertData([...alerts.filter((e) => !e.closed)]);
//   };
//   errorCallBack(error) {
//     console.log("errorCallBack -> " + error);
//     setTimeout(() => {
//       this.connect();
//     }, 5000);
//   }
//   customerStatus() {
//     this.setState((state) => ({ ...state, isLoading: true }));
//     this.service
//       .alerts()
//       .then(({ data }) => {
//         this.props.setAlertData(data);
//       })
//       .catch((error) => {
//         console.error(error);
//       })
//       .finally(() => {
//         this.setState((state) => ({ ...state, isLoading: false }));
//       });
//   }
//   componentWillUnmount() {
//     this.siren.pause();
//     this.siren.remove();
//     clearInterval(this.interval);
//   }
//   componentDidMount() {
//     this.siren.load();
//     this.siren.loop = true;
//     this.connect();
//     this.customerStatus();
//     this.interval = setInterval(() => {
//       this.checkAlert();
//     }, 500);
//   }
//   acknowledge = (id) => {
//     this.setState((state) => ({ ...state, isLoading: true }));
//     this.service
//       .acknowledgement(id)
//       .then((response) => {
//         message.success(response.data.message);
//       })
//       .catch((error) => {
//         console.log(message);
//       })
//       .finally(() => {
//         this.setState((state) => ({ ...state, isLoading: false }));
//         this.customerStatus();
//       });
//   };
//   falseAlarm = (id) => {
//     this.setState((state) => ({ ...state, isLoading: true }));
//     this.service
//       .confirmation(id, 2)
//       .then((response) => {
//         message.success(response.data.message);
//       })
//       .catch((error) => {
//         console.log(message);
//       })
//       .finally(() => {
//         this.setState((state) => ({ ...state, isLoading: false }));
//         this.customerStatus();
//       });
//   };
//   fireAlarm = (id) => {
//     this.setState((state) => ({ ...state, isLoading: true }));
//     this.service
//       .confirmation(id, 1)
//       .then((response) => {
//         message.success(response.data.message);
//       })
//       .catch((error) => {
//         console.log(message);
//       })
//       .finally(() => {
//         this.setState((state) => ({ ...state, isLoading: false }));
//         this.customerStatus();
//       });
//   };
//   close = () => {
//     this.setState((state) => ({ ...state, acc: true }));
//   };
//   checkAlert() {
//     if (
//       Number(this.props.fireAlertsAlarm?.length ?? 0) > 0 &&
//       this.props.location.pathname === "/remote-monitoring/fire-dashboard"
//     ) {
//       if (this.siren.paused) this.siren.play();
//       this.setState((state) => ({ ...state, open: true }));
//     } else {
//       if (!this.siren.paused) this.siren.pause();
//       this.setState((state) => ({ ...state, open: false }));
//     }
//   }
//   static getDerivedStateFromProps(props, state) {
//     return { ...state, ...props };
//   }
//   render() {
//     return (
//       <>
//         <Modal
//           className="fire-alert"
//           headStyle={{ backgroundColor: "red" }}
//           title={
//             <Row gutter={20} justify="center" align="middle">
//               <Col>
//                 <Title
//                   level={1}
//                   className="blink_me"
//                   style={{ color: "#ffffff", margin: 0 }}
//                 >
//                   <WarningFilled />
//                 </Title>

//                 {/* <Avatar src="/warning.gif" shape="square" /> */}
//               </Col>
//               <Col>
//                 <Title
//                   className="blink_me"
//                   level={3}
//                   style={{ color: "#ffffff", margin: 0 }}
//                 >
//                   Emergency Fire Alert
//                 </Title>
//               </Col>
//             </Row>
//           }
//           centered
//           open={this.state.open}
//           footer={false}
//           closable={false}
//         >
//           <div
//             style={{
//               paddingBottom: "30px",
//               position: "relative",
//             }}
//           >
//             <Carousel
//               draggable={false}
//               swipeable={false}
//               afterChange={this.afterChange}
//               arrows
//               containerClass="container"
//               renderDotsOutside
//               renderButtonGroupOutside
//               showDots
//               slidesToSlide={1}
//               customLeftArrow={
//                 <Button
//                   shape="circle"
//                   type="primary"
//                   danger
//                   size="small"
//                   style={{
//                     position: "absolute",
//                     left: "5px",
//                     // transform: "translateX(-50%)",
//                   }}
//                   icon={<LeftOutlined />}
//                 />
//               }
//               customRightArrow={
//                 <Button
//                   size="small"
//                   shape="circle"
//                   type="primary"
//                   danger
//                   style={{ position: "absolute", right: "5px" }}
//                   icon={<RightOutlined />}
//                 />
//               }
//               responsive={responsive}
//             >
//               {this.state.fireAlertsAlarm?.map((e) => (
//                 <Row gutter={[0]}>
//                   <Col sm={24}>
//                     <Card
//                       loading={this.state.isLoading}
//                       bodyStyle={{ paddingTop: "10px" }}
//                     >
//                       <Meta
//                         title={
//                           <Row justify="space-between">
//                             <Col>
//                               <Link
//                                 to={`remote-monitoring/building-view?plantId=${e.customerId}`}
//                               >
//                                 <Title type="danger" level={4} ellipsis>
//                                   {e.customerName}
//                                 </Title>
//                               </Link>
//                             </Col>
//                             <Col>
//                               <Text>
//                                 <BiBuildingHouse /> {e?.buildingLandlineNo}
//                               </Text>
//                             </Col>
//                           </Row>
//                         }
//                         // avatar={}
//                         description={
//                           <>
//                             <Row gutter={[10, 20]}>
//                               <Col span={24}>
//                                 <Text type="secondary" strong>
//                                   Address :
//                                 </Text>
//                                 <br />
//                                 <Text style={{ lineHeight: "25px" }}>
//                                   <FaMapMarkerAlt />
//                                   &nbsp;
//                                   {e?.address}
//                                 </Text>
//                               </Col>
//                               <Col span={24}>
//                                 <Text type="secondary" strong>
//                                   Floor :
//                                 </Text>
//                                 <br />
//                                 <Text>Ground Floor</Text>
//                               </Col>
//                               <Col span={24}>
//                                 <Text type="secondary" strong>
//                                   Contact Details :
//                                 </Text>
//                                 <div>
//                                   <Space
//                                     style={{ flexWrap: "wrap" }}
//                                     split={<Divider type="vertical" />}
//                                   >
//                                     <div>
//                                       <Space>
//                                         <Text strong>
//                                           <PhoneOutlined
//                                             style={{
//                                               transform: "rotate(90deg)",
//                                             }}
//                                           />
//                                           <sub>1</sub>
//                                         </Text>
//                                         <Text strong>
//                                           {e?.contactPerson1Number}
//                                         </Text>
//                                         <Text italic strong>
//                                           - {e?.contactPerson1Name}
//                                         </Text>
//                                       </Space>
//                                     </div>
//                                     {e.contactPerson2Number && (
//                                       <div>
//                                         <Space align="center">
//                                           <Text strong>
//                                             <PhoneOutlined
//                                               style={{
//                                                 transform: "rotate(90deg)",
//                                               }}
//                                             />
//                                             <sub>2</sub>
//                                           </Text>
//                                           <Text strong>
//                                             {e?.contactPerson2Number}
//                                           </Text>
//                                           <Text italic strong>
//                                             - {e?.contactPerson2Name}
//                                           </Text>
//                                         </Space>
//                                       </div>
//                                     )}
//                                   </Space>
//                                 </div>
//                               </Col>
//                               <Col span={24}>
//                                 <div style={{ marginBottom: "5px" }}>
//                                   <Text italic type="danger" strong>
//                                     *Please call the above contacts and confirm
//                                     the fire event.
//                                   </Text>
//                                 </div>
//                                 <Row justify="space-between">
//                                   <Col>
//                                     <Button
//                                       className="yes button"
//                                       onClick={() => this.falseAlarm(e.alertId)}
//                                       icon={<StopFilled />}
//                                     >
//                                       False Alarm
//                                     </Button>
//                                   </Col>
//                                   <Col>
//                                     <Button
//                                       style={{
//                                         display: "flex",
//                                         alignItems: "center",
//                                         gap: "5px",
//                                       }}
//                                       className="acknowledge button"
//                                       onClick={() =>
//                                         this.acknowledge(e.alertId)
//                                       }
//                                       icon={
//                                         <span
//                                           style={{
//                                             fontSize: "1.2em",
//                                             lineHeight: "0",
//                                           }}
//                                         >
//                                           <HiBellSnooze />
//                                         </span>
//                                       }
//                                     >
//                                       Acknowledge
//                                     </Button>
//                                   </Col>
//                                   <Col>
//                                     <Button
//                                       className="no button"
//                                       onClick={() => this.fireAlarm(e.alertId)}
//                                       icon={<FireFilled />}
//                                     >
//                                       Fire Alarm
//                                     </Button>
//                                   </Col>
//                                 </Row>
//                               </Col>
//                             </Row>
//                           </>
//                         }
//                       />
//                     </Card>
//                     {/* <div
//                     className="fire-alarm-panel"
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <Row>
//                       <Col>
//                         <Title type="danger" level={4} ellipsis>
//                           {e.customerName}
//                         </Title>
//                       </Col>
//                       <Col style={{ marginLeft: "auto" }}>
//                         <Text>
//                           <BiBuildingHouse /> {e?.buildingLandlineNo}
//                         </Text>
//                       </Col>
//                       <Col span={24}>
//                         <Text type="secondary">{e?.address}</Text>
//                       </Col>
//                       <Col style={{ marginLeft: "auto" }}>
//                         <Space split={<Divider type="vertical" />}>
//                           <div>
//                             <Space>
//                               <Text>
//                                 <PhoneOutlined
//                                   style={{ transform: "rotate(90deg)" }}
//                                 />
//                                 <sub>1</sub>
//                               </Text>
//                               <Text>{e?.contactPerson1Number}</Text>
//                               <Text italic>- {e?.contactPerson1Name}</Text>
//                             </Space>
//                           </div>
//                           {e.contactPerson2Number && (
//                             <div>
//                               <Space align="center">
//                                 <Text>
//                                   <PhoneOutlined
//                                     style={{ transform: "rotate(90deg)" }}
//                                   />
//                                   <sub>2</sub>
//                                 </Text>
//                                 <Text>{e?.contactPerson2Number}</Text>
//                                 <Text italic>- {e?.contactPerson2Name}</Text>
//                               </Space>
//                             </div>
//                           )}
//                         </Space>
//                       </Col>
//                     </Row>

//                     <br />
//                     <Space
//                       block
//                       style={{ justifyContent: "center", width: "100%" }}
//                     >
//                       <Button
//                         className="yes button"
//                         onClick={() => this.falseAlarm(e.alertId)}
//                         icon={<StopFilled />}
//                       >
//                         False Alarm
//                       </Button>
//                       <Button
//                         className="no button"
//                         onClick={() => this.fireAlarm(e.alertId)}
//                         icon={<FireFilled />}
//                       >
//                         Fire Alarm
//                       </Button>
//                     </Space>
//                   </div> */}
//                   </Col>
//                 </Row>
//               ))}
//             </Carousel>
//           </div>
//         </Modal>
//         {this.props.children}
//       </>
//     );
//   }
// }
// const mapStateToProps = (state) => {
//   return (
//     {
//       alertList: state.loggedReducer.alertsList,
//       customerStatusList: state.loggedReducer.customerStatus,
//       fireAlertsAlarm: state.loggedReducer.fireAlertsAlarm,
//     } ?? {}
//   );
// };
// const mapDispatchToProps = (dispatch) => {
//   return {
//     // dispatching plain actions
//     alersListFn: () => dispatch({ type: "ALERTS_LIST_" }),
//     fireAlertsListFn: () => dispatch({ type: "FIRE_ALERTS_LIST_" }),
//     pumpAlertsListFn: () => dispatch({ type: "PUMP_ALERTS_LIST_" }),
//     fireAlertsAlarmFn: () => dispatch({ type: "FIRE_ALERTS_ALARM_" }),
//   };
// };
// export default connect(mapStateToProps, {
//   // customerStatus,
//   // alertsList,
//   setAlertData,
//   // getFireAlertsList,
// })(withRouter(Alarm));
