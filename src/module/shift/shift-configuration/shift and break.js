import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  TimePicker,
  Tooltip,
  message,
} from "antd";
import dayjs from "dayjs";
import React, { Component, createRef } from "react";
import ShiftDetailsAssetwiseService from "../../../services/shift-configuration/shift-details-assetwise-service";
import ShiftMasterService from "../../../services/shift-configuration/shift-master-service";
import BreakStepper from "./break-stepper";

const { Option } = Select;
let arr = [];
let dis = true;
let dayArr = [];
let shiftStartTime = "";
let shiftEndTime = "";
let breaks = "";

class ShiftandBreak extends Component {
  shiftMasterService = new ShiftMasterService();
  service = new ShiftDetailsAssetwiseService();
  state = {
    loading: false,
    shiftDuration: null,
    shiftMasteDetails: null,
    dayStart: [],
    disableComponent: true,
    breakDetails: [],
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
  componentDidMount() {
    const formValues = this.ref.current.getFieldsValue();
    // console.log("rvdvfv", formValues.shiftBreakDetails);
    const shiftDuration = this.props.shiftMasteDetails.shiftDuration;
    breaks = this.props.shiftMasteDetails.shiftBreakMasters;
    const noOfBreaks = this.props.shiftMasteDetails.shiftBreakMasters.length;
    const commonMinutes = shiftDuration / (noOfBreaks + 1);
    shiftStartTime = this.props.shiftStartTime;
    shiftEndTime = this.props.shiftEndTime;
    const dayStart = this.props.shiftDayStart;
    const dayEnd = this.props.shiftDayEnd;
    var mainStTime = null;
    const arr = [];
    const index1 = this.shiftDays.findIndex((e) => e.value === dayStart);
    const index2 = this.shiftDays.findIndex((e) => e.value === dayEnd);
    // console.log(dayStart, dayEnd, index1, index2);
    if (index1 !== index2) {
      dayArr = [];
      dayArr.push(this.shiftDays[index1]);
      dayArr.push(this.shiftDays[index2]);
    } else {
      dayArr = [];
      dayArr.push(this.shiftDays[index1]);
    }
    // console.log(dayArr);
    breaks.map((e) => {
      var breakDayStart = "";
      var breakDayEnd = "";
      mainStTime = mainStTime + commonMinutes;
      const modulus = e.breakDuration / 5;
      var breakStartTime = null;
      var breakEndTime = null;
      for (let i = 0; i < modulus; i++) {
        if (i % 2 === 0) {
          if (breakStartTime) {
            breakStartTime = dayjs(breakStartTime).subtract(5, "minutes");
          } else {
            breakStartTime = dayjs(
              dayjs(shiftStartTime).add(mainStTime, "minute")
            ).subtract(5, "minutes");
          }
        } else {
          if (breakEndTime) {
            breakEndTime = dayjs(breakEndTime).add(5, "minutes");
          } else {
            breakEndTime = dayjs(
              dayjs(shiftStartTime).add(mainStTime, "minute")
            ).add(5, "minutes");
          }
        }
      }
      if (
        dayjs(shiftStartTime).format("dddd") ===
        dayjs(breakStartTime).format("dddd")
      ) {
        breakDayStart = dayStart;
      } else {
        breakDayStart = dayEnd;
      }
      if (
        dayjs(shiftStartTime).format("dddd") ===
        dayjs(breakEndTime).format("dddd")
      ) {
        breakDayEnd = dayStart;
      } else {
        breakDayEnd = dayEnd;
      }
      arr.push({
        description: e.description,
        startTime: dayjs(breakStartTime),
        endTime: dayjs(breakEndTime),
        dayStart: breakDayStart,
        dayEnd: breakDayEnd,
      });
    });
    this.ref.current.setFieldsValue({
      shiftBreakDetails: arr.map((e, index) => ({
        description: e.description,
        startTime: dayjs(e.startTime),
        endTime: dayjs(e.endTime),
        dayStart: e.dayStart,
        dayEnd: e.dayEnd,
      })),
    });
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
    this.shiftCollisionValidation();
    dis = true;
    this.shiftMasterService.list().then((res) => {
      this.setState((state) => ({
        ...state,
        shift: res.data,
      }));
    });
    //   this.list();
  }
  disabledTime = (index, value) => {
    let startHour = "";
    let startMinute = "";
    let startSecond = "";
    if (index === 0) {
      startHour = dayjs(shiftStartTime).hour();
      startMinute = dayjs(shiftStartTime).minute();
      startSecond = dayjs(shiftStartTime).second();
    } else {
      const data = this.ref.current.getFieldValue("shiftBreakDetails");
      startHour = dayjs(data[index - 1].endTime).hour();
      startMinute = dayjs(data[index - 1].endTime).minute();
      startSecond = dayjs(data[index - 1].endTime).second();
    }
    const endHour = dayjs(shiftEndTime).hour();
    return {
      disabledHours: () => {
        if (startHour < endHour) {
          return Array.from({ length: 24 }, (_, index) => {
            if (index >= endHour || index < startHour) {
              return index;
            }
          });
        } else {
          return Array.from({ length: 24 }, (_, index) => {
            if (index >= endHour && index < startHour) {
              return index;
            }
          });
        }
      },
      disabledMinutes: (selectedHour) => {
        if (selectedHour === startHour) {
          return Array.from({ length: startMinute }, (_, index) => {
            return index;
          });
        }
        return [];
      },
      disabledSeconds: (selectedHour, selectedMinute) => {
        if (selectedHour == startHour) {
          if (selectedMinute === startMinute) {
            return Array.from({ length: startSecond }, (_, index) => index);
          }
        }
        return [];
      },
    };
  };
  checkValidation = (time) => {
    console.log("time", dayjs(time).format("HH:mm:ss"));
  };
  onFinish = (value) => {
    this.props.save(value);
  };
  validateStartTime = (_, value) => {
    if (dayjs(value) != dayjs(this.ref.current.getFieldValue(["startTime"]))) {
      return Promise.resolve();
    }
    return Promise.reject("Endtime Should be Greater Than Starttime");
  };
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
  handleAddBreakDetails = (data) => {
    this.props.form.setFieldValue("shiftBreakDetails", data);
    this.closeModal();
  };
  shiftCollisionValidation = () => {
    if (this.props.shiftMasterAssetWiseId) {
      if (!this.props.shiftDetailId) {
        this.service
          .list({ shiftMasterAssetWiseId: this.props.shiftMasterAssetWiseId })
          .then((res) => {
            if (res.data.length) {
              this.setState((state) => ({
                ...state,
                time: res.data[res.data.length - 1].endTime,
                startDay: this.props.form.getFieldValue("dayStart"),
                endDay: res.data[res.data.length - 1].dayEnd,
              }));
              const index = this.shiftDays.findIndex(
                (e) => res.data[res.data.length - 1].dayEnd === e.value
              );
              if (index !== 6) {
                arr = [];
                for (let i = index; i < 7; i++) {
                  arr.push(this.shiftDays[i]);
                }
              } else {
                arr = this.shiftDays;
              }
            }
          });
      } else {
        this.service
          .list({ shiftMasterAssetWiseId: this.props.shiftMasterAssetWiseId })
          .then((res) => {
            if (res.data.length) {
              const index = res.data.findIndex(
                (e) => e.shiftDetailId == this.props.shiftDetailId
              );
              const dayIndex = this.shiftDays.findIndex(
                (e) => res.data[index - 1].dayEnd === e.value
              );
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
                time: res.data[index - 1].endTime,
              }));
            }
          });
      }
    }
  };
  onFinish = (values) => {
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
    const { disabled, isAdd, editableId, isModalOpen } = this.state;
    // console.log("this.state.shift", this.state.shiftMasteDetails);
    return (
      <div>
        <Row justify="center" gutter={10}>
          {/* Other form fields */}
          <Col sm={4}>
            {this.props.form.getFieldValue("startTime") &&
            this.props.form.getFieldValue("endTime") ? (
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="button"
                  onClick={this.showModal}
                >
                  Next
                </Button>
              </Form.Item>
            ) : null}
          </Col>
        </Row>
        <Modal
          open={this.state.modalOpen}
          onCancel={this.closeModal}
          title="Break Stepper"
          destroyOnClose
          onOk={this.submitForm}
          width={800}
        >
          <BreakStepper
            ref={this.ref}
            shiftMasteDetails={this.state.shiftMasteDetails}
            save={this.getBreakData}
            shiftStartTime={this.props.form.getFieldValue("startTime")}
            shiftEndTime={this.props.form.getFieldValue("endTime")}
            shiftDayStart={this.props.form.getFieldValue("dayStart")}
            shiftDayEnd={this.props.form.getFieldValue("dayEnd")}
          />
        </Modal>
        <Form ref={this.ref} onFinish={this.onFinish}>
          <Form.List name="shiftBreakDetails">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={10}>
                    <Col sm={5}>
                      <Form.Item
                        {...restField}
                        name={[name, "description"]}
                        rules={[
                          {
                            required: true,
                            message: "Enter Description",
                          },
                        ]}
                      >
                        <Input placeholder="Enter Description" />
                      </Form.Item>
                    </Col>
                    <Col sm={5}>
                      <Form.Item
                        {...restField}
                        name={[name, "dayStart"]}
                        rules={[
                          {
                            required: true,
                            message: "Select Day Start",
                          },
                        ]}
                      >
                        <Select options={dayArr} />
                      </Form.Item>
                    </Col>
                    <Col sm={4}>
                      <Form.Item
                        {...restField}
                        name={[name, "startTime"]}
                        rules={[
                          {
                            required: true,
                            message: "Select Starttime",
                          },
                          {
                            validator: async (_, value) => {
                              const startTime =
                                this.ref.current.getFieldsValue(
                                  "shiftBreakdetails"
                                );
                              if (
                                dayjs(
                                  startTime.shiftBreakDetails[key].endTime
                                ).format("HH:mm:ss") >
                                dayjs(value).format("HH:mm:ss")
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject("Not Valid");
                            },
                          },
                        ]}
                      >
                        <TimePicker
                          placeholder="Select Start Time"
                          disabledTime={() =>
                            this.disabledTime(
                              fields.findIndex((field) => field.key === key)
                            )
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col sm={5}>
                      <Form.Item
                        {...restField}
                        name={[name, "dayEnd"]}
                        rules={[
                          {
                            required: true,
                            message: "Select Day End",
                          },
                        ]}
                      >
                        <Select options={dayArr} />
                      </Form.Item>
                    </Col>
                    <Col sm={4}>
                      <Form.Item
                        {...restField}
                        name={[name, "endTime"]}
                        validateTrigger={"onChange"}
                        rules={[
                          {
                            required: true,
                            message: "Select Endtime",
                          },
                          {
                            validator: async (_, value) => {
                              const startTime =
                                this.ref.current.getFieldsValue(
                                  "shiftBreakdetails"
                                );
                              if (
                                dayjs(
                                  startTime.shiftBreakDetails[key].startTime
                                ).format("HH:mm:ss") <
                                dayjs(value).format("HH:mm:ss")
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject("Not Valid");
                            },
                          },
                        ]}
                      >
                        <TimePicker
                          placeholder="Select End Time"
                          disabledTime={() =>
                            this.disabledTime(
                              fields.findIndex((field) => field.key === key)
                            )
                          }
                          onChange={this.checkValidation}
                        />
                      </Form.Item>
                    </Col>
                    <Col sm={1}>
                      <Tooltip title="Cancel">
                        <Button
                          onClick={() => remove(name)}
                          shape="circle"
                          danger
                        >
                          <CloseOutlined />
                        </Button>
                      </Tooltip>
                    </Col>
                  </Row>
                ))}

                <Form.Item>
                  <Button block type="default" onClick={() => add()}>
                    Add More
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </div>
    );
  }
}
export default ShiftandBreak;
