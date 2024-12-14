import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Spin,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import { createRef } from "react";
import ShiftDetailsAssetwiseService from "../../../services/shift-configuration/shift-details-assetwise-service";
import ShiftMasterService from "../../../services/shift-configuration/shift-master-service";
import PageForm from "../../../utils/page/page-form";
import { withForm } from "../../../utils/with-form";
import ShiftForm from "../shift-master/shift-master";
const { Option } = Select;
let arr = [];
let dis = true;
class ShiftStepper extends PageForm {
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
      loading: false,
    };
    this.ref = createRef();
  }
  componentDidMount() {
    if (this.props.shiftDetailId) {
      this.setState((state) => ({ ...state, lastIndexData: null }));
      const shiftDetailId = this.props.shiftDetailId;
      this.service.retrieve(shiftDetailId).then(({ data }) => {
        this.props.form.setFieldsValue({
          shiftMasterAssetWiseId: data.shiftMasterAssetWiseId,
          shiftMasterId: data.shiftMasterId,
          dayStart: data.dayStart,
          dayEnd: data.dayEnd,
          startTime: dayjs(data.startTime),
          endTime: dayjs(data.endTime),
          shiftName: data.shiftName,
        });
        this.onShiftChange(data.shiftMasterId, dayjs(data.startTime));
      });
    }
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
    this.shiftCollisionValidation();
    this.props.form.setFieldsValue({
      dayEnd: this.props.dayEnd,
      dayStart: this.props.dayStart,
      shiftBreakDetails: this.props.shiftBreakDetails,
      shiftMasterAssetWiseId: this.props.shiftMasterAssetWiseId,
      shiftMasterId: this.props.shiftMasterId,
    });

    if (this.props.startTime) {
      this.props.form.setFieldsValue({
        endTime: dayjs(this.props.endTime),
        startTime: dayjs(this.props.startTime),
      });
    }

    dis = true;
    this.shiftMasterService.list().then((res) => {
      this.setState((state) => ({
        ...state,
        shift: res.data,
      }));
    });
  }
  disabledTime = () => {
    // console.log("selectedHour", dayjs(this.state.time).hour());
    if (this.state.lastIndexData) {
      if (
        this.state.lastIndexData.dayEnd ===
        this.props.form.getFieldValue("dayStart")
      ) {
        // console.log("this.state.lastIndexData", this.state.lastIndexData);
        if (this.state.time && this.state.startDay == this.state.endDay) {
          return {
            disabledHours: () => {
              return Array.from(
                { length: dayjs(this.state.time).hour() - 1 },
                (_, index) => index
              );
            },
          };
        } else {
          return [];
        }
      } else {
        return [];
      }
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
    this.shiftCollisionValidation();
  };
  onClose = () => {
    this.shiftMasterService.list().then(({ data }) => {
      this.setState((state) => ({ ...state, shift: data }));
    });
    this.setState((state) => ({ ...state, popup: { open: false } }));
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
  shiftCollisionValidation = () => {
    if (this.props.shiftMasterAssetWiseId) {
      this.service
        .list({ shiftMasterAssetWiseId: this.props.shiftMasterAssetWiseId })
        .then((res) => {
          if (res.data.length) {
            let index = null;
            if (this.props.shiftDetailId) {
              const mainIndex = res.data.findIndex(
                (e) => e.shiftDetailId == this.props.shiftDetailId
              );
              index = mainIndex != 0 ? mainIndex - 1 : mainIndex;
              // console.log("log", index, this.props.shiftDetailId, res.data);
            } else {
              index = res.data.length - 1;
            }
            // console.log("index", index, this.props.shiftDetailId);
            if (this.props.shiftDetailId && index == 0) {
              this.setState((state) => ({
                ...state,
                lastIndexData: null,
              }));
            } else {
              this.setState((state) => ({
                ...state,
                lastIndexData: res.data[index],
              }));
            }
            let dayIndex;
            if (index == -1) {
              dayIndex = 0;
            } else {
              dayIndex = this.shiftDays.findIndex(
                (e) => res.data[index].dayEnd === e.value
              );
            }

            if (dayIndex !== 6) {
              arr = [];
              for (let i = dayIndex; i < 7; i++) {
                arr.push(this.shiftDays[i]);
              }
            } else {
              arr = this.shiftDays;
            }
            this.setState((state) => ({
              ...state,
              time: res.data[index].endTime,
            }));
          }
        });
    }
  };
  onFinish = (values) => {
    if (
      dayjs(values.endTime).format("HH:mm:ss") !=
      dayjs(values.startTime)
        .add(this.state.shiftDuration, "minutes")
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
    // console.log("time", time, shiftDuration);
    if (time && shiftDuration) {
      // console.log("time", time, shiftDuration);
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
    if (this.props.shiftDetailId) {
      this.service.retrieve(this.props.shiftDetailId).then((res) => {
        // console.log("res1", res.data);
        if (time) {
          this.onTimerChange(time, res.data.shiftDuration);
        }
        this.setState({
          shiftDuration: res.data?.shiftMaster?.shiftDuration,
          shiftMasteDetails: res.data.shiftBreakDetails,
        });
      });
    } else {
      this.shiftMasterService.retrieve(shift).then((res) => {
        // console.log("res2", res.data);
        if (time) {
          this.onTimerChange(time, res.data.shiftDuration);
        }
        this.setState({
          shiftDuration: res.data.shiftDuration,
          shiftMasteDetails: res.data?.shiftBreakMasters,
        });
      });
    }
  };
  onDayStartChange = (time) => {
    this.onTimerChange(time, this.state.shiftDuration);
  };
  addShift = () => {
    this.setState((state) => ({
      ...state,
      popup: { title: "Add Shift", mode: "Add", open: true },
    }));
  };
  setCurrent = (values) => {
    if (
      dayjs(values.endTime).format("HH:mm:ss") !=
      dayjs(values.startTime)
        .add(this.state.shiftDuration, "minutes")
        .format("HH:mm:ss")
    ) {
      message.error(
        "Please ensure that the start time and end time fall within the configured shift hours and do not exceed or fall below them. "
      );
      return;
    }
    this.props.onNext();

    this.props.saveShiftData(
      this.state.shiftMasteDetails,
      this.state.shiftDuration,
      values
    );
    // console.log("values11111", values);
  };
  render() {
    const { disabled, isAdd, editableId, isModalOpen } = this.state;
    return (
      <>
        <Spin spinning={this.state.loading}>
          <Form
            key={this.id}
            disabled={disabled}
            form={this.props.form}
            onFinish={this.setCurrent}
            labelCol={{ sm: 8, xs: 24 }}
            wrapperCol={{ sm: 8, xs: 16 }}
            // labelAlign="left"
          >
            <Form.Item name="shiftMasterAssetWiseId" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              name="shiftName"
              label="Shift Name"
              rules={[{ required: true, message: "Enter Shift Name" }]}
            >
              <Input placeholder="Enter Shift Name" />
            </Form.Item>

            <Form.Item
              name="shiftMasterId"
              label="Shift Type"
              rules={[{ required: true, message: "Select Shift" }]}
            >
              <Select
                onChange={(shift) => {
                  this.onShiftChange(
                    shift,
                    this.props.form.getFieldValue("startTime")
                  );
                }}
                placeholder="Select a Shift"
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider />
                    <Button
                      onClick={this.addShift}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add new
                    </Button>
                  </>
                )}
                options={this.state.shift?.map((e) => ({
                  label: e.shiftName,
                  value: e.shiftMasterId,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="dayStart"
              label="Day Start"
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
              />
            </Form.Item>
            {/* </Col> */}
            {/* <Col lg={4}> */}
            <Form.Item
              name="startTime"
              label="Start Time"
              rules={[{ required: true, message: "Select Start Time" }]}
            >
              <TimePicker
                style={{ width: "100%" }}
                onOk={(e) => {
                  // this.setState({ startTimer: e });
                  this.onTimerChange(e, this.state.shiftDuration);
                }}
                disabledTime={this.state.time ? this.disabledTime : null}
              />
            </Form.Item>

            <Form.Item
              name="dayEnd"
              label="Day End"
              rules={[{ required: true, message: "Select End Day" }]}
            >
              <Select placeholder="Day End" options={this.shiftDays} />
            </Form.Item>

            <Form.Item
              name="endTime"
              label="End Time"
              rules={[{ required: true, message: "Select End Time" }]}
            >
              <TimePicker
                style={{ width: "100%" }}
                onChange={this.onEndTimeChange}
              />
            </Form.Item>

            <Row>
              <Col sm={4}>
                <Button onClick={() => this.props.closeModal()}>Cancel</Button>
              </Col>
              <Col sm={{ span: 20 }} style={{ textAlign: "right" }}>
                <Button type="primary" htmlType="submit">
                  Next
                </Button>
              </Col>
            </Row>
          </Form>
          <ShiftForm {...this.state.popup} close={this.onClose} />
        </Spin>
      </>
    );
  }
}

export default withForm(ShiftStepper);
