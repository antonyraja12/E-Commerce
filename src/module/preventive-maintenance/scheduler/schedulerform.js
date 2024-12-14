import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Tag,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import React from "react";
import { MdGroups, MdPerson } from "react-icons/md";
import AssetService from "../../../services/asset-service";
import CheckListService from "../../../services/preventive-maintenance-services/checklist-service";
import SchedulerService from "../../../services/preventive-maintenance-services/scheduler-service";
import UserGroupService from "../../../services/user-group-service";
import UserService from "../../../services/user-service";
import Page from "../../../utils/page/page";
import PageForm from "../../../utils/page/page-form";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";

const { TextArea } = Input;
const { Option } = Select;

class SchedulerForm extends PageForm {
  service = new SchedulerService();
  userservice = new UserService();
  usergroupservice = new UserGroupService();
  checklistservice = new CheckListService();
  assetservice = new AssetService();

  state = {
    disable: false,
    required: false,
    hidden: true,
    asset: [],
    checklist: [],
    isGroup: false,
    userGroup: [],
    users: [],
    selectedUserGroup: null,
    usersInSelectedGroup: [],
  };

  closePopup = () => {
    this.props.navigate("..");
  };

  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup();
  }

  componentDidMount() {
    // console.log("this.props", this.props);
    if (this.props.searchParams.get("date")) {
      let date = Number(this.props.searchParams.get("date"));
      // console.log("date", moment(date));
      this.props?.form?.setFieldValue("scheduleDate", dayjs(moment.unix(date)));
      this.props?.form?.setFieldValue("endDate", dayjs(moment.unix(date)));
    }

    this.assetservice.list({ active: true }).then((response) => {
      this.setState((state) => ({ ...state, asset: response.data }));
    });

    // const assetId = this.props.form.getFieldValue("assetId");

    this.checklistservice
      .list({ active: true })
      .then((response) => {
        // console.log("checklist", response);
        this.setState((state) => ({
          ...state,
          checklist: response.data,
        }));
      })
      .catch((error) => {
        console.error("Error retrieving checklist data:", error);
        // Handle error if needed
      });

    this.userservice.list({ active: true }).then((response) => {
      this.setState((state) => ({ ...state, user: response.data }));
    });
    this.usergroupservice.list({ active: true }).then((response) => {
      this.setState((state) => ({ ...state, userGroup: response.data }));
    });

    this.service.list({ active: true }).then((response) => {
      this.setState((state) => ({ ...state, scheduler: response.data }));
    });

    if (this.props.params.id) {
      this.onRetrieve(this.props.params.id);
      this.closePopup = () => this.props.navigate("..");
      this.setState((state) => ({
        ...state,
        title: "Edit Schedule",
        disable: true,
        hidden: false,
        required: true,
      }));
      if (this.props.mode === "Edit") {
        // console.log("Edittttttttt");
        this.setState((state) => ({
          ...state,
          title: "Edit Schedule",
          disable: true,
          hidden: false,
          required: true,
        }));
      } else if (this.props.mode === "View")
        this.setState((state) => ({
          ...state,
          title: "View Schedule",
          disabled: true,
        }));
    } else {
      this.setState((state) => ({ ...state, title: "Add Schedule" }));
    }
    super.componentDidMount();
  }

  patchForm(data) {
    // console.log(data, "data123");
    if (data.userGroupId) {
      var enumType = true;
      this.handleUserGroupChange(data.userGroupId);
    } else {
      var enumType = false;
    }
    if (this.props.form) {
      this.props.form.setFieldsValue({
        ...data,
        startTime: moment(data.startTime),
        endTime: moment(data.endTime),
        scheduleDate: moment(data.scheduleDate),
        endDate: moment(data.endDate),
        recurrence: {
          frequency: data.frequency,
        },
        schedulerCheckListMappings: data.schedulerCheckListMappings.map(
          (e) => e.checkListId
        ),
      });
      this.handleGroup(enumType);
    }
  }
  handleGroup = (enumType) => {
    this.setState((state) => ({
      ...state,
      isGroup: enumType,
    }));
    this.props.form.setFieldsValue({ selectType: enumType });
  };
  handleAssetChange = (assetId) => {
    this.props.form.setFieldsValue({
      schedulerCheckListMappings: [],
    });

    this.checklistservice
      .list({ active: true, assetId })
      .then((response) => {
        // console.log("checklist", response);
        this.setState((state) => ({
          ...state,
          checklist: response.data,
        }));
      })
      .catch((error) => {
        console.error("Error retrieving checklist data:", error);
      });
  };

  handleFinish = (values) => {
    if (values.userId) {
      values = {
        ...values,
        userGroupId: null,
      };
    } else if (values.userGroupId) {
      values = {
        ...values,
        userId: null,
      };
    }

    let start =
      this.state.recurrence?.start != null
        ? this.state.recurrence?.start
        : this.props.form.getFieldValue("scheduleDate").toISOString();

    let end =
      this.state.recurrence?.end != null
        ? this.state.recurrence?.end
        : this.props.form.getFieldValue("endDate").toISOString();

    let frequency =
      this.state.recurrence?.frequency != null
        ? this.state.recurrence?.frequency
        : "DoesNotRepeat";

    // console.log("fre", frequency, this.state.recurrence, "rec");
    values.scheduleDate = start;
    values.endDate = end;
    values.repeat = this.state.recurrence?.repeat;
    values.frequency = frequency;

    this.onFinish(values);
  };

  handleFrequencyChange = (value) => {
    this.setState({
      selectedFrequency: value,
    });
    value === "DoesNotRepeat" ? <></> : this.setState({ showDateModal: true });
    let date = dayjs();
    if (this.props.searchParams.get("date")) {
      let dateStart = Number(this.props.searchParams.get("date"));
      date = moment.unix(dateStart);
    }
    const initialValues = {
      recurrence: {
        start: date,
        frequency: value,
        repeat: 1,
      },
    };

    this.props.form.setFieldsValue(initialValues);
  };
  handleDateModalCancel = () => {
    this.setState({ showDateModal: false });
  };

  handleModalSave = () => {
    let starttime = new Date(this.props.form.getFieldsValue().recurrence.start);

    let endtime = new Date(this.props.form.getFieldsValue().recurrence.end);

    starttime.setHours(5);
    starttime.setMinutes(30);
    starttime.setSeconds(0);
    endtime.setHours(5);
    endtime.setMinutes(30);
    endtime.setSeconds(0);
    const formData = {
      ...this.props.form.getFieldsValue().recurrence,
      start: starttime.toISOString(),
      end: endtime.toISOString(),
    };

    this.setState({
      showDateModal: false,
    });
    this.setState((state) => ({ ...state, recurrence: formData }));
    // console.log(formData);
  };
  convertionfun = (datepick, timepick) => {
    if (!datepick || !timepick) {
      return null;
    }

    const inputTime = timepick;
    const [time, ampm] = inputTime.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date(datepick);

    date.setHours(ampm === "AM" ? hours : hours + 12, minutes, 0);
    // console.log("state123", date.toISOString());
    return date.toISOString();
  };
  handleUserGroupChange = (value) => {
    const { userMappings, users, userGroup } = this.state;
    // if (!userMappings || !users) {
    //   console.error('User mappings or users data is undefined');
    //   return;
    // }
    const groupData = userGroup.find((group) => group.userGroupId === value);
    // Initialize an empty array to store the user names
    let userNames = [];

    // Check if the groupData exists and has 'userMappings'
    if (groupData && groupData.userMappings) {
      // Extract user names from 'userMappings' using map
      userNames = groupData.userMappings.map(
        (mapping) => mapping.userLists.userName
      );
    }
    console.log(userNames, "userNames");
    this.setState({
      selectedUserGroup: value,
      usersInSelectedGroup: userNames,
    });
  };

  render() {
    const { userGroup, selectedUserGroup, usersInSelectedGroup } = this.state;
    const numUsers = usersInSelectedGroup.length;
    const maxHeight = 75;

    const listStyle =
      numUsers > 3 ? { height: `${maxHeight}px`, overflowY: "scroll" } : {};
    return (
      <Page title={this.state.title}>
        <Row justify="center">
          <Col sm={18} md={18} xs={24}>
            <Spin spinning={!!this.state.isLoading}>
              <Card>
                <Form
                  size="small"
                  form={this.props.form}
                  colon={false}
                  labelAlign="left"
                  layout="vertical"
                  onFinish={this.handleFinish}
                  loading={this.state.isLoading}
                >
                  <Row gutter={[10, 10]}>
                    <Col sm={12} xs={24}>
                      <Form.Item name="schedulerId" hidden>
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="Asset"
                        name="assetId"
                        rules={[
                          {
                            required: true,
                            message: "Please Select Asset Name!",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          optionFilterProp="children"
                          onChange={this.handleAssetChange}
                        >
                          {this.state.asset?.map((e) => (
                            <Option
                              key={`asset${e.assetNameId}`}
                              value={e.assetId}
                            >
                              {e.assetName}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col sm={12} xs={24}>
                      <Form.Item
                        label={"Checklist"}
                        name="schedulerCheckListMappings"
                        rules={[
                          {
                            required: true,
                            message: "Please Add Checklist!",
                          },
                        ]}
                      >
                        <Select mode="multiple" optionFilterProp="children">
                          {this.state.checklist?.map((e) => (
                            <Option key={e.checkListId} value={e.checkListId}>
                              {e.checkListName}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col sm={12} xs={24}>
                      <Form.Item
                        label="Frequency"
                        name={["recurrence", "frequency"]}
                        rules={[
                          {
                            required: true,
                            message: "Please Select Frequency!",
                          },
                        ]}
                      >
                        <Select
                          disabled={this.state.disable}
                          showSearch
                          onChange={this.handleFrequencyChange}
                        >
                          <Option value="DoesNotRepeat">Does Not Repeat</Option>
                          <Option value="Daily">Daily</Option>
                          <Option value="Weekly">Weekly</Option>
                          <Option value="Monthly">Monthly</Option>
                          <Option value="Quarterly">Quarterly</Option>
                          <Option value="HalfYearly">HalfYearly</Option>
                          <Option value="Yearly">Yearly</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    {this.state.isGroup ? (
                      <Col sm={8} xs={16}>
                        <Form.Item
                          label="Assigned To Group"
                          name="userGroupId"
                          rules={[
                            {
                              required: true,
                              message: "Please Select User Group!",
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            optionFilterProp="children"
                            allowClear
                            onChange={this.handleUserGroupChange}
                            value={selectedUserGroup}
                          >
                            {userGroup?.map((group) => (
                              <Option
                                key={group.userGroupId}
                                value={group.userGroupId}
                              >
                                {group.userGroupName}{" "}
                                <MdGroups
                                  fontSize="small"
                                  style={{
                                    verticalAlign: "text-top",
                                    marginRight: "4px",
                                  }}
                                />
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>

                        {usersInSelectedGroup.length > 0 && (
                          <List
                            style={listStyle}
                            size="small"
                            bordered
                            dataSource={usersInSelectedGroup}
                            renderItem={(userName, index) => (
                              <List.Item key={index}>
                                <Tag bordered={false} color="purple">
                                  {userName}
                                </Tag>
                              </List.Item>
                            )}
                          />
                        )}
                      </Col>
                    ) : (
                      <Col sm={8} xs={16}>
                        <Form.Item
                          label="Assigned To User"
                          name="userId"
                          rules={[
                            { required: true, message: "Please Select User!" },
                          ]}
                        >
                          <Select
                            showSearch
                            optionFilterProp="children"
                            allowClear
                          >
                            {this.state.user?.map((e) => (
                              <Option key={`user${e.userId}`} value={e.userId}>
                                {e.userName}{" "}
                                <MdPerson
                                  fontSize="small"
                                  style={{
                                    verticalAlign: "text-top",
                                    marginRight: "4px",
                                  }}
                                />
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    )}
                    <Col sm={4} xs={8}>
                      <Form.Item name="selectType" label="Select">
                        <Switch
                          checkedChildren="Group"
                          unCheckedChildren="User"
                          onChange={(checked) =>
                            this.setState({ ...this.state, isGroup: checked })
                          }
                          checked={this.state.isGroup ? true : false}
                        />
                      </Form.Item>
                    </Col>

                    <Col lg={5}>
                      <Form.Item
                        label="Start Date"
                        name="scheduleDate"
                        rules={[
                          {
                            required: true,
                            message: "Please Select Start Date !",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const endDate = getFieldValue("endDate")
                                .toDate()
                                .setHours(0, 0, 0, 0);
                              const startDate = value
                                .toDate()
                                .setHours(0, 0, 0, 0);
                              if (!endDate || !value) {
                                return Promise.resolve();
                              }

                              if (startDate > endDate) {
                                return Promise.reject(
                                  "Start date must be before than end date!"
                                );
                              }

                              return Promise.resolve();
                            },
                          }),
                        ]}
                        dependencies={["endDate"]}
                      >
                        <DatePicker
                          disabled={this.state.disable}
                          disabledDate={(current) => {
                            return (
                              current && current < moment().add(-1, "days")
                            );
                          }}
                          // onOk={onOK}
                          // onCalendarChange={onOk}
                          format="DD-MM-YYYY  "
                          showTime // This will show the time input
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={5}>
                      <Form.Item
                        label="End Date"
                        name="endDate"
                        rules={[
                          {
                            required: true,
                            message: "Please Select End Date !",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const startDate = getFieldValue("scheduleDate")
                                .toDate()
                                .setHours(0, 0, 0, 0);
                              const endDate = value
                                .toDate()
                                .setHours(0, 0, 0, 0);
                              if (!startDate || !value) {
                                return Promise.resolve();
                              }

                              if (startDate > endDate) {
                                return Promise.reject(
                                  "End date must be later than start date!"
                                );
                              }

                              return Promise.resolve();
                            },
                          }),
                        ]}
                        dependencies={["scheduleDate"]}
                      >
                        <DatePicker
                          disabled={this.state.disable}
                          disabledDate={(current) => {
                            return (
                              current && current < moment().add(-1, "days")
                            );
                          }}
                          format="DD-MM-YYYY" // Corrected format
                          showTime // This will show the time input
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={6}>
                      <Form.Item
                        label="Start Time"
                        name="startTime"
                        rules={[
                          {
                            required: true,
                            message: "Please Select Start Time!",
                          },
                        ]}
                      >
                        <TimePicker format="HH:mm:ss" />
                      </Form.Item>
                    </Col>

                    <Col lg={6}>
                      <Form.Item
                        label="End Time"
                        name="endTime"
                        rules={[
                          {
                            required: true,
                            message: "Please Select End Time!",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const startTime = getFieldValue("startTime");
                              const startDate = getFieldValue("scheduleDate")
                                .toDate()
                                .setHours(0, 0, 0, 0); // Extracting date value directly
                              const endDate = getFieldValue("endDate")
                                .toDate()
                                .setHours(0, 0, 0, 0); // Extracting date value directly

                              if (!startTime || !value) {
                                return Promise.resolve();
                              }

                              const startTimeDate = startTime.toDate();
                              const endTimeDate = value.toDate();

                              if (
                                startDate == endDate &&
                                endTimeDate < startTimeDate
                              ) {
                                return Promise.reject(
                                  "End time must be later than start time!"
                                );
                              }

                              return Promise.resolve();
                            },
                          }),
                        ]}
                      >
                        <TimePicker format="HH:mm:ss" />
                      </Form.Item>
                    </Col>
                    <Col lg={7}>
                      <Form.Item
                        label="Scheduler Update"
                        name="schedulerUpdate"
                        rules={[
                          {
                            required: this.state.required,
                            message: "Please Select Date!",
                          },
                        ]}
                        hidden={this.state.hidden}
                      >
                        <Radio.Group>
                          <Radio value={"Occurrence"}>Occurrence</Radio>
                          <Radio value={"Series"}>Series</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>

                    <Form.Item hidden name="repeat">
                      <InputNumber />
                    </Form.Item>

                    <Form.Item hidden label="Frequency" name="frequency">
                      <Select disabled={this.state.disable} showSearch>
                        <Option value="DoesNotRepeat">Does Not Repeat</Option>
                        <Option value="Daily">Daily</Option>
                        <Option value="Weekly">Weekly</Option>
                        <Option value="Monthly">Monthly</Option>
                        <Option value="Quarterly">Quarterly</Option>
                        <Option value="HalfYearly">HalfYearly</Option>
                        <Option value="Yearly">Yearly</Option>
                      </Select>
                    </Form.Item>

                    <Col sm={24} xs={24}>
                      <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                          { required: true, message: "Please Add Description" },
                        ]}
                      >
                        <TextArea rows={4} maxLength={200} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row justify="end">
                    <Col>
                      <Button type="primary" htmlType="submit">
                        Save
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Spin>
          </Col>
        </Row>

        {this.state.selectedFrequency && (
          <Modal
            title="Recurrence"
            visible={this.state.showDateModal}
            onCancel={this.handleDateModalCancel}
            footer={[
              <Button key="cancel" onClick={this.handleDateModalCancel}>
                Cancel
              </Button>,
              <Button key="save" type="primary" onClick={this.handleModalSave}>
                Save
              </Button>,
            ]}
          >
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 12 }}
              // let date = Number(this.props.searchParams.get("date"))

              initialValues={{
                recurrence: {
                  start: moment(),
                  frequency: "Daily",
                  repeat: 1,
                },
              }}
              form={this.props.form}
            >
              <Form.Item
                label="Start Date"
                name={["recurrence", "start"]}
                rules={[
                  {
                    required: true,
                    message: "Please select start date!",
                  },
                ]}
              >
                <DatePicker
                  // disabled={this.state.disable}
                  disabledDate={(current) => {
                    // return current && current < moment().add(0, "days");
                    return current && current < moment().startOf("day");
                  }}
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    this.props.form.setFieldsValue({ scheduleDate: value });
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Frequency"
                rules={[
                  {
                    required: true,
                    message: "Please select frequency",
                  },
                ]}
              >
                <Space>
                  <Form.Item
                    noStyle
                    label="Repeat"
                    name={["recurrence", "repeat"]}
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                    noStyle
                    label="Frequency"
                    name={["recurrence", "frequency"]}
                  >
                    <Select>
                      <Option value="Daily">Day</Option>
                      <Option value="Weekly">Week</Option>
                      <Option value="Monthly">Month</Option>
                      <Option value="Yearly">Year</Option>
                    </Select>
                  </Form.Item>
                </Space>
              </Form.Item>

              <Form.Item
                label="End Date"
                name={["recurrence", "end"]}
                rules={[
                  {
                    required: true,
                    message: "Please select end date!",
                  },
                ]}
              >
                <DatePicker
                  // disabled={this.state.disable}
                  disabledDate={(current) => {
                    // return current && current < moment().add(0, "days");
                    return current && current < moment().startOf("day");
                  }}
                  format="DD-MM-YYYY"
                  showTime
                  onChange={(value) => {
                    this.props.form.setFieldsValue({ endDate: value });
                  }}
                />
              </Form.Item>
            </Form>
          </Modal>
        )}
      </Page>
    );
  }
}

export default withForm(withRouter(SchedulerForm));