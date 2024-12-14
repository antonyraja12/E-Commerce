import { FilterFilled, SearchOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  Drawer,
  Form,
  Row,
  Spin,
  TreeSelect,
  Typography,
} from "antd";
import DashboardService from "../../../services/preventive-maintenance-services/dashboard-service";
import moment from "moment";
import Page from "../../../utils/page/page";
import { withForm } from "../../../utils/with-form";
import DateFilter from "../../remote-monitoring/common/date-filter";
import FilterFunctions from "../../remote-monitoring/common/filter-functions";
import { BellOutlined } from "@ant-design/icons";
import { Input, Modal, notification } from "antd";
import { debounce } from "lodash";
import ParameterGraph from "../../../component/parameter-graph";
import CustomCollapsePanel from "../../../helpers/collapse";
import MenuService from "../../../services/menu-service";
import { withRouter } from "../../../utils/with-router";
const style = {
  formItem: {
    minWidth: "120px",
  },
};
const { Text } = Typography;
const { Search } = Input;
const { Panel } = Collapse;
const cardStyle1 = {
  backgroundColor: "#1890ff",
  color: "white",
  marginBottom: "16px",
};

const cardStyle2 = {
  backgroundColor: "#f0f0f0",
  color: "black",
  marginBottom: "16px",
};
const gradientCardStyle = {
  background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  color: "white",
  marginBottom: "16px",
};
const shadowCardStyle = {
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  marginBottom: "16px",
};
const glassmorphismCardStyle = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "16px",
};
const outlinedCardStyle = {
  border: "1px solid #e8e8e8",
  marginBottom: "16px",
};
const gradientButtonStyle = {
  background: "linear-gradient(45deg, #f6d365 0%, #fda085 100%)",
  color: "white",
  border: "none",
  marginBottom: "16px",
};
const roundedButtonStyle = {
  borderRadius: "20px",
  marginBottom: "16px",
};
const materialCardStyle = {
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
  borderRadius: "4px",
  transition: "box-shadow 0.3s",
  cursor: "pointer",
  marginBottom: "16px",
};
const neumorphismCardStyle = {
  background: "#f0f0f0",
  boxShadow: "8px 8px 16px 0 rgba(0,0,0,0.2)",
  borderRadius: "16px",
  padding: "16px",
  marginBottom: "16px",
};

class MainDashboardCbm extends FilterFunctions {
  state = {
    isLoading: false,
    userList: [],
    assetList: [],
    filteredUserList: [],
    filteredAssetList: [],
    userSearchValue: "",
    assetSearchValue: "",
    startDateValue: null,
    endDateValue: null,
    graphCount: 1,
    graphs: [{}],
    modalVisible: false,
    mode: "",
    menuId: null,
    selectedUserCount: 0,
    selectedAssetCount: 0,
    selectedStatusCount: 0,
    selectedPanelCount: 0,
    selectedPriorityCount: 0,
    selectedFields: {
      userIds: [],
      assetId: [],
      status: [],
      priority: [],
    },
    showModal: false,
    isFilterApplied: false,
  };
  menuservice = new MenuService();
  service = new DashboardService();
  componentDidMount() {
    this.getUserList();
    this.getAssetList();
    this.getAppHierarchyList();
    this.props.form.submit();

    const currentDate = moment();
    const startDate = currentDate.clone().startOf("week");
    const endDate = currentDate.clone().endOf("week");
    const startDateValue = startDate.toISOString();
    const endDateValue = endDate.toISOString();

    this.setState({
      startDateValue,
      endDateValue,
    });
    const startOfWeek = moment().startOf("week").toDate();
    const endOfWeek = moment().endOf("week").toDate();

    this.props?.form.setFieldsValue({
      startDate: startOfWeek,
      endDate: endOfWeek,
    });
  }

