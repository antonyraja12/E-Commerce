import {
  AppstoreOutlined,
  BarsOutlined,
  CheckCircleTwoTone,
  DownloadOutlined,
  ExclamationCircleOutlined,
  ExclamationCircleTwoTone,
  FilterFilled,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Checkbox,
  Col,
  Drawer,
  Form,
  Input,
  Modal,
  Row,
  Segmented,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
  TreeSelect,
  Typography,
  message,
} from "antd";
import { Option } from "antd/es/mentions";
import Paragraph from "antd/es/typography/Paragraph";
import { debounce } from "lodash";
import moment from "moment";
import { Link } from "react-router-dom";
import CustomCollapsePanel from "../../../helpers/collapse";
import DateTabs from "../../../helpers/data";
import { baseUrl, dateFormat } from "../../../helpers/url";
import AssetService from "../../../services/asset-service";
import ActiveUserService from "../../../services/current-user-service ";
import CheckListExecutionAssigService from "../../../services/quality-inspection/checklist-execution-assign-service";
import CheckListExecutionService from "../../../services/quality-inspection/checklist-execution-service";
import ReasonService from "../../../services/quality-inspection/reasos-update -service";
import UploadDownloadService from "../../../services/upload-download-service";
import UserService from "../../../services/user-service";
import Page from "../../../utils/page/page";
import { withAuthorization } from "../../../utils/with-authorization";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";
import FilterFunctions from "../../remote-monitoring/common/filter-functions";

const style = {
  formItem: {
    minWidth: "120px",
  },
};
const { Text } = Typography;

