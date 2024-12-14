import {
  CheckOutlined,
  CloseCircleOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  TimePicker,
  Tooltip,
  message,
} from "antd";
import dayjs from "dayjs";
import { createRef } from "react";
import ShiftDetailsAssetwiseService from "../../../services/shift-configuration/shift-details-assetwise-service";
import ShiftMasterService from "../../../services/shift-configuration/shift-master-service";
import PageForm from "../../../utils/page/page-form";
import { withForm } from "../../../utils/with-form";
import AddBreakDetails from "./add-break-details";
const { Option } = Select;
let arr = [];
let dis = true;
class ShiftConfigForm extends PageForm {
  shiftMasterService = new ShiftMasterService();
  service = new ShiftDetailsAssetwiseService();
  state = {
    loading: false,
    shiftDuration: null,
    shiftMasteDetails: null,
    dayStart: [],
    disableComponent: true,
  };
  id = Math.floor(Math.random() * 999999999999 + 1);
  constructor(props) {
    super(props);
    this.state = {
      childElements: [],
      keyIndex: 0,
      editStatus: false,
      addStatus: true,
      modalOpen: false,
      modalId: "",
    };
    this.ref = createRef();
  }
  componentDidMount() {
    if (this.props.shiftMasterId) {
      this.onShiftChange(this.props.shiftMasterId, null);
    }
    if (!this.props.shiftMasterAssetWiseId) {
      this.shiftMasterService.list().then((res) => {
        this.props.form.setFieldValue(
          "shiftMasterId",
          res.data[0].shiftMasterId
        );
        this.onShiftChange(res.data[0].shiftMasterId);
      });
    }
    // console.log("props", this.props);
    this.props.form.setFieldsValue({
      dayEnd: this.props.dayEnd,
      dayStart: this.props.dayStart,
      shiftBreakDetails: this.props.shiftBreakDetails,
      shiftMasterAssetWiseId: this.props.shiftMasterAssetWiseId,
      shiftName: this.props.shiftName,
    });
    if (this.props.startTime) {
      this.props.form.setFieldsValue({
        endTime: dayjs(this.props.endTime),
        startTime: dayjs(this.props.startTime),
      });
    }
    this.shiftCollisionValidation();
    dis = true;
  }
  test = () => {
    dis = true;
    if (this.state.disabled) {
      dis = true;
    } else {
      if (!!this.props.form.getFieldValue("shiftMasterId")) {
        dis = false;
      } else {
        dis = true;
      }
    }
  };
  disabledTime = () => {
    if (this.state.time && this.state.startDay == this.state.endDay) {
      return {
        disabledHours: () => {
          return Array.from(
            { length: dayjs(this.state.time).hour() - 1 },
            (_, index) => index
          );
        },
        disabledMinutes: (selectedHour) => {
          if (selectedHour == dayjs(this.state.time).hour() - 1)
            return Array.from(
              { length: dayjs(this.state.time).minute() },
              (_, index) => index
            );
        },
        disabledSeconds: (selectedHour, selectedMinute) => {
          if (selectedHour == dayjs(this.state.time).hour() - 1) {
            if (selectedMinute === dayjs(this.state.time).minute()) {
              return Array.from(
                { length: dayjs(this.state.time).second() },
                (_, index) => index
              );
            }
          }
          return [];
        },
      };
    } else {
      return [];
    }
  };

  breakPopOver = (values) => {
    if (values.shiftBreakDetails) {
      return null;
    } else {
      message.info("Please Click OK to the configured Breaks!");
      this.showModal();
    }
  };
  showModal = () => {
    this.setState(
      {
        modalOpen: true,
      },
      () => {
        setTimeout(() => {
          this.afterOpen();
        }, 500);
      }
    );
  };
  closeModal = () => {
    this.setState({ modalOpen: false });
    this.props.form.setFieldValue(
      "shiftMasterAssetWiseId",
      this.props.shiftMasterAssetWiseId
    );
  };
  shiftDays = [
    {
      value: "MONDAY",
      label: "Monday",
    },
    {
      value: "TUESDAY",
      label: "Tuesday",
    },
    {
      value: "WEDNESDAY",
      label: "Wednesday",
    },
    {
      value: "THURSDAY",
      label: "Thursday",
    },
    {
      value: "FRIDAY",
      label: "Friday",
    },
    {
      value: "SATURDAY",
      label: "Saturday",
    },
    {
      value: "SUNDAY",
      label: "Sunday",
    },
  ];
  handleAddBreakDetails = (data) => {
    this.props.form.setFieldValue("shiftBreakDetails", data);
    this.closeModal();
  };
  shiftCollisionValidation = () => {};