  onFinish = (value = {}) => {
    this.setState((state) => ({ ...state, isLoading: true }));
    let obj = { ...value };
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
    const anyFieldSelected = Object.values(this.state.selectedFields).some(
      (selected) => selected
    );
    this.setState({ isAnyFieldSelected: anyFieldSelected });
    this.setState({ isFilterApplied: true });
    const selectedUserCount = this.props.form.getFieldValue("userIds")
      ? this.props.form.getFieldValue("userIds").length
      : 0;
    const selectedAssetCount = this.props.form.getFieldValue("assetId")
      ? this.props.form.getFieldValue("assetId").length
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
    if (selectedAssetCount > 0 || this.state.selectedFields.assetId.length > 0)
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
    });
  };

  handleResetFilter = () => {
    this.setState({
      selectedFields: {
        userIds: false,
        assetId: false,
        status: false,
      },
      isAnyFieldSelected: false,
      isFilterApplied: false,
    });
    this.props.form.resetFields();
    this.setState({
      selectedUserCount: 0,
      selectedAssetCount: 0,
      selectedStatusCount: 0,
      selectedPanelCount: 0,
      selectedPriorityCount: 0,
    });
  };

  onClose = () => {
    this.setState({ open: false });
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

  openNotification = () => {
    notification.open({
      message: "New Notification",
      description: "This is the content of the notification.",
      onClick: () => {
        this.setState({ modalVisible: true });
      },
    });
  };

  handleModalCancel = () => {
    this.setState({ modalVisible: false });
  };

  setDatefield = (v) => {
    this.props?.form.setFieldsValue({
      startDate: new Date(v.startDate),
      endDate: new Date(v.endDate),
    });
    this.setState((state) => state);
  };
  addGraph = () => {
    this.setState((prevState) => ({
      graphs: [...prevState.graphs, {}],
    }));
  };

  removeGraph = (index) => {
    this.setState((prevState) => {
      const newGraphs = [...prevState.graphs];
      newGraphs.splice(index, 1);
      return {
        graphs: newGraphs,
      };
    });
  };
  renderGraphs = () => {
    const { graphs } = this.state;

    return graphs.map((graph, index) => (
      <div key={index}>
        <h3> Graph {index + 1}</h3>
        <Card size="small">
          <ParameterGraph />
        </Card>
        <br />
        {index !== 0 && (
          <Row justify="center">
            <Button type="primary" onClick={() => this.removeGraph(index)}>
              Cancel
            </Button>
          </Row>
        )}
      </div>
    ));
  };

  render() {
    const { location } = this.props;
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
    const { startDateValue, endDateValue } = this.state;
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
    const { menuId } = this.state;
    return (
      <Page
        title="Dashboard"
        filter={
          <Row justify="space-between">
            <Col>
              <Form
                onFinish={this.onFinish}
                form={this.props.form}
                layout="inline"
                preserve={true}
              >
                <Form.Item name="mode" hidden></Form.Item>
                <Form.Item name="startDate" hidden></Form.Item>
                <Form.Item name="endDate" hidden></Form.Item>
                <Form.Item name="ahId" style={{ minWidth: "250px" }}>
                  <TreeSelect
                    onChange={(v) => this.getAssetList(v)}
                    showSearch
                    loading={this.state.isparentTreeListLoading}
                    placeholder="Site"
                    allowClear
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
                    preserve={true}
                  >
                    <CustomCollapsePanel title="Asset">
                      <div className="scrollable-section medium-scrollbar">
                        <Input
                          bordered={false}
                          size="middle"
                          placeholder="Search Asset"
                          value={assetSearchValue}
                          onChange={(e) =>
                            this.handleAssetSearch(e.target.value)
                          }
                          style={{
                            width: "100%",
                            borderBottom: "1px solid #dddddd",
                          }}
                        />
                        <Form.Item name="assetId" style={style.formItem}>
                          <Checkbox.Group style={{ width: "100%" }}>
                            <ul
                              style={{
                                listStyle: "none",
                                paddingLeft: "5px",
                                marginTop: "10px",
                              }}
                            >
                              {filteredAssetList.length > 0
                                ? filteredAssetList.map((asset) => (
                                    <li key={asset.value}>
                                      <Checkbox value={asset.value}>
                                        {asset.label}
                                      </Checkbox>
                                    </li>
                                  ))
                                : assetSearchValue && (
                                    <li>
                                      <Text type="danger">
                                        No matching assets found.
                                      </Text>
                                    </li>
                                  )}
                              {!filteredAssetList.length && !assetSearchValue
                                ? assetList.map((asset) => (
                                    <li key={asset.value}>
                                      <Checkbox value={asset.value}>
                                        {asset.label}
                                      </Checkbox>
                                    </li>
                                  ))
                                : null}
                            </ul>
                          </Checkbox.Group>
                        </Form.Item>
                      </div>
                    </CustomCollapsePanel>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ width: "100%" }}
                        onClick={() => {
                          this.handleApplyFilter();
                          this.onClose();
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
            </Col>
            <Col span={2}>
              <Button type="primary" onClick={this.openNotification}>
                <BellOutlined />
              </Button>
            </Col>
          </Row>
        }
      >
        <Spin spinning={this.state.isLoading}>
          <Row gutter={[10, 10]}>
            <Col sm={6} xs={6}>
              <div style={neumorphismCardStyle}>
                <h3>Glassmorphism Card</h3>
                Card content with glassmorphism effect
              </div>
            </Col>
            <Col sm={6} xs={6}>
              <div style={neumorphismCardStyle}>
                <h3>Glassmorphism Card</h3>
                Card content with glassmorphism effect
              </div>
            </Col>
            <Col sm={6} xs={6}>
              <div style={neumorphismCardStyle}>
                <h3>Glassmorphism Card</h3>
                Card content with glassmorphism effect
              </div>
            </Col>
            <Col sm={6} xs={6}>
              <div style={neumorphismCardStyle}>
                <h3>Glassmorphism Card</h3>
                Card content with glassmorphism effect
              </div>
            </Col>
            <Col sm={6} xs={6}>
              <div style={neumorphismCardStyle}>
                <h3>Glassmorphism Card</h3>
                Card content with glassmorphism effect
              </div>
            </Col>
          </Row>
          <Modal
            title="Notification Details"
            visible={this.state.modalVisible}
            onCancel={this.handleModalCancel}
            footer={null}
          >
            <p>This is the content of the notification.</p>
          </Modal>
        </Spin>
      </Page>
    );
  }
}

export default withRouter(withForm(MainDashboardCbm));