class CheckListExecution extends FilterFunctions {
  assetservice = new AssetService();
  service = new CheckListExecutionService();
  userservice = new UserService();
  downloadservice = new UploadDownloadService();
  reasonservice = new ReasonService();
  assgnservice = new CheckListExecutionAssigService();
  activeUser = new ActiveUserService();
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      isModalVisible: false,
      userList: [],
      assetList: [],
      filteredUserList: [],
      filteredAssetList: [],
      userSearchValue: "",
      assetSearchValue: "",
      selectedUserCount: 0,
      selectedAssetCount: 0,
      selectedStatusCount: 0,
      selectedPanelCount: 0,
      selectedPriorityCount: 0,
      assignedUserName: "",
      selectedFields: {
        userIds: [],
        assetIds: [],
        status: [],
        priority: [],
      },
      isDateTabsOpen: false,
      showModal: false,
      isFilterApplied: false,
      reason: "",
      checkListExecutionId: "",
      DisplayType: "List",
    };
  }
  currentDate = moment();
  startDate = this.currentDate.startOf("day");
  startDateString = moment(
    this.startDate.format("ddd MMM DD YYYY HH:mm:ss [GMT+0530]")
  ).toISOString();
  endDate = this.currentDate.endOf("day");
  endDateString = moment(
    this.endDate.format("ddd MMM DD YYYY HH:mm:ss [GMT+0530]")
  ).toISOString();

  componentDidMount() {
    this.getUserList();
    this.getAppHierarchyList();
    this.getAssetList();
    this.getCurrentUserList();

    if (!localStorage.getItem("displayType")) {
      this.setState((state) => ({ ...state, DisplayType: "List" }));
      localStorage.setItem("displayType", "List");
    } else {
      this.setState((state) => ({
        ...state,
        DisplayType: localStorage.getItem("displayType"),
      }));
    }
    Promise.all([this.userservice.list()]).then((response) => {
      this.setState((state) => ({ ...state, UserService: response[0].data }));
    });

    if (this.props.searchParams.get("status")) {
      const startDateString = this.props.searchParams.get("startDate");
      const endDateString = this.props.searchParams.get("endDate");
      const startDateInstant = moment(startDateString).toISOString();
      const endDateInstant = moment(endDateString).toISOString();

      this.props?.form.setFieldsValue({
        status: this.props.searchParams.get("status"),
        startDate: startDateInstant,
        endDate: endDateInstant,
      });

      this.list({
        status: [this.props.searchParams.get("status")],
        startDate: startDateInstant,
        endDate: endDateInstant,
      });
    } else {
      this.list();
    }
    this.activeUser.list().then((response) =>
      this.setState((state) => ({
        ...state,
        activeUser: response.data,
      }))
    );
  }

  hasFifteenMinutesPassed = (startTime) => {
    const currentTime = moment();
    const fifteenMinutesAgo = moment(startTime).add(15, "minutes");
    return currentTime.isAfter(fifteenMinutesAgo);
  };

  showModal = (checkListExecutionId) => {
    this.setState({
      isModalOpen: true,
      checkListExecutionId: checkListExecutionId,
    });
  };

  handleOk = () => {
    this.setState({ isModalOpen: false });
    this.props.form.resetFields();
  };
  handleFinish = () => {
    const { form } = this.props;
    const data = form.getFieldsValue();
    const id = this.state.checkListExecutionId;
    this.assgnservice
      .groupAssign(id, data.userId)
      .then((response) => {
        if (response.data.success) {
          message.success(response.data.message);
          this.handleCancel();
        }
      })
      .catch((error) => {
        console.error(error);
        message.error("check the User");
      });
  };

  handleCancel = () => {
    this.list({
      startDate: this.startDateString,
      endDate: this.endDateString,
    });
    this.setState({ isModalOpen: false, isModalVisible: false });
    this.props.form.resetFields();
  };
  handleSubmitReasons = () => {
    const { reason, checkListExecutionId } = this.state;

    if (reason) {
      this.service
        .update({}, checkListExecutionId + "/reason-update?reason=" + reason)
        .then((response) => {
          if (response.data.success) {
            message.success(response.data.message);
            this.handleCancel();
          }
        })
        .catch((error) => {
          console.error(error);
          message.error(
            "An error occurred while submitting reasons. Please try again later."
          );
        });
    } else {
      message.error("Please fill in the reason field.");
    }
  };

  handleReasonInputChange = (e) => {
    this.setState({ reason: e.target.value });
  };

  title = "Checklist Execution";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 20,
      align: "left",
    },
    {
      dataIndex: "checkListExecutionNumber",
      key: "checkListExecutionNumber",
      title: "Exec No",
      align: "left",
      width: 100,
      sorter: (a, b) =>
        a.checkListExecutionNumber.localeCompare(b.checkListExecutionNumber),
    },

    {
      dataIndex: "startDate",
      title: "Start Date",
      key: "startDate",
      width: 100,
      render: (value) => dateFormat(value),
      sorter: (a, b) => a.startDate.localeCompare(b.startDate),
    },
    {
      title: "Time",
      dataIndex: "scheduler",
      key: "scheduler",
      render: (record) => {
        return record.startTime
          ? moment(record.startTime).format("HH:mm ")
          : "-";
      },
      width: 60,
    },

    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      width: 200,
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
    },

    {
      dataIndex: "asset",
      key: "asset",
      title: "Asset",
      render: (value) => {
        return value.assetName;
      },
      width: 100,
    },

    {
      dataIndex: "scheduler",
      key: "scheduler",
      title: "Assigned To",
      render: (value, record) => {
        const assignUserName = record.user?.userName;
        const execNo = record.checkListExecutionNumber;
        const id = record?.checkListExecutionId;
        const userName = value?.user?.userName;
        const userGroup = value?.userGroupLists?.userGroupName;

        return (
          <span>
            {userName ? (
              assignUserName || userName || userGroup
            ) : (
              <Button
                className="button-style"
                onClick={() => id && this.getExcutionData(id, execNo)}
              >
                {assignUserName || userName || userGroup}
              </Button>
            )}
          </span>
        );
      },
      width: 100,
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: 60,
    },
    {
      dataIndex: "checkListExecutionId",
      key: "checkListExecutionId",
      title: "Action",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            {this.props.open || (
              <Link to={`update/${value}`}>
                <Button
                  type="primary"
                  disabled={
                    this.state.activeUser?.userName != "Administrator" &&
                    this.state.activeUser?.userName !=
                      record.scheduler.user?.userName
                  }
                >
                  Open
                </Button>
              </Link>
            )}
          </>
        );
      },
    },
    {
      dataIndex: "reasons",
      key: "reasons",
      title: "Remark",
      width: 100,
      align: "center",
      render: (value, record) => {
        if (record.status === "Closed") {
          return "-";
        } else {
          const fifteenMinutesPassed = this.hasFifteenMinutesPassed(
            record.scheduler.startTime
          );
          if (fifteenMinutesPassed) {
            return (
              <Button
                disabled={
                  record.reason
                    ? true
                    : false ||
                      (this.state.activeUser?.userName != "Administrator" &&
                        this.state.activeUser?.userName !=
                          record.scheduler.user?.userName)
                }
                type="primary"
                icon={<ExclamationCircleOutlined />}
                onClick={() => this.showModal(record.checkListExecutionId)}
              ></Button>
            );
          } else {
            return "-";
          }
        }
      },
    },
  ];

  setDatefield = (v) => {
    this.props?.form.setFieldsValue({
      startDate: new Date(v.startDate),
      endDate: new Date(v.endDate),
    });
    this.setState((state) => state);
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
  handleDownload = () => {
    let url;

    const startDateFieldValue = this.props.form.getFieldValue("startDate");
    const endDateFieldValue = this.props.form.getFieldValue("endDate");
    const assetIdFieldValue = this.props.form.getFieldValue("assetIds");
    const statusFieldValue = this.props.form.getFieldValue("status");
    const userIdsFieldValue = this.props.form.getFieldValue("userIds");

    const startDateValue = startDateFieldValue
      ? moment(startDateFieldValue).toISOString()
      : undefined;
    const endDateValue = endDateFieldValue
      ? moment(endDateFieldValue).toISOString()
      : undefined;
    const assetIdValue =
      assetIdFieldValue !== undefined ? assetIdFieldValue : "";
    const statusValue = statusFieldValue !== undefined ? statusFieldValue : "";
    const userIdsValue =
      userIdsFieldValue !== undefined ? userIdsFieldValue : "";

    url = `${baseUrl}/ergoDetails/pdf?assetIds=${assetIdValue}&status=${statusValue}&userId=${userIdsValue}${
      startDateValue ? `&startDate=${startDateValue}` : ""
    }${endDateValue ? `&endDate=${endDateValue}` : ""}`;
    this.downloadservice.download(url).then((response) => {
      const urlBlob = window.URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = "Report.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };
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

  handleApplyFilter = () => {
    const anyFieldSelected = Object.values(this.state.selectedFields).some(
      (selected) => selected
    );
    this.setState({ isAnyFieldSelected: anyFieldSelected });
    this.setState({ isFilterApplied: true });
    this.onClose();
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
    this.onClose();
    this.props.form.resetFields();
    this.setState({
      selectedUserCount: 0,
      selectedAssetCount: 0,
      selectedStatusCount: 0,
      selectedPanelCount: 0,
      selectedPriorityCount: 0,
    });
  };
  reset = () => {
    this.list({
      startDate: this.startDateString,
      endDate: this.endDateString,
    });
    this.props.form.resetFields();
    this.setState({
      filteredUserList: [],
      filteredAssetList: [],
      userSearchValue: "",
      assetSearchValue: "",
    });
  };
  getExcutionData = (id, no) => {
    this.service.retrieve(id).then((response) => {
      this.setState((state) => ({
        ...state,
        executionData: response.data.scheduler?.userGroupLists?.userMappings,
        isModalVisible: true,
        checkListExecutionId: id,
      }));
      this.props.form.setFieldsValue({ execNo: no });
    });
  };

  render() {
    let prevStartTime = null;
    let newRowStatus = false;
    const {
      filteredUserList,
      filteredAssetList,
      userSearchValue,
      assetSearchValue,
      userList,
      assetList,
    } = this.state;
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
    const totalCount =
      selectedUserCount +
      selectedAssetCount +
      selectedStatusCount +
      selectedPanelCount +
      selectedPriorityCount;
    if (this.state?.rows) {
      var emptyReasonCount = this.state.rows.reduce((count, item) => {
        if (
          !item.reason &&
          (item.status == "InProgress" || item.status == "Scheduled")
        ) {
          count += 1;
        }
        return count;
      }, 0);
    } else {
    }

    const { isLoading } = this.props;
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

    return (
      <Spin spinning={isLoading}>
        <Page
          title={this.title}
          filter={
            <Form
              layout="inline"
              form={this.props.form}
              onFinish={this.submitForm}
            >
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
                  treeNodeFilterProp="title"
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
              <Space>
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

                    <CustomCollapsePanel title="Status">
                      <Form.Item name="status" style={style.formItem}>
                        <Checkbox.Group>
                          <Space direction="vertical">
                            <Checkbox value="Scheduled">Scheduled</Checkbox>
                            <Checkbox value="InProgress">In-Progress</Checkbox>
                            <Checkbox value="Closed">Closed</Checkbox>
                          </Space>
                        </Checkbox.Group>
                      </Form.Item>
                    </CustomCollapsePanel>
                    <CustomCollapsePanel title="Range">
                      <Form.Item>
                        <DateTabs
                          open={this.state.isDateTabsOpen}
                          setOpen={this.handleDateTabsOpen}
                          change={(data) => this.setDatefield(data)}
                        />
                      </Form.Item>
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
                <Form.Item>
                  <Button hidden type="primary" onClick={this.handleDownload}>
                    <DownloadOutlined />
                  </Button>
                </Form.Item>
              </Space>
            </Form>
          }
          action={
            <>
              <Tooltip placement="bottom" title="Empty Reason Counts">
                <Button>{emptyReasonCount}</Button>
              </Tooltip>
              <Segmented
                value={this.state.DisplayType}
                onChange={(val) => {
                  this.setState((state) => ({
                    ...state,
                    DisplayType: val,
                  }));
                  localStorage.setItem("displayType", val);
                }}
                options={[
                  {
                    label: "List",
                    value: "List",
                    icon: <BarsOutlined />,
                  },
                  {
                    label: "Grid",
                    value: "Grid",
                    icon: <AppstoreOutlined />,
                  },
                ]}
              />
            </>
          }
        >
          {this.state.DisplayType == "List" ? (
            <Table
              rowKey="checkListExecutionId"
              scroll={{ x: 980 }}
              loading={this.state.isLoading}
              dataSource={this.state.rows}
              columns={this.columns}
              size="middle"
              pagination={{
                showSizeChanger: true,
                size: "default",
              }}
            />
          ) : (
            <Row gutter={[8, 12]}>
              {this.state?.rows &&
                this.state?.rows.map((item) => {
                  const fifteenMinutesPassed = this.hasFifteenMinutesPassed(
                    item.scheduler.startTime
                  );
                  const curStartTime = moment(item.scheduler.startTime).format(
                    "DD-MM-YYYY"
                  );
                  const content = (
                    <Row>
                      <Col span={9}>
                        <h3>Exec No</h3>
                      </Col>
                      <Col span={15}>
                        <h3> : {item.checkListExecutionNumber}</h3>
                      </Col>
                      <Col span={9}>
                        <h4>Description</h4>
                      </Col>
                      <Col span={15}>
                        <h4> : {item.description}</h4>
                      </Col>
                      <Col span={9}>
                        <h4>Asset</h4>
                      </Col>
                      <Col span={15}>
                        <h4> : {item.asset.assetName}</h4>
                      </Col>
                      <Col span={9}>
                        <h4>Assigned To</h4>
                      </Col>
                      <Col span={15}>
                        <h4> : {item.scheduler.user?.userName}</h4>
                      </Col>
                      <Col span={9}>
                        <h4>Status</h4>
                      </Col>
                      <Col span={15}>
                        <h4> : {item.status}</h4>
                      </Col>
                    </Row>
                  );

                  if (
                    prevStartTime === null ||
                    prevStartTime !== curStartTime
                  ) {
                    prevStartTime = curStartTime;
                    newRowStatus = true;
                  } else {
                    newRowStatus = false;
                  }
                  return (
                    <>
                      {newRowStatus && (
                        <Col span={24}>
                          <h3>{curStartTime}</h3>
                        </Col>
                      )}
                      <Col span={3} key={item.checkListExecutionId}>
                        {fifteenMinutesPassed ? (
                          item.status === "Closed" ? (
                            <Tooltip placement="leftTop" title={content}>
                              <Link to={`update/${item.checkListExecutionId}`}>
                                <Button
                                  type="primary"
                                  style={{
                                    width: "8vw",
                                    borderColor: "green",
                                    backgroundColor: "green",
                                    color: "#fff",
                                  }}
                                  size="large"
                                >
                                  {item.scheduler.startTime
                                    ? moment(item.scheduler.startTime).format(
                                        "HH:mm"
                                      )
                                    : "-"}
                                </Button>
                              </Link>
                            </Tooltip>
                          ) : item.reason ? (
                            <Badge
                              count={
                                <CheckCircleTwoTone twoToneColor="#52c41a" />
                              }
                            >
                              <Tooltip placement="leftTop" title={content}>
                                <Link
                                  to={`update/${item.checkListExecutionId}`}
                                >
                                  <Button
                                    type="primary"
                                    ghost
                                    style={{
                                      width: "8vw",
                                      backgroundColor: "grey",
                                      borderColor: "grey",
                                      color: "#fff",
                                    }}
                                    size="large"
                                  >
                                    {item.scheduler.startTime
                                      ? moment(item.scheduler.startTime).format(
                                          "HH:mm"
                                        )
                                      : "-"}
                                  </Button>
                                </Link>
                              </Tooltip>
                            </Badge>
                          ) : (
                            <Badge
                              count={
                                <ExclamationCircleTwoTone twoToneColor="#ff0000" />
                              }
                              onClick={() =>
                                this.showModal(item.checkListExecutionId)
                              }
                            >
                              <Tooltip placement="leftTop" title={content}>
                                <Link
                                  to={`update/${item.checkListExecutionId}`}
                                >
                                  <Button
                                    type="primary"
                                    ghost
                                    style={{
                                      width: "8vw",
                                      backgroundColor: "grey",
                                      borderColor: "grey",
                                      color: "#fff",
                                    }}
                                    size="large"
                                  >
                                    {item.scheduler.startTime
                                      ? moment(item.scheduler.startTime).format(
                                          "HH:mm"
                                        )
                                      : "-"}
                                  </Button>
                                </Link>
                              </Tooltip>
                            </Badge>
                          )
                        ) : (
                          <Tooltip placement="leftTop" title={content}>
                            <Link to={`update/${item.checkListExecutionId}`}>
                              <Button
                                type="primary"
                                style={{ width: "8vw" }}
                                size="large"
                              >
                                {item.scheduler.startTime
                                  ? moment(item.scheduler.startTime).format(
                                      "HH:mm"
                                    )
                                  : "-"}
                              </Button>
                            </Link>
                          </Tooltip>
                        )}
                      </Col>
                    </>
                  );
                })}
            </Row>
          )}
          <Modal
            title="Remark"
            visible={this.state.isModalOpen}
            onOk={this.handleSubmitReasons}
            onCancel={this.handleCancel}
            footer={[
              <Button key="cancel" onClick={this.handleCancel}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={this.handleSubmitReasons}
              >
                Submit
              </Button>,
            ]}
          >
            <Form form={this.props.form}>
              <Form.Item name="comments">
                <Input.TextArea
                  style={{ width: "100%", height: "120px", fontSize: "14px" }}
                  placeholder="Enter the remark for not executing the checklist on time."
                  onChange={this.handleReasonInputChange}
                />
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title="Assign To"
            visible={this.state.isModalVisible}
            onOk={this.handleFinish}
            confirmLoading={this.state.confirmLoading}
            onCancel={this.handleCancel}
          >
            <Form
              size="small"
              form={this.props.form}
              colon={false}
              labelAlign="left"
              layout="horizontal"
              className="form-horizontal"
              labelCol={{ sm: 8, xs: 24 }}
              wrapperCol={{ sm: 16, xs: 24 }}
              loading={this.state.isLoading}
            >
              <Form.Item name="execNo" label=" Exec No">
                <Input disabled />
              </Form.Item>
              <Form.Item name="userId" label="Assign To">
                <Select placeholder="Select User">
                  <Option key="userId" value={this.state.activeUser?.userId}>
                    Assign To Me
                  </Option>
                  {this.state.executionData?.map((e) => (
                    <>
                      <Option key={e.userId} value={e.userId}>
                        {e.userLists.userName}
                      </Option>
                    </>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(withForm(CheckListExecution)));
