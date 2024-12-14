import {
  FieldTimeOutlined,
  FilterFilled,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Checkbox,
  Drawer,
  Form,
  message,
  Select,
  Space,
  Spin,
  Table,
  TreeSelect,
  Typography,
} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import { debounce } from "lodash";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import CustomCollapsePanel from "../../../helpers/collapse";
import DateTabs from "../../../helpers/data";
import WorkorderResolutionService from "../../../services/quality-inspection/workorder-resolution-service";
import Page from "../../../utils/page/page";
import { withAuthorization } from "../../../utils/with-authorization";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";
import FilterFunctions from "../../remote-monitoring/common/filter-functions";
import ResolutionWorkOrderVerify from "./resolution-work-order-verify";
import TimelineList from "./timeline";
const style = {
  formItem: {
    minWidth: "120px",
  },
};
const { Text } = Typography;
class ResolutionWorkOrder extends FilterFunctions {
  service = new WorkorderResolutionService();
  constructor(props) {
    super(props);
    this.selectAllUsers = this.selectAllUsers.bind(this);
    this.state = {
      value: "",
      userList: [],
      assetList: [],
      maintenanceType: [],
      filteredUserList: [],
      filteredAssetList: [],
      filteredMaintenanceTypeList: [],
      userSearchValue: "",
      assetSearchValue: "",
      typeSearchValue: "",
      status: null,
      isSelectAllIndeterminate: false,

      selectedUserCount: 0,
      selectedAssetCount: 0,
      selectedStatusCount: 0,
      selectedPanelCount: 0,
      selectedPriorityCount: 0,
      selectedMaintenanceTypeCount: 0,
      selectedFields: {
        userIds: [],
        assetIds: [],
        status: [],
        priority: [],
        maintenanceTypeId: [],
      },
      isDateTabsOpen: false,
      showModal: false,
      isFilterApplied: false,
      isAnyFieldSelected: false,
    };
  }
  componentDidMount() {
    this.getUserList();
    this.getAppHierarchyList();
    this.getAssetList();
    this.getCurrentUserList();
    this.getMaintenaceTypeList();

    const params = new URLSearchParams(this.props.location.search);
    const startDate = params.get("startDate");
    const endDate = params.get("endDate");
    const checkDescription = params.get("checkDescription");
    const startDateString = params.get("startDate");
    const endDateString = params.get("endDate");
    const status = params.get("status");

    if (checkDescription || startDateString || endDateString || status) {
      const startDateInstant = startDateString
        ? moment(startDateString).toISOString()
        : null;
      const endDateInstant = endDateString
        ? moment(endDateString).toISOString()
        : null;

      this.props.form.setFieldsValue({
        checkDescription: checkDescription || undefined,
        status: status ? [parseInt(status)] : undefined,
        startDate: startDateInstant || undefined,
        endDate: endDateInstant || undefined,
        startDate: moment(startDate).toDate(),
        endDate: moment(endDate).toDate(),
      });

      this.list({
        checkDescription: checkDescription || undefined,
        status: status ? [parseInt(status)] : undefined,
        startDate: startDateInstant || undefined,
        endDate: endDateInstant || undefined,
        startDate: moment(startDate).toDate(),
        endDate: moment(endDate).toDate(),
      });
    } else {
      super.componentDidMount();
    }
  }