  onFinish = (values) => {
    // console.log("value", values);
    if (
      dayjs(values.endTime).format("HH:mm:ss") !=
      dayjs(values.startTime)
        .add(this.state.shiftMasteDetails.shiftDuration, "minutes")
        .format("HH:mm:ss")
    ) {
      message.error(
        "Please ensure that the start time and end time fall within the configured shift hours and do not exceed or fall below them. "
      );
      return;
    }
    if (this.props.shiftDetailId) {
      this.service.update(values, this.props.shiftDetailId).then((res) => {
        if (res.data.success == true) {
          message.success(res.data.message);
          this.props.callBackSave();
          this.props.disableAdd();
        } else {
          message.error(res.data.message);
        }
      });
      this.props.callBackSave();
    } else {
      this.breakPopOver(values);
      if (values.shiftBreakDetails) {
        this.service.add(values).then((res) => {
          if (res.data.success == true) {
            message.success(res.data.message);
            this.props.callBackSave();
            this.props.form.resetFields();
          } else {
            message.error(res.data.message);
          }
        });
        this.props.callBackSave();
      }
    }
  };
  static getDerivedStateFromProps(props, state) {
    return { ...state, ...props };
  }
  submitForm = () => {
    let form = this.ref.current?.ref.current;
    form.submit();
  };
  afterOpen = () => {
    let form = this.ref.current?.ref.current;
    let data = this.props.form.getFieldValue("shiftBreakDetails");
    this.props.form.setFieldValue(
      "shiftMasterAssetWiseId",
      this.props.shiftMasterAssetWiseId
    );
    form.setFieldValue(
      "shiftBreakDetails",
      data.map((e) => ({
        description: e.description,
        startTime: dayjs(e.startTime),
        endTime: dayjs(e.endTime),
        dayStart: e.dayStart,
        dayEnd: e.dayEnd,
      }))
    );
  };
  getBreakData = (data) => {
    this.props.form.setFieldValue("shiftBreakDetails", data.shiftBreakDetails);
    this.setState({
      modalOpen: false,
    });
  };
  openModal = () => {
    this.setState((state) => ({ ...state, openDeletModal: true }));
  };
  closeModalDelete = () => {
    this.setState((state) => ({ ...state, openDeletModal: false }));
  };
  deleteShift = () => {
    this.service.delete(this.props.shiftDetailId).then((res) => {
      if (res.data.success === true) {
        this.closeModalDelete();
        message.success(res.data.message);
        this.props.callBackSave();
      } else message.error(res.data.message);
    });
  };
  onTimerChange = (time, shiftDuration) => {
    if (time && shiftDuration) {
      this.props.form.setFieldValue(
        "endTime",
        dayjs(time).add(shiftDuration, "minutes")
      );
      if (
        dayjs(time).get("day") ==
        dayjs(time).add(shiftDuration, "minutes").get("day")
      ) {
        this.props.form.setFieldValue(
          "dayEnd",
          this.props.form.getFieldValue("dayStart")
        );
      } else {
        const dayOfIndex = this.shiftDays.findIndex(
          (e) => e.value == this.props.form.getFieldValue("dayStart")
        );
        if (dayOfIndex == 6) {
          this.props.form.setFieldValue("dayEnd", this.shiftDays[0].value);
        } else {
          this.props.form.setFieldValue(
            "dayEnd",
            this.shiftDays[dayOfIndex + 1].value
          );
        }
      }
    }
  };
  onShiftChange = (shift, time) => {
    this.shiftMasterService.retrieve(shift).then((res) => {
      if (time) {
        this.onTimerChange(time, res.data.shiftDuration);
      }
      this.setState({
        shiftDuration: res.data.shiftDuration,
        shiftMasteDetails: res.data,
      });
    });
  };
  onDayStartChange = (time) => {
    this.onTimerChange(time, this.state.shiftDuration);
  };
  render() {
    const { disabled } = this.state;
    return (
      <>
        <Form
          key={this.id}
          // disabled={disabled}
          disabled={true}
          form={this.props.form}
          onFinish={this.onFinish}
        >
          <Row justify="center" gutter={10}>
            <Col sm={3}>
              <Form.Item name="shiftMasterAssetWiseId" hidden>
                <Input />
              </Form.Item>
              <Form.Item name="shiftBreakDetails" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                name="shiftName"
                rules={[{ required: true, message: "Select Shift" }]}
              >
                <Input readOnly></Input>
              </Form.Item>
            </Col>
            <Col sm={4}>
              <Form.Item
                name="dayStart"
                rules={[{ required: true, message: "Select Start Day" }]}
              >
                <Select
                  onChange={() => {
                    this.onDayStartChange(
                      this.props.form.getFieldValue("startTime")
                    );
                    this.shiftCollisionValidation();
                  }}
                  placeholder="Day Start"
                  options={arr.length ? arr : this.shiftDays}
                  // disabled={dis}
                />
              </Form.Item>
            </Col>
            <Col sm={3}>
              <Form.Item
                name="startTime"
                rules={[{ required: true, message: "Select Start Time" }]}
              >
                <TimePicker
                  onChange={(e) => {
                    this.setState({ time: e });
                    this.onTimerChange(e, this.state.shiftDuration);
                  }}
                  disabledTime={this.state.time ? this.disabledTime : null}
                />
              </Form.Item>
            </Col>
            <Col sm={4}>
              <Form.Item
                name="dayEnd"
                rules={[{ required: true, message: "Select End Day" }]}
              >
                <Select placeholder="Day End" options={this.shiftDays} />
              </Form.Item>
            </Col>
            <Col sm={3}>
              <Form.Item
                name="endTime"
                rules={[{ required: true, message: "Select End Time" }]}
              >
                <TimePicker onChange={this.onEndTimeChange} />
              </Form.Item>
            </Col>
            <Col sm={4}>
              {this.props.form.getFieldValue("startTime") &&
              this.props.form.getFieldValue("endTime") ? (
                <Form.Item>
                  <Button
                    type="dashed"
                    htmlType="button"
                    onClick={this.showModal}
                  >
                    Add Breaks
                  </Button>
                </Form.Item>
              ) : null}
            </Col>
            <Col sm={3}>
              <Space>
                {/* {disabled ? ( */}
                {this.props.shiftDetailId && (
                  <Tooltip title="Edit">
                    <Button
                      type="primary"
                      disabled={!disabled}
                      onClick={() => {
                        this.props.editId(this.props.shiftDetailId);
                        this.shiftCollisionValidation();
                      }}
                      shape="circle"
                      htmlType="button"
                    >
                      <EditOutlined />
                    </Button>
                  </Tooltip>
                )}
                <Tooltip title="Save">
                  <Button
                    disabled={disabled}
                    type="primary"
                    shape="circle"
                    htmlType="submit"
                  >
                    <CheckOutlined />
                  </Button>
                </Tooltip>
                {this.props.shiftDetailId ? (
                  <Tooltip title="Cancel">
                    <Button
                      type="primary"
                      htmlType="button"
                      disabled={false}
                      shape="circle"
                      onClick={this.openModal}
                      danger
                    >
                      <CloseCircleOutlined />
                    </Button>
                  </Tooltip>
                ) : (
                  <Tooltip title="Cancel">
                    <Button
                      type="primary"
                      htmlType="button"
                      disabled={false}
                      shape="circle"
                      onClick={this.props.disableAdd}
                      danger
                    >
                      <CloseCircleOutlined />
                    </Button>
                  </Tooltip>
                )}
              </Space>
            </Col>
          </Row>
          <Modal
            open={this.state.modalOpen}
            onCancel={this.closeModal}
            title="Break Details"
            destroyOnClose
            onOk={this.submitForm}
            width={800}
          >
            <AddBreakDetails
              ref={this.ref}
              shiftMasteDetails={this.state.shiftMasteDetails}
              save={this.getBreakData}
              shiftStartTime={this.props.form.getFieldValue("startTime")}
              shiftEndTime={this.props.form.getFieldValue("endTime")}
              shiftDayStart={this.props.form.getFieldValue("dayStart")}
              shiftDayEnd={this.props.form.getFieldValue("dayEnd")}
            />
          </Modal>
        </Form>
        <Modal
          open={this.state.openDeletModal}
          onCancel={this.closeModalDelete}
          footer={[
            <Button onClick={this.closeModalDelete}>Cancel</Button>,
            <Button onClick={this.deleteShift}>Ok</Button>,
          ]}
        >
          <Row>
            <Col sm={1}>
              <ExclamationCircleFilled />
            </Col>
            <Col>Are You sure you want to delete this entry?</Col>
          </Row>
        </Modal>
      </>
    );
  }
}

export default withForm(ShiftConfigForm);
