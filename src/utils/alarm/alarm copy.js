import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Descriptions,
  message,
  Modal,
  Row,
  Space,
  Typography,
} from "antd";
import React, { Component } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { connect } from "react-redux";
import AlertsService from "../../services/alerts-service";
import { alertsList } from "../../store/actions";
const { Meta } = Card;
const { Text, Title } = Typography;
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 1,
    slidesToSlide: 1,
    partialVisibilityGutter: 10,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1,
    partialVisibilityGutter: 10,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
    slidesToSlide: 1,
    partialVisibilityGutter: 10,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
    partialVisibilityGutter: 10,
  },
};
class Alarm extends Component {
  service = new AlertsService();
  state = { open: false, acc: false };
  siren = new Audio("/alarm2.wav");
  interval;
  constructor(props) {
    super(props);
  }
  customerStatus() {
    Promise.all([this.props.alertsList()]).then((response) => {
      setTimeout(() => {
        this.customerStatus();
      }, 1000);
    });
  }
  componentWillUnmount() {
    this.siren.pause();
    this.siren.remove();
    clearInterval(this.interval);
  }
  componentDidMount() {
    this.siren.load();
    this.siren.loop = true;
    this.customerStatus();
    this.interval = setInterval(() => {
      this.checkAlert();
    }, 500);
  }
  acknowledge = (id) => {
    this.setState((state) => ({ ...state, isLoading: true }));
    this.service
      .acknowledgement(id)
      .then((response) => {
        message.success(response.data.message);
      })
      .catch((error) => {
        console.log(message);
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
      });
  };
  falseAlarm = (id) => {
    this.setState((state) => ({ ...state, isLoading: true }));
    this.service
      .confirmation(id, 2)
      .then((response) => {
        message.success(response.data.message);
      })
      .catch((error) => {
        console.log(message);
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
      });
  };
  fireAlarm = (id) => {
    this.setState((state) => ({ ...state, isLoading: true }));
    this.service
      .confirmation(id, 1)
      .then((response) => {
        message.success(response.data.message);
      })
      .catch((error) => {
        console.log(message);
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
      });
  };
  close = () => {
    this.setState((state) => ({ ...state, acc: true }));
  };
  checkAlert() {
    if (Number(this.props.fireAlertsAlarm?.length ?? 0) > 0) {
      if (this.siren.paused) this.siren.play();
      this.setState((state) => ({ ...state, open: true }));
    } else {
      if (!this.siren.paused) this.siren.pause();
      this.setState((state) => ({ ...state, open: false }));
    }
  }
  static getDerivedStateFromProps(props, state) {
    return { ...state, ...props };
  }
  render() {
    return (
      <>
        <Modal centered open={this.state.open} footer={false} closable={false}>
          <Carousel
            arrows
            containerClass="container"
            customLeftArrow={
              <Button
                shape="circle"
                type="primary"
                style={{ position: "absolute", left: 0 }}
                icon={<LeftOutlined />}
              />
            }
            customRightArrow={
              <Button
                shape="circle"
                type="primary"
                style={{ position: "absolute", right: 0 }}
                icon={<RightOutlined />}
              />
            }
            responsive={responsive}
          >
            {this.state.fireAlertsAlarm?.map((e) => (
              <Row gutter={[10, 10]}>
                <Col sm={24}>
                  <div
                    className="fire-alarm-panel"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Space align="center">
                      <img src="/warning.gif" style={{ width: "50px" }} />
                      <Title
                        style={{ margin: 0 }}
                        level={1}
                        type="danger"
                        className="blink_me"
                      >
                        Emergency
                      </Title>
                    </Space>

                    <br />
                    {/* <p align="center">
                      A fire has broken out{" "}
                      <Text type="danger">{e.customerName}</Text> in Floor 1.
                      <br /> You need to avoid building immediately.
                    </p> */}

                    <Descriptions
                      style={{ width: "100%" }}
                      size="small"
                      bordered
                      column={1}
                      // labelStyle={{ width: "150px" }}
                    >
                      <Descriptions.Item label="Building Name">
                        <Text strong>{e.customerName}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Floor">
                        Ground Floor
                      </Descriptions.Item>
                      <Descriptions.Item label="Landline">
                        {e?.buildingLandlineNo}
                      </Descriptions.Item>
                      <Descriptions.Item label="Contact">
                        {e?.contactPerson1Number}{" "}
                        <small>{e?.contactPerson1Name}</small> <br />
                        {e?.contactPerson2Number && (
                          <>
                            {e?.contactPerson2Number}{" "}
                            <small>{e?.contactPerson2Name}</small>
                          </>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Address">
                        {e?.address}
                      </Descriptions.Item>
                    </Descriptions>

                    <br />
                    <Space
                      block
                      style={{ justifyContent: "space-between", width: "100%" }}
                    >
                      <Button
                        className="yes button"
                        onClick={() => this.falseAlarm(e.alertId)}
                      >
                        False Alarm
                      </Button>
                      <Button
                        className="no button"
                        onClick={() => this.fireAlarm(e.alertId)}
                      >
                        Fire Alarm
                      </Button>

                      {/* <button
                        className="acknowledge button"
                        onClick={() => this.acknowledge(e.alertId)}
                      >
                        Acknowledge
                      </button> */}
                    </Space>
                  </div>
                </Col>
              </Row>
            ))}
          </Carousel>
        </Modal>
        {this.props.children}
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return (
    {
      customerStatusList: state.loggedReducer.customerStatus,
      fireAlertsAlarm: state.loggedReducer.fireAlertsAlarm,
    } ?? {}
  );
};
export default connect(mapStateToProps, {
  // customerStatus,
  alertsList,
  // getFireAlertsList,
})(Alarm);