  timelineView(value) {
    this.setState({
      ...this.state,
      timelinePopup: {
        open: true,
        mode: "View",
        title: `Timeline`,
        id: value,
        disabled: true,
      },
    });
  }
  onTimelineClose = () => {
    this.setState((state) => ({
      ...state,
      timelinePopup: {
        open: false,
        id: null,
      },
    }));
  };
  title = "Resolution Work Order";

  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      align: "left",
      width: 50,
    },
    {
      dataIndex: "checkListExecutionNumber",
      key: "checkListExecutionNumber",
      title: "Exec No",
      align: "left",
      width: 80,
    },
    {
      dataIndex: "rwoNumber",
      key: "rwoNumber",
      title: "WO Number",
      align: "left",
      width: 100,
    },

    {
      title: "Date",
      key: "startDate",
      dataIndex: "startDate",
      width: 100,
      render: (value) => {
        return value ? moment(value).format("DD-MM-YYYY") : "-";
      },
    },
    {
      dataIndex: "asset",
      key: "asset",
      title: "Asset Name",
      width: 160,
      render: (value) => {
        return value?.assetName;
      },
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      render: (value) => {
        return (
          <Paragraph
            ellipsis={{ rows: 2, expandable: true }}
            style={{ width: "100%" }}
          >
            {value}
          </Paragraph>
        );
      },
      width: 200,
    },

    {
      dataIndex: "priority",
      key: "priority",
      title: "Priority",
      align: "left",
      width: 100,
    },

    {
      dataIndex: "assignedTo",
      key: "assignedTo",
      title: "Assigned To",
      width: 100,
      render: (assignedTo) => {
        const userName = assignedTo?.userName || "-";
        return <span>{userName}</span>;
      },
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: 100,
      render: (value) => {
        return this.service.status(value);
      },
    },
    {
      dataIndex: "resolutionWorkOrderId",
      key: "resolutionWorkOrderId",
      title: "Action",
      width: 160,
      align: "center",
      render: (value, record, index) => {
        return (
          <Space>
            {this.props.open ||
              (record.status !== 4 ? (
                <Link to={`update/${value}`}>
                  <Button type="primary">Open</Button>
                </Link>
              ) : (
                <Button type="primary" onClick={() => this.reOpen(value)}>
                  Reopen
                </Button>
              ))}
            <Button onClick={() => this.timelineView(value)}>
              <FieldTimeOutlined />
            </Button>
          </Space>
        );
      },
    },
  ];
  reOpen = (value) => {
    this.setState((state) => ({ ...state, isLoading: true }));
    this.service
      .reOpen({ resolutionWorkOrderId: value })
      .then((response) => {
        if (response.data.success) {
          // message.success(response.data.message);
          this.props.navigate(`update/${value}`);
        } else message.error(response.data.message);
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
      });
  };
  getData(assetIds) {
    this.assetService
      .retrieve(assetIds)
      .then((response) => {
        var self = this;
        if (response.data) {
          this.setState(
            (state) => ({
              ...state,
              isLoading: false,
              parameters: response.data.parameters,
              asset: response.data,
            }),
            () => {
              self.timeOut = setTimeout(() => {
                this._getData(assetIds);
              }, 500);
            }
          );
        }
      })
      .catch((err) => {
        clearTimeout(this.timeOut);
      });
  }
  componentWillUnmount() {
    clearTimeout(this.timeOut);
  }
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
  onSearchMaintenanceType = (value) => {
    const filteredMaintenanceTypeList = this.state.maintenanceType?.filter(
      (type) => type.label.toLowerCase().includes(value.toLowerCase())
    );

    this.setState({ filteredMaintenanceTypeList, typeSearchValue: value });
  };
  handleUserSearch = debounce((value) => {
    this.setState({ userSearchValue: value }, () => this.onSearchUser(value));
  }, 500);

  handleAssetSearch = debounce((value) => {
    this.setState({ assetSearchValue: value }, () => this.onSearchAsset(value));
  }, 500);
  handleTypeSearch = debounce((value) => {
    this.setState({ typeSearchValue: value }, () =>
      this.onSearchMaintenanceType(value)
    );
  }, 500);
  submitForm = (value) => {
    this.list(value);
  };
  showDrawer = () => {
    this.setState({ open: true });
  };

  onClose = () => {
    this.setState({ open: false, isDateTabsOpen: false });
  };
  handleDateTabsOpen = () => {
    this.setState({ isDateTabsOpen: !this.state.isDateTabsOpen });
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

  selectAllUsers = (e) => {
    const { userList } = this.state;
    const allUserValues = userList.map((user) => user.value);
    const checked = e.target.checked;

    this.props.form.setFieldsValue({
      userIds: checked ? allUserValues : [],
    });
  };

  updateIndeterminateState = () => {
    const { userList, selectedUserCount } = this.state;
    const isSelectAllIndeterminate =
      selectedUserCount > 0 && selectedUserCount < userList.length;
    this.setState({ isSelectAllIndeterminate });
  };

  handleApplyFilter = () => {
    const anyFieldSelected = Object.values(this.state.selectedFields).some(
      (selected) => selected
    );
    this.setState({ isAnyFieldSelected: anyFieldSelected });
    this.setState({ isFilterApplied: true });
    this.onClose();
    this.setState({ isSelectAllIndeterminate: false });
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
    const selectedMaintenanceTypeCount = this.props.form.getFieldValue(
      "maintenanceTypeId"
    )
      ? this.props.form.getFieldValue("maintenanceTypeId").length
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
    if (
      selectedMaintenanceTypeCount > 0 ||
      this.state.selectedFields.maintenanceTypeId.length > 0
    )
      selectedPanelCount++;

    this.setState({
      selectedUserCount,
      selectedAssetCount,
      selectedStatusCount,
      selectedPriorityCount,
      selectedMaintenanceTypeCount,
    });
  };

  handleResetFilter = () => {
    this.setState({
      selectedFields: {
        userIds: false,
        assetIds: false,
        status: false,
        maintenanceTypeId: false,
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
      selectedMaintenanceTypeCount: 0,
    });
  };
  reset = () => {
    this.list({ value: [] });
    this.props.form.resetFields();
    this.setState({
      filteredUserList: [],
      filteredAssetList: [],
      filteredMaintenanceTypeList: [],
      typeSearchValue: "",
      userSearchValue: "",
      assetSearchValue: "",
    });
  };

  setDatefield = (v) => {
    this.props?.form.setFieldsValue({
      startDate: new Date(v.startDate),
      endDate: new Date(v.endDate),
    });
    this.setState((state) => state);
  };
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
      selectedMaintenanceTypeCount,
      isSelectAllIndeterminate,
    } = this.state;
    const {
      filteredUserList,
      filteredAssetList,
      filteredMaintenanceTypeList,
      userSearchValue,
      assetSearchValue,
      typeSearchValue,
      userList,
      assetList,
      maintenanceType,
    } = this.state;
    const totalCount =
      selectedUserCount +
      selectedAssetCount +
      selectedStatusCount +
      selectedPanelCount +
      selectedPriorityCount +
      selectedMaintenanceTypeCount;
    const { isLoading } = this.props;
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

    return (
      <Spin spinning={isLoading}>
        <Page
          title={this.title}
          action={
            <React.Fragment>
              {this.props.access[0]?.includes("execute") && (
                <Link to={"new"}>
                  <Button
                    style={{ marginRight: "10px" }}
                    icon={<PlusOutlined />}
                    type="primary"
                  >
                    Create New{" "}
                  </Button>
                </Link>
              )}
            </React.Fragment>
          }
          filter={
            <Form
              layout="inline"
              form={this.props.form}
              onFinish={this.submitForm}
            >
              <Form.Item name="mode" hidden></Form.Item>
              <Form.Item name="startDate" hidden></Form.Item>
              <Form.Item name="endDate" hidden></Form.Item>
              <Form.Item name="ahId" style={{ minWidth: "250px" }}>
                <TreeSelect
                  onChange={(v) => this.getAssetList(v)}
                  showSearch
                  loading={this.state.isparentTreeListLoading}
                  placeholder="Entity"
                  allowClear
                  treeData={this.state.parentTreeList}
                ></TreeSelect>
              </Form.Item>

              <Form.Item name="UserName" hidden style={{ minWidth: "250px" }}>
                <Select
                  showSearch
                  loading={this.state.isCurrentListLoading}
                  placeholder="UserName"
                  allowClear
                  options={this.state.currentUserList}
                ></Select>
              </Form.Item>
              <Badge count={totalCount} color="hwb(205 6% 9%)">
                <Button
                  onClick={() => this.setState({ open: true })}
                  style={{
                    backgroundColor: isFilterApplied ? "#c9cccf " : "inherit",
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
                  layout="vertical"
                  form={this.props.form}
                  onFinish={this.submitForm}
                >
                  <CustomCollapsePanel title="User">
                    <Form.Item name="userIds" style={{ minWidth: "250px" }}>
                      <Select
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

                  <CustomCollapsePanel title="Priority">
                    <div className="scrollable-section medium-scrollbar">
                      <Form.Item name="priority" style={style.formItem}>
                        <Checkbox.Group style={{ width: "100%" }}>
                          <ul
                            style={{
                              listStyle: "none",
                              paddingLeft: "5px",
                              marginTop: "10px",
                            }}
                          >
                            <li>
                              <Checkbox value="HIGH">High</Checkbox>
                            </li>
                            <li>
                              <Checkbox value="MEDIUM">Medium</Checkbox>
                            </li>
                            <li>
                              <Checkbox value="LOW">Low</Checkbox>
                            </li>
                          </ul>
                        </Checkbox.Group>
                      </Form.Item>
                    </div>
                  </CustomCollapsePanel>

                  <CustomCollapsePanel title="Status">
                    <Form.Item
                      name="status"
                      style={style.formItem}
                      initialValue={status}
                    >
                      <Checkbox.Group>
                        <Space direction="vertical">
                          <Checkbox value={0}>Opened</Checkbox>
                          <Checkbox value={1}>Assigned</Checkbox>
                          <Checkbox value={2}>Resolved</Checkbox>
                          <Checkbox value={4}>Rejected</Checkbox>
                          <Checkbox value={5}>Completed</Checkbox>
                        </Space>
                      </Checkbox.Group>
                    </Form.Item>
                  </CustomCollapsePanel>

                  <CustomCollapsePanel title="Range">
                    <div>
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
          <Table
            scroll={{ x: 980 }}
            rowKey="resolutionWorkOrderId"
            loading={this.state.isLoading}
            dataSource={this.state.rows}
            columns={this.columns}
            size="middle"
            pagination={{
              showSizeChanger: true,
              size: "default",
            }}
          />
          {this.state.popup?.open && (
            <ResolutionWorkOrderVerify
              {...this.state.popup}
              close={this.onClose}
            />
          )}
          {this.state.timelinePopup?.open && (
            <TimelineList
              {...this.state.timelinePopup}
              close={this.onTimelineClose}
            />
          )}
        </Page>
      </Spin>
    );
  }
}

export default withForm(withRouter(withAuthorization(ResolutionWorkOrder)));
