import { FilterFilled, SearchOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  Drawer,
  Form,
  Row,
  Select,
  Spin,
  TreeSelect,
  Typography,
} from "antd";
import ReactApexChart from "react-apexcharts";
import { createSearchParams } from "react-router-dom";
import BarGraph from "../../../component/BarGraph";
import DashboardService from "../../../services/preventive-maintenance-services/dashboard-service";
//import WorkFlowHomeService from "../../../services/preventive-maintenance-services/workflow-home-service";
import { Input } from "antd";
import { debounce } from "lodash";
import moment from "moment";
import { AiOutlineUserAdd } from "react-icons/ai";
import { BsUiChecks } from "react-icons/bs";
import { CiBoxList } from "react-icons/ci";
import { MdDoneAll, MdRemoveDone } from "react-icons/md";
import { TfiNewWindow } from "react-icons/tfi";
import { Link } from "react-router-dom";
import BarChart1 from "../../../component/BarChart1";
import BarChart2 from "../../../component/BarChart2";
import TileCardOne from "../../../component/tile-card-one";
import CustomCollapsePanel from "../../../helpers/collapse";
import DateTabs from "../../../helpers/data";
import MtbfService from "../../../services/preventive-maintenance-services/mtbf-service";
import MttrService from "../../../services/preventive-maintenance-services/mttr-service";
import Page from "../../../utils/page/page";
import { withAuthorization } from "../../../utils/with-authorization";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";
import DateFilter from "../../remote-monitoring/common/date-filter";
import FilterFunctions from "../../remote-monitoring/common/filter-functions";
import DynamicDashboardConfigurationService from "../../../services/dynamic-dashboard-configuration-service";
const style = {
  formItem: {
    minWidth: "120px",
  },
};

const { Text } = Typography;
const { Search } = Input;
const { Panel } = Collapse;
class MainDashboard extends FilterFunctions {
  state = {
    aHId: "",
    mttrValue: [],
    mtbfValue: [],
    isLoading: false,
    userList: [],
    assetList: [],
    filteredUserList: [],
    filteredAssetList: [],
    userSearchValue: "",
    assetSearchValue: "",
    startDateValue: null,
    endDateValue: null,
    // selectedFields: {
    //   userIds: false,
    //   assetIds: false,
    //   status: false,
    // },
    mode: "",
    selectedUserCount: 0,
    selectedAssetCount: 0,
    selectedStatusCount: 0,
    selectedPanelCount: 0,
    selectedPriorityCount: 0,
    isDateTabsOpen: false,
    selectedFields: {
      userIds: [],
      assetIds: [],
      status: [],
      priority: [],
    },
    showModal: false,
    isFilterApplied: false,
  };
  service = new DashboardService();
  MttrService = new MttrService();
  MtbfService = new MtbfService();
  dashboardConfig = new DynamicDashboardConfigurationService();

  async initializeComponent() {
    try {
      await this.getAppHierarchyList();
      const aHID = this.props.form.getFieldValue("ahId");

      await Promise.all([this.getUserList(aHID), this.getAssetList(aHID)]);

      const currentDate = moment();
      const startDate = currentDate.clone().startOf("week");
      const endDate = currentDate.clone().endOf("week");
      this.setState({
        startDateValue: startDate.toISOString(),
        endDateValue: endDate.toISOString(),
      });

      const startOfWeek = moment().startOf("week").toDate();
      const endOfWeek = moment().endOf("week").toDate();

      this.props.form.setFieldsValue({
        startDate: startOfWeek,
        endDate: endOfWeek,
        assetId: this.props.assetId,
        ahId: this.props.aHId,
      });

      this.props.form.submit();
    } catch (error) {
      console.error("Error during initialization:", error);
    }
  }

