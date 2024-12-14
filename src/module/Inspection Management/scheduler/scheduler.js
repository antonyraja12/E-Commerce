import {
  CalendarOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FilterFilled,
  LeftOutlined,
  RightOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Form,
  Modal,
  Popover,
  Progress,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Tooltip,
  TreeSelect,
  Typography,
  message,
} from "antd";
import { debounce } from "lodash";
import moment from "moment";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { MdGroups, MdPerson } from "react-icons/md";
import { Link, createSearchParams } from "react-router-dom";
import TagsCell from "../../../component/TagCell";
import CustomCollapsePanel from "../../../helpers/collapse";
import CheckListExecutionService from "../../../services/checklistexecution-service";
import CheckListService from "../../../services/inspection-management-services/checklist-service";
import SchedulerService from "../../../services/inspection-management-services/scheduler-service";
import UserGroupService from "../../../services/user-group-service";
import CurrentUserService from "../../../services/user-list-current-user-service";
import Page from "../../../utils/page/page";
import { withAuthorization } from "../../../utils/with-authorization";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";
import FilterFunctions from "../../remote-monitoring/common/filter-functions";
import "./scheduler.css";
const localizer = momentLocalizer(moment);
const style = {
  formItem: {
    minWidth: "120px",
  },
};
const { Text, Title } = Typography;
const cardActionsStyle = {
  display: "flex",
  justifyContent: "space-between",
};
const { Option } = Select;
const actionButtonStyle = {
  marginLeft: "auto",
};

const color = [
  { backgroundColor: "#e91e637a", color: "#81002c" },
  { backgroundColor: "#03a9f494", color: "#07405a" },
  { backgroundColor: "#bc59cc78", color: "#530561" },
  { backgroundColor: "#8bc34ad6", color: "#2e5402" },
  { backgroundColor: "#ff9800b0", color: "#6c4101" },
  { backgroundColor: "#f44336bd", color: "#770b03" },
];

class Scheduler extends FilterFunctions {
  service = new SchedulerService();
  currentuserService = new CurrentUserService();
  userGroupService = new UserGroupService();
  checkListIdService = new CheckListService();
  newCheckListExecutionService = new CheckListExecutionService();

  eventsRef = React.createRef([]);

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      modalOpen: false,
      selectedEvent: null,
      schedulerId: null,
      edit: false,
      delete: false,
      popoverOpen: true,
      disabled: false,
      mainModalOpen: false,
      schedulerUpdate: "Series",
      userList: [],
      assetList: [],
      userGroupList: [],
      filteredUserList: [],
      filteredAssetList: [],
      filteredUserGroupList: [],
      userSearchValue: "",
      assetSearchValue: "",
      userGroupSearchValue: "",
      open: false,

