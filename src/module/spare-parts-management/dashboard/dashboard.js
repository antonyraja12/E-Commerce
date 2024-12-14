import React from "react";
import {
  Avatar,
  Card,
  Col,
  Form,
  Result,
  Row,
  Spin,
  Table,
  TreeSelect,
  Typography,
  Carousel,
  Popover,
  Button,
  Badge,
  Drawer,
  Select,
} from "antd";
import {
  FilterFilled,
  HeatMapOutlined,
  NodeIndexOutlined,
  SearchOutlined,
  StockOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import Page from "../../../utils/page/page";
import BarChart1 from "../../../component/BarChart1";
import Donut from "../../../component/Donut";
import StockJournalService from "../../../services/inventory-services/stock-journal-service";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import { withForm } from "../../../utils/with-form";
import StackedBarChart from "../../../component/StackedBarChart";
import { withAuthorization } from "../../../utils/with-authorization";
import { withRouter } from "../../../utils/with-router";
import { Link } from "react-router-dom";
import DashboardService from "../../../services/inventory-services/dashboard-service";
import DateTabs from "../../../helpers/data";
import moment from "moment";
import DateFilter from "../../remote-monitoring/common/date-filter";
import CustomCollapsePanel from "../../../helpers/collapse";
import FilterFunctions from "../../remote-monitoring/common/filter-functions";
import { DatePickerformat } from "../../../helpers/url";
const { Text, Title } = Typography;
const style = {
  formItem: {
    minWidth: "120px",
  },
};
class Dashboard extends FilterFunctions {
  state = { isLoading: false, isDateTabsOpen: false, dashboardData: [] };
  service = new DashboardService();
  appHierarchyService = new AppHierarchyService();
  componentDidMount() {
    this.appHierarchyService.list().then(({ data }) => {
      const parentTreeList = this.appHierarchyService.convertToSelectTree(data);
      const startOfWeek = moment().startOf("week").toDate();
      const endOfWeek = moment().endOf("week").toDate();

      this.onFinish({
        aHId: parentTreeList[0].value,
        startDate: startOfWeek,
        endDate: endOfWeek,
      });
      this.props.form.setFieldValue("aHId", parentTreeList[0].value);
      this.props.form.submit();
      this.setState((state) => ({ ...state, parentTreeList }));
    });
  }

  getDashboardDetails = (ahId) => {
    this.setState((state) => ({ ...state, aHId: ahId }));
    this.props.form.submit();
  };
  AvgCard = (props) => {
    const { title, value, bgColor, icon } = props;
    return (
      <div>
        <Row gutter={10} align="middle">
          <Col>
            <Avatar
              shape="square"
              size={40}
              style={{
                backgroundColor: bgColor,
                verticalAlign: "middle",
              }}
              icon={icon}
            />
          </Col>
          <Col>
            <Title level={3} style={{ color: "#2C4A88", marginTop: "8px" }}>
              {value}{" "}
            </Title>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Text>{title}</Text>
          </Col>
        </Row>
      </div>
    );
  };

  overdueDaysDifference = (expiryDate) => {
    const currentDate = new Date();
    const expiry = new Date(expiryDate);
    const differenceInTime = currentDate.getTime() - expiry.getTime();
    return Math.ceil(differenceInTime / (1000 * 3600 * 24)); // Convert milliseconds to days
  };
  calculateDaysDifference = (expiryDate) => {
    const currentDate = new Date();
    const expiry = new Date(expiryDate);
    const differenceInTime = expiry.getTime() - currentDate.getTime();
    return Math.ceil(differenceInTime / (1000 * 3600 * 24)); // Convert milliseconds to days
  };
  serialNumColumns = [
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
      key: "serialNumber",
      width: 150,
    },
    {
      title: "Days",
      dataIndex: "dateDifference",
      key: "dateDifference",
      width: 100,
    },
  ];

  Popover = (data) => {
    return (
      <Table size="small" columns={this.serialNumColumns} dataSource={data} />
    );
  };
  getCalibrationOverdueData = (data) => {
    console.log("log data", data);
    if (!data || !Array.isArray(data)) {
      return [];
    }

    const grouped = data.reduce((acc, item) => {
      const { sparePartId, serialNumber, expiryDate, sparePart } = item;
      if (!acc[sparePartId]) {
        acc[sparePartId] = {
          sparePartId,
          serialNumbers: [],
          expiryDates: [],
          sparePartName: sparePart?.sparePartName || "Unknown",
        };
      }
      acc[sparePartId].serialNumbers.push(serialNumber);
      acc[sparePartId].expiryDates.push(expiryDate);
      return acc;
    }, {});

    // Manual iteration over keys of grouped object
    const result = [];
    for (const key in grouped) {
      if (Object.prototype.hasOwnProperty.call(grouped, key)) {
        const group = grouped[key];
        const { sparePartId, serialNumbers, expiryDates, sparePartName } =
          group;
        const serialdata = serialNumbers.map((serialNumber, index) => ({
          serialNumber,
          dateDifference: this.overdueDaysDifference(expiryDates[index]),
        }));

        result.push({
          sparePartId,
          sparePartName,
          serialdata,
          count: serialNumbers.length, // Count of spares
        });
      }
    }
    console.log("result112", result);
    return result;
  };

  columns = [
    {
      title: "Name",
      dataIndex: "sparePartName",
      key: "sparePartName",
      width: 100,
      render: (value, record) => {
        return (
          <Popover
            placement="left"
            trigger={"click"}
            content={this.Popover(record.serialdata)}
          >
            {value}
          </Popover>
        );
      },
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
      width: 100,
    },
  ];
  getToBeCalibratedData = (data) => {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    const grouped = data.reduce((acc, item) => {
      const { sparePartId, serialNumber, expiryDate, sparePart } = item;
      if (!acc[sparePartId]) {
        acc[sparePartId] = {
          sparePartId,
          serialNumbers: [],
          expiryDates: [],
          sparePartName: sparePart?.sparePartName || "Unknown",
        };
      }
      acc[sparePartId].serialNumbers.push(serialNumber);
      acc[sparePartId].expiryDates.push(expiryDate);
      return acc;
    }, {});

    // Manual iteration over keys of grouped object
    const result = [];
    for (const key in grouped) {
      if (Object.prototype.hasOwnProperty.call(grouped, key)) {
        const group = grouped[key];
        const { sparePartId, serialNumbers, expiryDates, sparePartName } =
          group;
        const serialdata = serialNumbers.map((serialNumber, index) => ({
          serialNumber,
          dateDifference: this.calculateDaysDifference(expiryDates[index]),
        }));

        result.push({
          sparePartId,
          sparePartName,
          serialdata,
          count: serialNumbers.length, // Count of spares
        });
      }
    }
    console.log("result", result);
    return result;
  };
  setDatefield = (v) => {
    this.props?.form.setFieldsValue({
      startDate: new Date(v.startDate),
      endDate: new Date(v.endDate),
    });
    this.setState((state) => state);
  };
  handleDateTabsModeChange = (mode) => {
    this.setState({ mode }, () => {
      this.props.form.submit();
    });
  };
  handleDateTabsOpen = () => {
    this.setState({ isDateTabsOpen: !this.state.isDateTabsOpen });
  };

  onFinish = (value = {}) => {
    let obj = { ...value };
    console.log("obj");
    this.service.dashboard(obj).then(({ data }) => {
      this.setState((state) => ({ ...state, dashboardData: data }));
    });
  };
  handleApplyFilter = () => {
    this.onClose();
    const anyFieldSelected = Object.values(this.state.selectedFields).some(
      (selected) => selected
    );
    this.setState({ isAnyFieldSelected: anyFieldSelected });
    this.setState({ isFilterApplied: true });
  };

  handleResetFilter = () => {
    this.setState({
      selectedFields: {
        status: false,
      },
      isAnyFieldSelected: false,
      isFilterApplied: false,
    });
    this.props.form.resetFields();
    this.onClose();
  };
  onClose = () => {
    this.setState({ open: false, isDateTabsOpen: false });
  };
  formatDate = (date) => {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  render() {
    const startDate = this.props.form.getFieldValue("startDate")
      ? this.formatDate(this.props.form.getFieldValue("startDate"))
      : "";
    const endDate = this.props.form.getFieldValue("endDate")
      ? this.formatDate(this.props.form.getFieldValue("endDate"))
      : "";

    const purchaseRequestData = (
      this.state.dashboardData?.purchaseRequestCount || []
    )
      ?.sort((a, b) => b.count - a.count)
      ?.slice(0, 4)
      ?.map((e) => ({
        [e.sparePartName]: e.count,
      }));
    const mostRequestedSpares =
      this.state.dashboardData?.mostRequestedSpares?.map((e) => ({
        x: [e.sparePartName],
        y: e.count,
      }));
    console.log("this.state.dashboardData", this.state.dashboardData);
    const AvgCard = (props) => {
      const { title, value, icon } = props;
      return (
        <div>
          <Row gutter={10} align="middle">
            <Col>
              <Avatar
                shape="circle"
                size={40}
                style={{
                  backgroundColor: "#F3F2FD",
                  color: "#000000D9",
                  verticalAlign: "middle",
                }}
                icon={icon}
              />
            </Col>
            <Col>
              <Title level={4} style={{ color: "#222222", marginTop: "8px" }}>
                {value}{" "}
              </Title>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Text>{title}</Text>
            </Col>
          </Row>
        </div>
      );
    };
    const locale = {
      emptyText: "Coming Soon ",
    };
    const { isLoading } = this.props;
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

    const calibrationOverdueData = this.getCalibrationOverdueData(
      this.state.dashboardData.calibrationOverdue
    );
    const toBeCalibratedData = this.getToBeCalibratedData(
      this.state.dashboardData?.toBeCalibrated
    );
    const {
      open,
      status,
      selectedFields,
      isAnyFieldSelected,
      isFilterApplied,
    } = this.state;

    return (
      <Spin spinning={isLoading}>
        <Page
          title={"Spare Dashboard"}
          filter={
            <Form
              hidden={this.props.hideFilter}
              onFinish={this.onFinish}
              form={this.props.form}
              layout="inline"
              // initialValues={{ mode: 2 }}
              preserve={true}
              // size="small"
              // mode={mode}
            >
              <Form.Item name="mode" hidden></Form.Item>
              <Form.Item name="startDate" hidden></Form.Item>
              <Form.Item name="endDate" hidden></Form.Item>
              <Form.Item name="aHId" style={{ minWidth: "250px" }}>
                <TreeSelect
                  onChange={(v) => {
                    this.getDashboardDetails(v);
                  }}
                  showSearch
                  loading={this.state.isparentTreeListLoading}
                  placeholder="Entity"
                  allowClear
                  treeDefaultExpandAll={false}
                  treeData={this.state.parentTreeList}
                ></TreeSelect>
              </Form.Item>

              <Form.Item hidden>
                <DateFilter />
              </Form.Item>
              {/* <Badge count={10} color="hwb(205 6% 9%)"> */}
              <Button
                onClick={() => this.setState({ open: true })}
                style={{
                  backgroundColor: isFilterApplied ? "#c9cccf	" : "inherit",
                }}
              >
                <FilterFilled />
              </Button>
              {/* </Badge> */}

              <Drawer
                title={<div style={{ fontSize: "20px" }}>Filter</div>}
                placement="right"
                onClose={this.onClose}
                visible={open}
              >
                <Form
                  onFinish={this.onFinish}
                  form={this.props.form}
                  layout="vertical"
                  //initialValues={{ mode: 2 }}
                  preserve={true}
                >
                  <CustomCollapsePanel title="Range">
                    <div>
                      {/* <DateFilter /> */}
                      <DateTabs
                        open={this.state.isDateTabsOpen}
                        setOpen={this.handleDateTabsOpen}
                        change={(data) => this.setDatefield(data)}
                      />
                    </div>
                  </CustomCollapsePanel>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: "100%" }}
                      onClick={() => {
                        this.handleApplyFilter();
                      }}
                    >
                      <SearchOutlined /> Apply
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      onClick={() => {
                        this.reset();
                        this.handleResetFilter();
                      }}
                      style={{ width: "100%" }}
                    >
                      Reset
                    </Button>
                  </Form.Item>
                </Form>
              </Drawer>
            </Form>
          }
        >
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Card
                style={{ width: "100%", marginBottom: "10px" }}
                size="small"
              >
                <div className="average-container" style={{ padding: "0px" }}>
                  {[
                    {
                      title: "Requested Spares",
                      value: this.state.dashboardData?.requestedSpare,
                      percentage: 19.6,
                      icon: <HeatMapOutlined />,
                    },
                    {
                      title: "Dispatched Spares",
                      value: this.state.dashboardData?.dispatchedSpare,
                      percentage: 17.2,
                      icon: <ThunderboltOutlined />,
                    },
                    {
                      title: "Acknowledged Spares",
                      value: this.state.dashboardData?.acknowledgedSpare,
                      percentage: 7.5,
                      icon: <NodeIndexOutlined />,
                    },
                  ]?.map((e) => (
                    <AvgCard
                      title={e.title}
                      // unit={e.unit}
                      value={e.value}
                      bgColor={e.bgColor}
                      icon={e.icon}
                      percentage={e.percentage}
                    />
                  ))}
                </div>
              </Card>
              <Row>
                <Col span={24}>
                  <Card>
                    <Title level={5}>Spare Request Count</Title>
                    <StackedBarChart
                      horizontal={false}
                      height={307}
                      series={this.state.dashboardData?.graphList}
                    />
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Row gutter={[10, 10]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Card
                    size="small"
                    style={{ width: "100%", height: "295px" }}
                    bodyStyle={{ padding: "8px" }}
                  >
                    <Row justify={"space-between"}>
                      <Title level={5} style={{ marginBottom: "0px" }}>
                        Purchase List
                      </Title>
                    </Row>
                    <Card
                      hoverable
                      size="large"
                      style={{
                        backgroundColor: "#F2F3FD",
                        marginTop: "10px",
                      }}
                    >
                      <Link
                        to={`../../spare-parts/purchase-history?systemGenerated=${false}&startDate=${startDate}&endDate=${endDate}`}
                      >
                        <Row gutter={[10, 10]} justify={"space-between"}>
                          <Col>
                            <div style={{ color: "#8B908F" }}>
                              Purchase Request Count
                            </div>
                          </Col>
                          <Col>
                            <div style={{ color: "#666666" }}>
                              {this.state.dashboardData.purchaseReqManual
                                ? this.state.dashboardData.purchaseReqManual
                                    ?.length
                                : 0}
                            </div>
                          </Col>
                        </Row>
                      </Link>
                    </Card>
                    <Card
                      hoverable
                      size="large"
                      style={{
                        backgroundColor: "#F2F3FD",
                        marginTop: "10px",
                      }}
                    >
                      <Link
                        to={`../../spare-parts/purchase-history?systemGenerated=${true}&startDate=${startDate}&endDate=${endDate}`}
                      >
                        <Row gutter={[10, 10]} justify={"space-between"}>
                          <Col>
                            <div style={{ color: "#8B908F" }}>
                              Auto Generated Req Count
                            </div>
                          </Col>
                          <Col>
                            <div style={{ color: "#666666" }}>
                              {this.state.dashboardData.purchaseReqSys
                                ? this.state.dashboardData.purchaseReqSys
                                    ?.length
                                : 0}
                            </div>
                          </Col>
                        </Row>
                      </Link>
                    </Card>
                  </Card>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                  style={{ paddingBottom: "0px" }}
                >
                  <Card
                    size="small"
                    style={{ width: "100%", height: "295px" }}
                    bodyStyle={{ padding: "8px" }}
                  >
                    <Carousel style={{ width: "100%", height: "286px" }}>
                      <div size="small" style={{ borderRadius: "10px" }}>
                        <style>
                          {`
                            .custom-row-padding td {
                              padding: 13px !important;
                            }
                          `}
                        </style>
                        <Card
                          size="small"
                          style={{
                            backgroundColor: "#F2F3FD",
                            marginBottom: "10px",
                          }}
                        >
                          <Row gutter={10}>
                            <Col>
                              <Avatar
                                shape="square"
                                size={40}
                                style={{
                                  background:
                                    "linear-gradient(to right, #02AAB0, #00CDAC)",
                                  verticalAlign: "middle",
                                }}
                                icon={<StockOutlined />}
                              />
                            </Col>
                            <Col>
                              <div style={{ color: "#666666" }}>
                                Calibration Overdue
                              </div>
                              <div style={{ color: "#8B908F" }}>
                                {this.state.dashboardData?.calibrationOverdue
                                  ? this.state.dashboardData?.calibrationOverdue
                                      .length
                                  : 0}
                              </div>
                            </Col>
                          </Row>
                        </Card>
                        <Table
                          size="small"
                          rowClassName={() => "custom-row-padding"}
                          style={{ width: "100%" }}
                          columns={this.columns}
                          dataSource={calibrationOverdueData}
                          pagination={false}
                          // locale={locale}
                        />
                      </div>
                      <div size="small" style={{ borderRadius: "10px" }}>
                        <Card
                          size="small"
                          style={{
                            backgroundColor: "#F2F3FD",
                            marginBottom: "10px",
                          }}
                        >
                          <Row gutter={10}>
                            <Col>
                              <Avatar
                                shape="square"
                                size={40}
                                style={{
                                  background:
                                    "linear-gradient(to right, #02AAB0, #00CDAC)",
                                  verticalAlign: "middle",
                                }}
                                icon={<StockOutlined />}
                              />
                            </Col>
                            <Col>
                              <div style={{ color: "#666666" }}>
                                To Be Calibrated
                              </div>
                              <div style={{ color: "#8B908F" }}>
                                {this.state.dashboardData?.toBeCalibrated
                                  ? this.state.dashboardData?.toBeCalibrated
                                      .length
                                  : 0}
                              </div>
                            </Col>
                          </Row>
                        </Card>
                        <Table
                          rowClassName={() => "custom-row-padding"}
                          size="small"
                          style={{ width: "100%", height: "189px" }}
                          columns={this.columns}
                          dataSource={toBeCalibratedData}
                          pagination={false}
                          // locale={locale}
                        />
                      </div>
                    </Carousel>
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Card size="small" style={{ width: "100%" }}>
                    <Title level={5}>Most Requested Spares</Title>
                    <div style={{ marginRight: "100px", width: "100%" }}>
                      <BarChart1
                        height={152}
                        type="bar"
                        series={mostRequestedSpares}
                        ylableShow={false}
                        toolbarStatus={false}
                        legendShow={false}
                      />
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Card size="small" style={{ width: "100%" }}>
                    <Title level={5}>Purchase Request</Title>
                    <Donut
                      legend={true}
                      legendPosition={"bottom"}
                      series={purchaseRequestData}
                      height={200}
                    />
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(withForm(Dashboard)));