  componentDidMount() {
    this.initializeComponent();
    this.loadConfig();
  }
  loadConfig = () => {
    this.dashboardConfig
      .list()
      .then(({ data }) => {
        const convertedData = data.reduce((acc, item) => {
          acc[item.dynamicDashboardName] = item.status;
          return acc;
        }, {});
        this.setState((state) => ({
          ...this.state,
          dashboardConfig: convertedData,
        }));
      })
      .catch((error) => {
        console.error("Failed to load dashboard config:", error);
      });
  };
  onFinish = (value = {}) => {
    this.setState((state) => ({ ...state, isLoading: true }));
    let obj = {
      ...value,
      assetIds: value.assetIds ? value.assetIds : this.props?.assetId,
    };
    if (obj.mode === 5) {
      obj.fromDate = moment(value.dateRange[0]).format("YYYY-MM-DD");
      obj.toDate = moment(value.dateRange[1]).format("YYYY-MM-DD");
    }

    delete obj.dateRange;
    this.service
      .dashboard(obj)
      .then((response) => {
        this.setState((state) => ({
          ...state,
          ageingOfTicket: response.data.ageingOfTicket,
          executionStatus: response.data.executionStatus,
          ticketCount: [
            {
              name: "Ticket Count",
              data: response.data.ticketCount,
            },
          ],
          repeatedAbnormality: [
            {
              name: "Checks",
              data: response.data.abnormality,
            },
          ],
          ticketStatus: response.data.ticketStatus,
          mttrValue: [
            {
              name: "MTTR Value",
              data: response.data.MTTRValues,
            },
          ],
          mtbfValue: [
            {
              name: "MTBF Value",
              data: response.data.MTBFValue,
            },
          ],
        }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
      });
  };
  onSearchUser = (value) => {
    const filteredUserList = this.state.userList.filter((user) =>
      user.label.toLowerCase().includes(value.toLowerCase())
    );

    this.setState({ filteredUserList, userSearchValue: value });
  };

  loadMttr = (v) => {
    this.MttrService.getbyaHId(v)
      .then((response) => {
        this.setState((state) => ({
          ...state,
          mttrValue: response.data.data,
        }));
      })
      .catch((error) => {
        console.error("Error1:", error);
      });
  };
  loadMtbf = (v) => {
    this.MtbfService.getbyaHId(v)
      .then((response) => {
        this.setState((state) => ({
          ...state,
          mtbfValue: response.data.data,
        }));
      })
      .catch((error) => {
        console.error("Error1:", error);
      });
  };
  onSearchAsset = (value) => {
    const filteredAssetList = this.state.assetList.filter((asset) =>
      asset.label.toLowerCase().includes(value.toLowerCase())
    );

    this.setState({ filteredAssetList, assetSearchValue: value });
  };
  handleUserSearch = debounce((value) => {
    this.setState({ userSearchValue: value }, () => this.onSearchUser(value));
  }, 500);

  handleAssetSearch = debounce((value) => {
    this.setState({ assetSearchValue: value }, () => this.onSearchAsset(value));
  }, 500);

  showDrawer = () => {
    this.setState({ open: true });
  };
  handleToggleFieldSelection = (fieldName) => {
    this.setState((prevState) => {
      const updatedSelectedFields = {
        ...prevState.selectedFields,
        [fieldName]: !prevState.selectedFields[fieldName],
      };
      const anyFieldSelected = Object.values(updatedSelectedFields).some(
        (selected) => selected
      );
      return {
        selectedFields: updatedSelectedFields,
        isAnyFieldSelected: anyFieldSelected,
        isFilterApplied: false,
      };
    });
  };
  handleDateTabsModeChange = (mode) => {
    this.setState({ mode }, () => {
      this.props.form.submit();
    });
  };
  handleApplyFilter = () => {
    this.onClose();
    const anyFieldSelected = Object.values(this.state.selectedFields).some(
      (selected) => selected
    );
    this.setState({ isAnyFieldSelected: anyFieldSelected });
    this.setState({ isFilterApplied: true });
    const selectedUserCount = this.props.form.getFieldValue("userIds")
      ? this.props.form.getFieldValue("userIds").length
      : 0;
    const selectedAssetCount = this.props.form.getFieldValue("assetIds")
      ? this.props.form.getFieldValue("assetIds").length
      : 0;
    const selectedStatusCount = this.props.form.getFieldValue("status")
      ? this.props.form.getFieldValue("status").length
      : 0;
    const selectedPriorityCount = this.props.form.getFieldValue("priority")
      ? this.props.form.getFieldValue("priority").length
      : 0;

    let selectedPanelCount = 0;
    if (selectedUserCount > 0 || this.state.selectedFields.userIds.length > 0)
      selectedPanelCount++;
    if (selectedAssetCount > 0 || this.state.selectedFields.assetIds.length > 0)
      selectedPanelCount++;
    if (selectedStatusCount > 0 || this.state.selectedFields.status.length > 0)
      selectedPanelCount++;
    if (
      selectedPriorityCount > 0 ||
      this.state.selectedFields.priority.length > 0
    )
      selectedPanelCount++;

    this.setState({
      selectedUserCount,
      selectedAssetCount,
      selectedStatusCount,
      selectedPriorityCount,
      // selectedPanelCount,
    });
  };

  handleResetFilter = () => {
    this.setState({
      selectedFields: {
        userIds: false,
        assetIds: false,
        status: false,
      },
      isAnyFieldSelected: false,
      isFilterApplied: false,
    });
    this.props.form.resetFields();
    this.onClose();
    this.setState({
      selectedUserCount: 0,
      selectedAssetCount: 0,
      selectedStatusCount: 0,
      selectedPanelCount: 0,
      selectedPriorityCount: 0,
    });
  };
  onClose = () => {
    this.setState({ open: false, isDateTabsOpen: false });
  };
  handleDateTabsOpen = () => {
    this.setState({ isDateTabsOpen: !this.state.isDateTabsOpen });
  };
  reset = () => {
    this.onFinish({ mode: 2 });
    this.props.form.resetFields();
    this.setState({
      filteredUserList: [],
      filteredAssetList: [],
      userSearchValue: "",
      assetSearchValue: "",
    });
  };
  handleExecClick = (value) => {
    // console.log(mode,"hu");
    this.props.navigate({
      pathname: "../checklist-execution",
      search: `?${createSearchParams({
        status: value,
        // mode:mode,
        ...this.props?.form.getFieldsValue(),
      })}`,
    });
  };
  handleExecClick1 = (value) => {
    this.props.navigate({
      pathname: "../resolution-work-order",
      search: `?${createSearchParams({
        // status:value,

        ...this.props?.form.getFieldsValue(),
      })}`,
    });
  };
  handleExecClick2 = (value, mode) => {
    this.props.navigate({
      pathname: "../resolution-work-order",
      search: `?${createSearchParams({
        // status:value,
        mode: mode,
        ...this.props?.form.getFieldsValue(),
      })}`,
    });
  };
  handleExecClick3 = (value) => {
    // console.log("value12", value);
    this.props.navigate({
      pathname: "../resolution-work-order",
      search: `?${createSearchParams({
        checkDescription: value,
        // mode:mode,
        ...this.props?.form.getFieldsValue(),
      })}`,
    });
  };
  handleExecClick4 = (value) => {
    // console.log(mode,"hu");
    this.props.navigate({
      pathname: "../resolution-work-order",
      search: `?${createSearchParams({
        status: value,
        // mode:mode,
        ...this.props?.form.getFieldsValue(),
      })}`,
    });
  };

  setDatefield = (v) => {
    this.props?.form.setFieldsValue({
      startDate: new Date(v.startDate),
      endDate: new Date(v.endDate),
    });
    this.setState((state) => state);
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.aHId !== prevProps.aHId) {
      this.props.form.setFieldValue("ahId", this.props.aHId);
    }

    // if (this.props.assetId !== prevProps.assetId) {
    //   this.props.form.setFieldValue("assetIds", this.props.assetId);
    // }
    if (prevProps.assetId !== this.props.assetId && this.props.assetId) {
      this.onFinish();
      this.props.form.setFieldValue("assetIds", this.props.assetId);
    }
    if (
      this.props.aHId !== prevProps.aHId ||
      this.props.assetId !== prevProps.assetId
    ) {
      this.props.form.submit();
    }
  }

  render() {
    const {
      open,
      status,
      selectedFields,
      isAnyFieldSelected,
      isFilterApplied,
      selectedUserCount,
      selectedAssetCount,
      selectedStatusCount,
      selectedPanelCount,
      selectedPriorityCount,
    } = this.state;
    const {
      filteredUserList,
      filteredAssetList,
      userSearchValue,
      assetSearchValue,
      userList,
      assetList,
      mode,
    } = this.state;
    const totalCount =
      selectedUserCount +
      selectedAssetCount +
      selectedStatusCount +
      selectedPanelCount +
      selectedPriorityCount;
    // const { startDate, endDate } = this.props;
    const { startDateValue, endDateValue, dashboardConfig } = this.state;
    const color = [
      "#2196f3",
      "#87d068",
      "purple",
      "orange",
      "red",
      "green",
      "purple",
    ];
    const total = this.state.ticketStatus?.reduce((c, e) => {
      c += Number(e.y);
      return c;
    }, 0);

    const dataToPass = {
      status: "some_status_value",
      otherData: "some_other_value",
    };
    const { isLoading } = this.props;
    // console.log("access", access[0].length);
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }
    console.log(this.props, "props");
    console.log(this.props.hideFilter, "filter");

    return (
      <Spin spinning={isLoading}>
        <Page
          hideFilter={this.props.hideFilter}
          title="Dashboard"
          // mode={mode}
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
              <Form.Item name="ahId" style={{ minWidth: "250px" }}>
                <TreeSelect
                  onChange={(v) => {
                    this.getAssetList(v);
                    this.getUserList(v);
                    this.setOrganization(v);
                    this.loadMttr(v);
                    this.loadMtbf(v);
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
              <Badge count={totalCount} color="hwb(205 6% 9%)">
                <Button
                  onClick={() => this.setState({ open: true })}
                  style={{
                    backgroundColor: isFilterApplied ? "#c9cccf	" : "inherit",
                  }}
                >
                  <FilterFilled />
                </Button>
              </Badge>

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
                  <CustomCollapsePanel title="User">
                    <Form.Item name="userIds" style={{ minWidth: "250px" }}>
                      <Select
                        // onChange={this.getUserList}
                        showSearch
                        loading={this.state.isUserListLoading}
                        placeholder="UserName"
                        allowClear
                        filterOption={(input, option) =>
                          option.label
                            .toLowerCase()
                            .includes(input.toLowerCase()) || input === ""
                        }
                        mode="multiple"
                        options={this.state.userList}
                      ></Select>
                    </Form.Item>
                  </CustomCollapsePanel>

                  <CustomCollapsePanel title="Asset">
                    <Form.Item name="assetIds" style={style.formItem}>
                      <Select
                        mode="multiple"
                        showSearch
                        loading={this.state.isAssetListLoading}
                        placeholder="Asset"
                        allowClear
                        options={this.state.assetList}
                        filterOption={(input, option) =>
                          option.label
                            .toLowerCase()
                            .includes(input.toLowerCase()) || input === ""
                        }
                      ></Select>
                    </Form.Item>
                  </CustomCollapsePanel>

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
          <Spin spinning={this.state.isLoading}>
            <Row gutter={[10, 10]}>
              <Col sm={24} xs={24} md={24} lg={24}>
                <Row gutter={[10, 10]}>
                  {this.state.ticketStatus?.map((e, i) => {
                    let index;
                    // let n = color.length;
                    // if (i >= n) {
                    if (i == 4) {
                      index = 5;
                    } else {
                      index = i;
                    }

                    // }
                    const icon = [
                      <TfiNewWindow />,
                      <AiOutlineUserAdd />,
                      <CiBoxList />,
                      <BsUiChecks />,
                      <MdRemoveDone />,
                      <MdDoneAll />,
                    ];

                    // const link = ;

                    return (
                      <Col flex={1}>
                        <Link
                          to={`../resolution-work-order?startDate=${startDateValue}&endDate=${endDateValue}&status=${index}`}
                        >
                          <TileCardOne
                            label={e.x}
                            value={e.y}
                            color={color[index]}
                            icon={icon[index]}
                            percentage={(e.y / total) * 100}
                            //  onClick={this.handleExecClick4}
                          />
                        </Link>
                      </Col>
                    );
                  })}
                </Row>
              </Col>
              <Col sm={24} xs={24} md={24} lg={12}>
                <Card size="small">
                  <BarGraph
                    title="Overall Ticket Count"
                    callbackClick={this.handleExecClick2}
                    series={
                      this.state.ticketCount?.length > 0
                        ? this.state.ticketCount[0].data
                        : []
                    }
                  />
                </Card>
              </Col>
              <Col sm={24} xs={24} md={24} lg={12}>
                <Card size="small">
                  <BarChart1
                    height={250}
                    type="bar"
                    callbackClick={this.handleExecClick3}
                    series={
                      this.state.repeatedAbnormality?.length > 0
                        ? this.state.repeatedAbnormality[0].data
                        : []
                    }
                    title="Repeated Abnormality"
                  />
                </Card>
              </Col>
              <Col sm={24} xs={24} md={24} lg={12}>
                <Card size="small">
                  <BarChart2
                    series={this.state.executionStatus}
                    title="PM Checklist Execution Status"
                    callbackClick={this.handleExecClick}
                  />
                </Card>
              </Col>

              <Col sm={24} xs={24} md={24} lg={12}>
                <Card size="small">
                  <BarChart1
                    series={this.state.ageingOfTicket}
                    title="Aging of Ticket"
                    callbackClick={this.handleExecClick1}
                  />
                </Card>
              </Col>
              {dashboardConfig?.pmMttr && (
                <Col sm={24} xs={24} md={24} lg={12}>
                  <Card size="small">
                    <Typography.Title level={5}>
                      <strong>MTTR</strong>
                    </Typography.Title>
                    <ReactApexChart
                      options={{
                        chart: {
                          type: "bar",
                          height: 350,
                        },
                        xaxis: {
                          type: "category",
                        },
                        yaxis: {
                          type: "numeric",
                        },
                      }}
                      series={this.state.mttrValue}
                      type="bar"
                      height={200}
                    />
                  </Card>
                </Col>
              )}

              {dashboardConfig?.pmMtbf && (
                <Col sm={24} xs={24} md={24} lg={12}>
                  <Card size="small">
                    <Typography.Title level={5}>
                      <strong>MTBF</strong>
                    </Typography.Title>
                    <ReactApexChart
                      options={{
                        chart: {
                          type: "bar",
                          height: 350,
                        },
                        xaxis: {
                          type: "category",
                        },
                        yaxis: {
                          type: "numeric",
                        },
                      }}
                      series={this.state.mtbfValue}
                      type="bar"
                      height={200}
                    />
                  </Card>
                </Col>
              )}
            </Row>
          </Spin>
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(withForm(MainDashboard)));
