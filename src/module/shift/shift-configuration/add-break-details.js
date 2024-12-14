import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  TimePicker,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { Component, createRef } from "react";
let dayArr = [];
let shiftStartTime = "";
let shiftEndTime = "";
let breaks = "";
class AddBreakDetails extends Component {
  state = {
    breakDetails: [],
  };
  constructor() {
    super();
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
  render() {
    return (
      <>
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
      </>
    );
  }
}

export default AddBreakDetails;
