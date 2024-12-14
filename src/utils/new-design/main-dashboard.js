import {
  ArrowRightOutlined,
  SmileTwoTone,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Carousel,
  Col,
  DatePicker,
  Divider,
  Flex,
  Form,
  Image,
  Row,
  Space,
  Spin,
  TreeSelect,
  Typography,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import AppHierarchyService from "../../services/app-hierarchy/app-hierarchy-service";
//   import TawkTo from 'tawkto-react'
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import NotificationService from "../../module/notification/service/notification-service";
import { withForm } from "../../utils/with-form";
import CbmCard from "./cbm-card";
import EnergyCard from "./energy-card";
import ImCard from "./im-card";
import { OeeCard } from "./oee-card";
import PmCard from "./pm-card";
import QaCard from "./qa-card";
//   import AutoReplyChat from "./chat1";
import { BsBoxes } from "react-icons/bs";
import ModuleSelectionService from "../../services/preventive-maintenance-services/module-selection-service";
// for card
const cardStyle = {
  padding: "10px",
  borderRadius: 20,
};

const CarouselWrapper = styled(Carousel)`
  .slick-dots {
    bottom: -25px;
    align-items: baseline;
  }
  .slick-list {
    margin-bottom: 40px;
  }
  .slick-dots li button {
    // margin-top: 40px;
    width: 8px;
    height: 8px;
    border-radius: 100%;
    background: #ccd3e5;
    box-sizing: content-box;
  }
  .slick-dots li.slick-active button {
    background: #ffffff;
    border: 4px solid #233e7f;
  }
  .slick-dots li button:before {
    font-size: 0px;
  }
`;

const OverAllDashboard = (props) => {
  const [form] = Form.useForm();
  const aHId = Form.useWatch("aHId", form);
  const [entityOptions, setEntityOption] = useState([]);
  const [itemLength, setItemlength] = useState(0);

  const notificationList = useSelector(
    (state) => state.notificationReducer.list
  );
  const [state, setState] = useState({
    // entity: "",
    isLoading: false,
    data: {},
    parentTreeList: [],
    // ahId: "all",
  });
  const containerStyle = {
    maxWidth: "1240px",
    marginLeft: "auto",
    marginRight: "auto",
    padding: 10,
  };

  // const auth = new LoginService();
  const entity = new AppHierarchyService();
  const moduleService = new ModuleSelectionService();
  // console.log(module,"module")
  const dispatch = useDispatch();

  const notificationservice = new NotificationService();

  const [notificationData, setNotificationData] = useState([]);
  const [moduleNames, setModuleNames] = useState([]);
  const [formData, setFormData] = useState({});

  const moduleName = () => {
    return moduleService
      .list(formData.aHId)
      .then((response) => {
        const filteredModules = response.data.filter(
          (module) => module.entityId === formData.aHId
        );

        setModuleNames(filteredModules);

        // console.log(response, "response");
        // console.log(filteredModules, "filter");
        // console.log(formData.aHId, "ahid");
      })
      .catch((error) => {
        console.error("Error fetching module data:", error);
      });
  };

  // console.log(moduleNames, "Modulename");
  // console.log(entityOptions, "entity");
  const displayModule = moduleNames.map((e) => e.moduleName);
  // console.log(displayModule, "display");
  const getUserName = () => {
    return localStorage.getItem("uName");
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

  useEffect(() => {
    Data();
    //  moduleName();
  }, []);
  const handleTreeSelectChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      aHId: value,
    }));
  };

  const getAppHierarchyList = () => {
    const service = new AppHierarchyService();

    service.list({ active: true }).then(({ data }) => {
      let treeData = service.convertToSelectTree(data);
      setEntityOption(treeData);
      form.setFieldValue("aHId", treeData[0]?.value);
      setFormData({
        aHId: treeData[0]?.value,
        startDate: dayjs().startOf("D").toISOString(),
        endDate: dayjs().endOf("D").toISOString(),
      });
    });
  };

  useEffect(() => {
    getAppHierarchyList();
  }, []);

  const getIcon = (type) => {
    let icon;
    switch (type) {
      case "Inventory":
        icon = <BsBoxes style={{ color: "#FF7171", fontSize: "20px" }} />;
        break;
      case "Alert":
        icon = (
          <WarningOutlined style={{ color: "#FF7171", fontSize: "20px" }} />
        );
        break;
      default:
        icon = (
          <WarningOutlined style={{ color: "#FF7171", fontSize: "20px" }} />
        );
        break;
    }
    return icon;
  };
  {
    /* {[
                    {
                      icon: (
                        <ScheduleOutlined
                          style={{ color: "#FFDDAB", fontSize: "20px" }}
                        />
                      ),
                      description: "Need to check the OEE % before 9AM",
                      time: "Today 10:30AM",
                    },
                    {
                      icon: (
                        <WarningOutlined
                          style={{ color: "#FF7171", fontSize: "20px" }}
                        />
                      ),
                      description: "Need to check the OEE % before 9AM",
                      time: "Today 10:30AM",
                    },
                    {
                      icon: (
                        <BarChartOutlined
                          style={{ color: "#FF65DD", fontSize: "20px" }}
                        />
                      ),
                      description: "Need to check the OEE % before 9AM",
                      time: "Today 10:30AM",
                    },
                    {
                      icon: (
                        <WarningOutlined
                          style={{ color: "#FF7171", fontSize: "20px" }}
                        />
                      ),
                      description: "Need to check the OEE % before 9AM",
                      time: "Today 10:30AM",
                    },
                  ] */
  }
  useEffect(() => {
    if (formData.aHId) {
      moduleName();
    }
  }, [formData.aHId]);

  const cardNames = moduleNames.map((e) => e.moduleName);
  const cardItems = [
    (cardNames[0] || cardNames).includes("oee") && (
      <OeeCard {...formData} length={itemLength} />
    ),
    (cardNames[0] || cardNames).includes("conditionbasedmonitoring") && (
      <CbmCard {...formData} length={itemLength} />
    ),
    (cardNames[0] || cardNames).includes("energy") && (
      <EnergyCard {...formData} length={itemLength} />
    ),
    (cardNames[0] || cardNames).includes("preventivemaintenance") && (
      <PmCard {...formData} length={itemLength} />
    ),
    (cardNames[0] || cardNames).includes("inspectionmanagement") && (
      <ImCard {...formData} length={itemLength} />
    ),
    (cardNames[0] || cardNames).includes("qualityinspection") && (
      <QaCard {...formData} length={itemLength} />
    ),
    // <DiCard />,
  ];
  const filteredCardItems = cardItems.filter((item) => {
    // console.log(item);
    return (
      item &&
      ((item.type === OeeCard && (cardNames[0] || cardNames).includes("oee")) ||
        // (item.type === CbmCard &&
        //   (cardNames[0] || cardNames).includes("conditionbasedmonitoring")) ||
        // (item.type === EnergyCard &&
        //   (cardNames[0] || cardNames).includes("energy")) ||
        (item.type === PmCard &&
          (cardNames[0] || cardNames).includes("preventivemaintenance")))
      // ||
      // (item.type === ImCard && cardNames[0]) ||
      // cardNames.includes("inspectionmanagement") ||
      // (item.type === QaCard && cardNames[0]) ||
      // cardNames.includes("qualityinspection"))
    );
  });
  useEffect(() => {
    setItemlength(filteredCardItems.length);
  }, [filteredCardItems]);

  // const cardItems = [
  //   <OeeCard {...formData} />,
  //   <CbmCard {...formData} />,
  //   <EnergyCard {...formData} />,
  //   <PmCard {...formData} />,
  //   <ImCard {...formData} />,
  //   <QaCard {...formData} />,
  //   // <DiCard />,
  // ];

  // const filteredCardItems = cardItems.filter(item => {
  //   console.log(item,"ietm")
  //   return item && (
  //     item.type === OeeCard && (cardNames[0]||cardNames).includes('oee') ||
  //     item.type === CbmCard && (cardNames[0]||cardNames).includes('conditionbasedmonitoring') ||
  //     item.type === EnergyCard && (cardNames[0]||cardNames).includes('energy') ||
  //     item.type === PmCard && (cardNames[0]||cardNames).includes('preventivemaintenance') ||
  //     item.type === ImCard &&( cardNames[0]||cardNames).includes('inspectionmanagement') ||
  //     item.type === QaCard && (cardNames[0]||cardNames).includes('qualityinspection')
  //   );
  // });
  // console.log(filteredCardItems, "matched");

  // console.log(cardItems, "CardItem");
  const length = 4;

  const onFinish = (change, value) => {
    setFormData({
      ...value,
      startDate: dayjs(value.startDate).startOf("D").toISOString(),
      endDate: dayjs(value.endDate).endOf("D").toISOString(),
    });
  };

  const children = useMemo(() => {
    return (
      <>
        {[...Array(Math.ceil(cardItems.length / length))].map(
          (item, pageIndex) => {
            let n = pageIndex * length;
            return (
              <div key={pageIndex}>
                <Row gutter={[20, 20]}>
                  {cardItems?.slice(n, n + length)?.map((e) => (
                    <Col md={12}>{e}</Col>
                  ))}
                </Row>
              </div>
            );
          }
        )}
      </>
    );
  }, [formData]);
  return (
    <Spin spinning={state.isLoading}>
      {/* <Marquee className="marquee" pauseOnHover="true" speed={75}>
        <ul className="marquee-list">
          <li>
            <Typography.Text
              strong
              style={{ fontSize: ".9em", color: "inherit" }}
            >
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </Typography.Text>
          </li>
          <li>
            <Typography.Text
              strong
              style={{ fontSize: ".9em", color: "inherit" }}
            >
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </Typography.Text>
          </li>
          <li>
            <Typography.Text
              strong
              style={{ fontSize: ".9em", color: "inherit" }}
            >
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </Typography.Text>
          </li>
        </ul>
      </Marquee> */}
      {/* <AutoReplyChat drawOpen={isDrawOpen} drawClose={drawClose}/>
           <FloatButton icon={<CommentOutlined />} onClick={drawOpen}/> */}

      <div style={containerStyle}>
        <Row gutter={[40, 10]}>
          <Col span={24}>
            <Flex justify="end">
              <Flex vertical={true} gap={0} align="end">
                <Typography.Title level={2} style={{ marginBottom: 5 }}>
                  Hello {getUserName()} <SmileTwoTone twoToneColor="#52c41a" />
                </Typography.Title>
                <Typography.Text type="secondary">
                  Welcome to overview of your dashboard
                </Typography.Text>
              </Flex>
            </Flex>
          </Col>

          <Col sm={24} xs={24} md={8} lg={8}>
            <Row gutter={[20, 40]}>
              <Col sm={24} xs={24} md={24} lg={24}>
                <Card
                  className="shadow"
                  bordered={false}
                  style={cardStyle}
                  styles={{
                    body: {
                      padding: "10px 15px",
                    },
                  }}
                >
                  <Form
                    layout="vertical"
                    form={form}
                    onValuesChange={onFinish}
                    variant="borderless"
                    initialValues={{
                      startDate: dayjs(),
                      endDate: dayjs(),
                    }}
                  >
                    <Row gutter={[10, 10]}>
                      <Col span={12}>
                        <Form.Item
                          name="aHId"
                          label={
                            <Typography.Text type="secondary">
                              Entity
                            </Typography.Text>
                          }
                        >
                          <TreeSelect
                            className="entity-select"
                            placeholder="Entity"
                            onChange={handleTreeSelectChange}
                            showSearch
                            treeDefaultExpandAll
                            dropdownStyle={{
                              minWidth: 350,
                            }}
                            treeData={entityOptions}
                            style={{
                              backgroundColor: "#FFFCE0",
                              borderRadius: "10px",
                              width: "100%",
                            }}
                            size="large"
                            filterTreeNode={(input, option) =>
                              option.title
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12} hidden>
                        <Form.Item name="startDate" hidden>
                          <DatePicker />
                        </Form.Item>
                        <Form.Item name="endDate" hidden>
                          <DatePicker />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item label=" ">
                          <Link to={`./machine/cbm?aHId=${aHId}`}>
                            <Button className="asset-link" block>
                              <Typography.Text
                                className="text"
                                style={{
                                  color: "inherit",
                                  fontSize: "16px",
                                }}
                              >
                                Assets
                              </Typography.Text>
                              <ArrowRightOutlined className="icon" />
                            </Button>
                          </Link>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Card>
              </Col>
              <Col sm={24} xs={24} md={24} lg={24}>
                <Typography.Title level={5}>Highlights</Typography.Title>
                <Flex vertical={true} gap={10}>
                  {notificationList?.slice(0, 5).map((item) => (
                    <Card
                      className="shadow"
                      style={{
                        borderRadius: 10,
                      }}
                      styles={{
                        body: {
                          padding: "10px 15px",
                        },
                      }}
                    >
                      <Space size={0} split={<Divider type="vertical" />}>
                        <Avatar src={getIcon(item.type)} />

                        <Flex vertical={true}>
                          <Typography.Text
                            style={{
                              color: "#9AA6C4",
                              fontSize: 14,
                            }}
                          >
                            {item.description}
                          </Typography.Text>
                          <Typography.Text
                            type="secondary"
                            style={{
                              color: "#BBC3D7",
                              fontSize: 12,
                            }}
                          >
                            {item.timestamp
                              ? dayjs(item.timestamp).format(
                                  "DD-MM-YYYY hh:mm:ss A"
                                )
                              : ""}
                          </Typography.Text>
                        </Flex>
                      </Space>
                    </Card>
                  ))}
                </Flex>
                {/* <Flex vertical={true} gap={10}>
                  {renderNotificationCards()}
                </Flex> */}
              </Col>
            </Row>
          </Col>

          <Col sm={24} xs={24} md={16} lg={16}>
            <CarouselWrapper>
              {[...Array(Math.ceil(filteredCardItems.length / length))].map(
                (item, pageIndex) => {
                  let n = pageIndex * length;
                  return (
                    <div key={pageIndex}>
                      <Row gutter={[20, 20]}>
                        {filteredCardItems?.slice(n, n + length)?.map((e) => (
                          <Col md={filteredCardItems.length < 3 ? 24 : 12}>
                            {e}
                          </Col>
                        ))}
                      </Row>
                    </div>
                  );
                }
              )}
            </CarouselWrapper>
          </Col>
        </Row>
      </div>

      <div
        style={{
          textAlign: "center",
          padding: "5px 0px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "5px",
          backgroundColor: "#F2F3FD",
        }}
      >
        <span
          style={{
            fontSize: "14px",
            fontStyle: "italic",
            fontWeight: "bold",
            padding: "5px 0px 0px",
            maxWidth: "100px",
            textAlign: "center",
          }}
        >
          powered by
        </span>
        <Image
          src="/byteFactory.png"
          preview={false}
          style={{
            maxWidth: "120px",
            display: "block",
            margin: "0 auto",
            width: "100%",
          }}
        />
      </div>
    </Spin>
  );
};

export default withForm(OverAllDashboard);