      showModal: false,
      isFilterApplied: false,
      selectedUserCount: 0,
      selectedAssetCount: 0,
      selectedUserGroupCount: 0,
      selectedStatusCount: 0,
      selectedPanelCount: 0,
      selectedPriorityCount: 0,
      selectedFields: {
        userIds: [],
        assetIds: [],
        status: [],
        priority: [],
      },
    };
  }

  componentDidMount() {
    this.getAppHierarchyList();
    this.getAssetList();
    this.getUserList();
    this.getUserGroupList();
    this.getCurrentUserList();
    super.componentDidMount();
    this.getCurrentUser();
  }

  editScheduler = () => {
    this.props.navigate({
      pathname: `./update/${this.state.schedulerId}`,
    });
  };

  deleteScheduler = (schedulerId, schedulerUpdate, scheduleDate) => {
    this.service
      .deleteScheduler(schedulerId, schedulerUpdate, scheduleDate)
      .then((response) => {
        if (response?.data.success) {
          message.success(response?.data.message);
          this.list();
        }
      });
  };

  popupOpen = () => {
    this.setState((state) => ({ ...state, modalOpen: true }));
  };

  closeModal = () => {
    this.setState((state) => ({ ...state, modalOpen: false }));
  };

  closeMainModal = () => {
    this.setState((state) => ({ ...state, mainModalOpen: false }));
  };
  onSearchUser = (value) => {
    const filteredUserList = this.state.userList.filter((user) =>
      user.label.toLowerCase().includes(value.toLowerCase())
    );

    this.setState({ filteredUserList, userSearchValue: value });
  };

  onSearchUserGroup = (value) => {
    const filteredUserGroupList = this.state.userGroupList.filter((userGroup) =>
      userGroup.label.toLowerCase().includes(value.toLowerCase())
    );

    this.setState({ filteredUserGroupList, userGroupSearchValue: value });
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
  handleUserGroupSearch = debounce((value) => {
    this.setState({ userGroupSearchValue: value }, () =>
      this.onSearchUserGroup(value)
    );
  }, 500);

  onOk = () => {
    this.setState({ mainModalOpen: true });
    this.closeModal();
  };

  mianModelOk = () => {
    this.deleteScheduler(
      this.state.schedulerId,
      this.state.schedulerUpdate,
      this.state.scheduleDate
    );
    this.closeMainModal();
  };

  handlePopover = () => {
    this.setState({ popoverOpen: false });
  };

  setSchedulerUpdate = (e) => {
    this.setState({ schedulerUpdate: e.target.value });
  };
  onSelect = (scheduleDate) => {
    this.props.navigate({
      pathname: "./add",
      search: `?${createSearchParams({
        date: scheduleDate,
      })}`,
    });
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
    });
  };

  handleResetFilter = () => {
    this.onClose();
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
    this.setState({
      selectedUserCount: 0,
      selectedAssetCount: 0,
      selectedStatusCount: 0,
      selectedPanelCount: 0,
      selectedPriorityCount: 0,
    });
  };

  reset = () => {
    this.list({ value: [] });
    this.props.form.resetFields();
    this.setState({
      filteredUserList: [],
      filteredAssetList: [],
      userSearchValue: "",
      assetSearchValue: "",
    });
  };

  submitForm = (value) => {
    this.list(value);
  };

  showDrawer = () => {
    this.setState({ open: true });
  };

  onClose = () => {
    this.setState({ open: false });
  };

  EventComponent = ({ event }) => {
    const { Paragraph } = Typography;
    const content = (
      <Card
        title={event.scheduledNumber}
        bordered={false}
        size="small"
        extra={
          <Button
            type="text"
            onClick={this.handlePopover}
            icon={<CloseOutlined />}
          />
        }
      >
        <table cellPadding={3} width="100%">
          <tr>
            <td width="40%">
              <Text>Scheduled Date </Text>
            </td>
            <td>:</td>
            <td>
              <Text strong>{moment(event.start).format("DD-MM-YYYY")}</Text>
            </td>
          </tr>
          <tr>
            <td>
              <Text>Assigned To</Text>
            </td>
            <td>:</td>
            <td>
              <Text strong>{event.assignedTo}</Text>{" "}
              {event.assignType === "user" && (
                <MdPerson
                  fontSize="small"
                  style={{ verticalAlign: "text-top", marginRight: "4px" }}
                />
              )}
              {event.assignType === "group" && (
                <MdGroups
                  fontSize="small"
                  style={{ verticalAlign: "text-top", marginRight: "4px" }}
                />
              )}
            </td>
          </tr>
          <tr>
            <td>
              <Text>Asset</Text>
            </td>
            <td>:</td>
            <td>
              <Text strong>{event.assetName}</Text>
            </td>
          </tr>
          <tr>
            <td>
              <Text>Checklist</Text>
            </td>
            <td>:</td>
            <td>
              <TagsCell
                tags={event.checklist}
                keyName="checkList.checkListName"
                valueName="checkList.checkListName"
              />
            </td>
          </tr>
          <tr valign="top">
            <td>Description</td>
            <td>:</td>
            <td>
              <div>
                <Paragraph ellipsis={{ rows: 2, expandable: true }}>
                  {event.title}
                </Paragraph>
              </div>
            </td>
          </tr>
          <tr valign="top">
            <td>Status</td>
            <td>:</td>
            <td>
              {event.statusDisplay}
              <Space></Space>
            </td>
          </tr>
        </table>
        <Divider style={{ margin: "5px 0 " }} />
        <Space style={{ float: "right" }}>
          {event.executionId && (
            <Link to={`/im/checklist-execution/update/${event.executionId}`}>
              <Button
                type="primary"
                disabled={
                  this.state.disabled ||
                  event.status === "Closed" ||
                  (this.state.currentUser.userName != "Administrator" &&
                    this.state.currentUser.userName != event.assignedTo)
                }
              >
                Execute
              </Button>
            </Link>
          )}
          {this.props.access[0]?.includes("edit") && (
            <Button
              type="primary"
              disabled={this.state.disabled || event.status === "Closed"}
              icon={<EditOutlined />}
              onClick={this.editScheduler}
            >
              Edit
            </Button>
          )}
          {this.props.access[0]?.includes("delete") && (
            <Button
              type="primary"
              disabled={this.state.disabled || event.status === "Closed"}
              danger
              icon={<DeleteOutlined />}
              onClick={this.popupOpen}
            >
              Delete
            </Button>
          )}
        </Space>
        <Modal
          width={320}
          title="Select Frequency"
          centered
          open={this.state.modalOpen}
          onOk={this.onOk}
          zIndex={1200}
          onCancel={this.closeModal}
        >
          <Radio.Group
            onChange={this.setSchedulerUpdate}
            defaultValue={"Series"}
          >
            <Radio value="Series">Series</Radio>
            <Radio value="Occurrence">Occurrence</Radio>
          </Radio.Group>
        </Modal>
        <Modal
          title="Delete Scheduler"
          open={this.state.mainModalOpen}
          onOk={this.mianModelOk}
          zIndex={1200}
          onCancel={this.closeMainModal}
        >
          <p>Are You Sure You want to delete this entry ?</p>
        </Modal>
      </Card>
    );
    if (this.state.schedulerId === event.id) {
      return (
        <Popover
          overlayInnerStyle={{ padding: "0" }}
          overlayStyle={{ maxWidth: "30%" }}
          open={this.state.popoverOpen}
          content={content}
          trigger="click"
          destroyTooltipOnHide
        >
          <div
            style={{
              height: "35px",
              borderLeft: "2px solid",
              paddingLeft: "5px",
            }}
          >
            <h3 style={{ marginBottom: "1px" }}>{event.assignedTo}</h3>
            <p style={{ marginBottom: "0px" }}>{event.title}</p>
          </div>
        </Popover>
      );
    }
    return (
      <div
        style={{
          height: "35px",
          borderLeft: "2px solid",
          paddingLeft: "5px",
        }}
      >
        <h3 style={{ marginBottom: "1px" }}>
          {event.assignedTo}{" "}
          {event.assignType === "group" && (
            <MdGroups
              fontSize="small"
              style={{ verticalAlign: "text-top", marginRight: "4px" }}
            />
          )}
        </h3>
        <p style={{ marginBottom: "0px" }}>{event.title}</p>
      </div>
    );
  };

  handleData(data) {
    let uniqueId = new Set(data.map((e) => e.masterId));
    let uniqIdColor = {};
    Array.from(uniqueId).forEach((e, i) => {
      let index = i;
      let n = color.length;
      if (i >= n) {
        index = i % n;
      }
      uniqIdColor[e] = color[index];
    });

    data.sort(
      (a, b) => moment(a.startTime).valueOf() - moment(b.startTime).valueOf()
    );

    return data?.map((e) => {
      const start = moment(e.scheduleDate);
      const end = moment(e.endDate);

      let checkStatusCount = {
        yesCount: 0,
        noCount: 0,
        naCount: 0,
        totCount: 0,
        nullCount: 0,
      };

      let countBarColor = [];

      e.checkListExecution?.checks.map((check) => {
        const status = check.status;

        if (status === "YES") {
          checkStatusCount.yesCount++;
          countBarColor.push("#A69A5B");
        } else if (status === "NO") {
          checkStatusCount.noCount++;
        } else if (status === null) {
          checkStatusCount.nullCount++;
        } else if (status === "NA") {
          checkStatusCount.naCount++;
        }
        checkStatusCount.totCount++;
      });

      let scheduleStatus = e.checkListExecution?.status;
      let backgroundColor, color;
      if (scheduleStatus) {
        switch (scheduleStatus.toLowerCase()) {
          case "scheduled":
            backgroundColor = "#26a0fc";
            color = "black";
            break;
          case "inprogress":
            backgroundColor = "#26e7a6";
            color = "black";
            break;
          case "closed":
            backgroundColor = "#febc3b";
            color = "black";
            break;
          default:
            backgroundColor = "#FF666D";
            color = "#ffffff";
            break;
        }
      }

      let statusPercent = (
        ((checkStatusCount.yesCount + checkStatusCount.noCount) /
          checkStatusCount.totCount) *
        100
      ).toFixed();

      let today = moment();

      let isScheduledForToday = moment(e.scheduleDate).isSameOrBefore(
        moment(),
        "day"
      );

      let statusDisplay = isScheduledForToday ? (
        <>
          <div>
            {<Progress percent={statusPercent} strokeColor={countBarColor} />}
          </div>
          <div>
            {checkStatusCount.yesCount +
              checkStatusCount.noCount +
              checkStatusCount.naCount}
            /{checkStatusCount.totCount} Completed
          </div>
        </>
      ) : (
        <p>Scheduled</p>
      );
      let assignName;
      let assignType;
      if (e.userGroupId) {
        assignName = e.userGroupLists?.userGroupName;
        assignType = "group";
      } else {
        assignName = e.user?.userName;
        assignType = "user";
      }

      let obj = {
        id: e.schedulerId,
        executionId: e.checkListExecutionId,
        title: e.description,
        checklist: e.schedulerCheckListMappings,
        checks: e.checkListExecution?.checks,
        assetName: e.assets?.assetName,
        start: start.toDate(),
        end: end.toDate(),
        status: e.checkListExecution?.status,
        backgroundColor: backgroundColor,
        color: color,
        assignedTo: assignName,
        scheduledNumber: e.scheduledNumber,
        assignType: assignType,
        barColor: countBarColor,
        totalStatusCount: checkStatusCount.totCount,
        yesStatusCount: checkStatusCount.yesCount,
        noStatusCount: checkStatusCount.noCount,
        naStatusCount: checkStatusCount.naCount,
        nullStatusCount: checkStatusCount.nullCount,
        statusPercentage: statusPercent,
        isScheduledForToday: isScheduledForToday,
        statusDisplay: statusDisplay,
      };

      if (moment(e.scheduleDate).isBefore(moment().add(-1, "d"))) {
        obj.backgroundColor = "#dddddd";
        obj.color = "#333333";
      }
      if (moment(e.scheduleDate).isAfter(moment().add(+1, "f"))) {
        obj.backgroundColor = "#26a0fc";
        obj.color = "black";
      }
      return obj;
    });
  }

  handleSelectSlot = ({ start }) => {
    const currentDate = new Date();
    const eventDate = new Date(start);
    currentDate.setDate(currentDate.getDate() - 1);
    if (eventDate >= currentDate) {
      {
        this.props.access[0]?.includes("add") &&
          this.props.navigate({
            pathname: "./add",
            search: `?${createSearchParams({
              date: moment(start).unix(),
            })}`,
          });
      }
    }
  };
  handleNavigate = (action) => {
    const { date } = this.state;
    let newDate = date;
    switch (action) {
      case "TODAY":
        newDate = new Date();
        break;
      case "PREV":
        newDate = moment(date).subtract(1, "months").toDate();
        break;
      case "NEXT":
        newDate = moment(date).add(1, "months").toDate();
        break;
      default:
        break;
    }
    this.setState({ date: newDate });
  };

  handleView = (view) => {
    this.setState({ view });
  };

  handleSelectEvent = ({ start, end, id }, editData) => {
    const currentDate = new Date();
    const eventDate = new Date(end);
    this.setState({ scheduleDate: start.toISOString() });
    if (eventDate <= currentDate) {
      this.setState({ disabled: true });
    } else {
      this.setState({ disabled: false });
    }

    if (this.state.popoverOpen == false) {
      this.setState({ popoverOpen: true });
    }
    this.setState({ schedulerId: id });
  };

  render() {
    const Toolbar = ({ label, onNavigate, onView, view, views, date }) => (
      <Row justify="space-between" style={{ marginBottom: "10px" }} align="">
        <Col>
          <Space>
            <Button
              type="text"
              icon={<CalendarOutlined />}
              onClick={() => onNavigate("TODAY")}
            >
              Today
            </Button>
            <Button
              type="text"
              icon={<LeftOutlined />}
              shape="circle"
              onClick={() => onNavigate("PREV")}
            />
            <Button
              type="text"
              icon={<RightOutlined />}
              shape="circle"
              onClick={() => onNavigate("NEXT")}
            />
            <Typography.Text strong>{label}</Typography.Text>
          </Space>
        </Col>
        <Col>
          <Radio.Group
            buttonStyle="solid"
            value={view}
            onChange={(e) => onView(e.target.value)}
            optionType="button"
            options={views?.map((e) => ({
              label: e?.charAt(0).toUpperCase() + e?.slice(1).toLowerCase(),
              value: e,
            }))}
          />
        </Col>
      </Row>
    );
    const {
      open,
      status,
      selectedFields,
      isAnyFieldSelected,
      isFilterApplied,
      selectedUserCount,
      selectedAssetCount,
      selectedUserGroupCount,
      selectedStatusCount,
      selectedPanelCount,
      selectedPriorityCount,
    } = this.state;
    const {
      filteredUserList,
      filteredAssetList,
      filteredUserGroupList,
      userSearchValue,
      assetSearchValue,
      userGroupSearchValue,
      userList,
      assetList,
      userGroupList,
    } = this.state;
    const totalCount =
      selectedUserCount +
      selectedAssetCount +
      selectedStatusCount +
      selectedPanelCount +
      selectedPriorityCount;
    const eventStyleGetter = (event, start, end, isSelected) => {
      var backgroundColor = event.backgroundColor;
      var style = {
        backgroundColor: backgroundColor,
        borderRadius: "5px",
        fontSize: "12px",
        padding: "5px",
        color: event.color,
        border: "0px",
        display: "block",
      };
      return {
        style: style,
      };
    };
    const { isLoading } = this.props;
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

    return (
      <Spin spinning={isLoading}>
        <Page
          title="Scheduler"
          filter={
            <Form
              form={this.props.form}
              layout="inline"
              onFinish={this.submitForm}
            >
              <Form.Item name="ahId" style={{ minWidth: "250px" }}>
                <TreeSelect
                  treeNodeFilterProp="title"
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
              <Space>
                <Col>
                  {
                    <Tooltip title="Scheduler Upload in Excel">
                      <Link to="schedulerUpload">
                        <Button icon={<UploadOutlined />}></Button>
                      </Link>
                    </Tooltip>
                  }
                </Col>

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
              </Space>

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
            <Calendar
              showAllEvents={false}
              showMultiDayTimes={true}
              localizer={localizer}
              events={this.state.rows}
              startAccessor="start"
              endAccessor="end"
              style={{ minHeight: 850 }}
              components={{
                toolbar: Toolbar,
                event: this.EventComponent,
              }}
              disabledDate={(current) => {
                return current && current < moment().add(0, "days");
              }}
              onSelectEvent={this.handleSelectEvent}
              onSelectSlot={this.handleSelectSlot}
              selectable={true}
              eventPropGetter={eventStyleGetter}
              doShowMoreDrillDown={true}
              drilldownView="week"
              views={["month", "week", "day"]}
              onNavigate={(date, view, nav) => {
                console.log(moment(date).weekday());
                console.log(date, view, nav);
              }}
            />
          </Spin>
        </Page>
      </Spin>
    );
  }
}

export default withForm(withRouter(withAuthorization(Scheduler)));
