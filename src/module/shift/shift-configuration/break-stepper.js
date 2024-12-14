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
  message,
} from "antd";
import dayjs from "dayjs";
import { Component, createRef } from "react";
import ShiftDetailsAssetwiseService from "../../../services/shift-configuration/shift-details-assetwise-service";
import ShiftMasterService from "../../../services/shift-configuration/shift-master-service";
let dayArr = [];
let shiftStartTime = "";
let shiftEndTime = "";
let breaks = "";
class BreakStepper extends Component {
  service = new ShiftDetailsAssetwiseService();
  shiftMasterService = new ShiftMasterService();
  state = {
    breakDetails: [],
    visible: false,
    shiftDetails: {},
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
    const { savedDetails } = this.props;
    if (savedDetails) {
      this.ref.current.setFieldsValue({
        dayEnd: savedDetails.dayEnd,
        dayStart: savedDetails.dayStart,
        startTime: savedDetails.startTime,
        endTime: savedDetails.endTime,
        shiftMasterAssetWiseId: savedDetails.shiftMasterAssetWiseId,
        shiftMasterId: savedDetails.shiftMasterId,
      });
    }
    const formValues = this.ref.current.getFieldsValue();
    const shiftDuration = this.props.shiftDuration;
    breaks = this.props.shiftMasteDetails;
    const noOfBreaks = this.props.shiftMasteDetails.length;
    const commonMinutes = shiftDuration / (noOfBreaks + 1);
    shiftStartTime = this.props.shiftStartTime;
    shiftEndTime = this.props.shiftEndTime;
    const dayStart = this.props.shiftDayStart;
    const dayEnd = this.props.shiftDayEnd;
    var mainStTime = null;
    const arr = [];
    const index1 = this.shiftDays.findIndex((e) => e.value === dayStart);
    const index2 = this.shiftDays.findIndex((e) => e.value === dayEnd);
    if (index1 !== index2) {
      dayArr = [];
      dayArr.push(this.shiftDays[index1]);
      dayArr.push(this.shiftDays[index2]);
    } else {
      dayArr = [];
      dayArr.push(this.shiftDays[index1]);
    }
    if (this.props.shiftDetailId) {
      this.ref.current.setFieldsValue({
        shiftBreakDetails: breaks.map((e, index) => ({
          description: e.description,
          startTime: dayjs(e.startTime),
          endTime: dayjs(e.endTime),
          dayStart: e.dayStart,
          dayEnd: e.dayEnd,
        })),
      });
    } else {
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
        // console.log("break", breakStartTime, breakEndTime);
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
  }
  startTimeChange = (time, index) => {
    const fields = this.ref.current.getFieldsValue();
    const { shiftBreakDetails } = fields;

    const endTimeField = [`shiftBreakDetails[${index}].endTime`];

    this.shiftMasterService
      .retrieve(this.props.shiftMasterId)
      .then(({ data }) => {
        Object.assign(shiftBreakDetails[index], {
          endTime: dayjs(time).add(
            data.shiftBreakMasters[index].breakDuration,
            "minutes"
          ),
        });
        this.ref.current.setFieldsValue({
          shiftBreakDetails,
        });
      });
  };

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
  handlePrev = () => {
    const { currentStep } = this.state;

    if (currentStep > 0) {
      this.setState((prevState) => ({
        currentStep: prevState.currentStep - 1,
      }));
    }
  };

  onFinish = (values) => {
    // console.log("val", values);
    if (
      dayjs(values.endTime).format("HH:mm:ss") !=
      dayjs(values.startTime)
        .add(this.props.shiftDuration, "minutes")

        .format("HH:mm:ss")
    ) {
      message.error(
        "Please ensure that the start time and end time fall within the configured shift hours and do not exceed or fall below them. "
      );

      return;
    }

    if (this.props.shiftDetailId) {
      this.service.update(values, this.props.shiftDetailId).then(({ data }) => {
        if (data.success) {
          message.success(data.message);

          this.props.closeModal();

          this.props.callBackSave();
        } else {
          message.error(data.message);
        }
      });
    } else {
      this.service.add(values).then(({ data }) => {
        if (data.success) {
          message.success(data.message);

          this.props.closeModal();
        } else {
          message.error(data.message);
        }
      });
    }
  };

  validateStartTime = (_, value) => {
    if (dayjs(value) != dayjs(this.ref.current.getFieldValue(["startTime"]))) {
      return Promise.resolve();
    }
    return Promise.reject("Endtime Should be Greater Than Starttime");
  };
  render() {
    const initialValues = {
      dayEnd: this.props.shiftDayEnd,
      dayStart: this.props.shiftDayStart,
      endTime: this.props.shiftEndTime,
      shiftMasterAssetWiseId: this.props.shiftMasterAssetWiseId,
      shiftMasterId: this.props.shiftMasterId,
      startTime: this.props.shiftStartTime,
      shiftName: this.props.shiftName,
    };
    return (
      <>
        <Form
          ref={this.ref}
          form={this.props.form}
          onFinish={this.onFinish}
          initialValues={initialValues}
        >
          <Form.Item hidden name="dayEnd">
            <Input />
          </Form.Item>
          <Form.Item hidden name="dayStart">
            <Input />
          </Form.Item>
          <Form.Item hidden name="endTime">
            <Input />
          </Form.Item>
          <Form.Item hidden name="shiftMasterAssetWiseId">
            <Input />
          </Form.Item>
          <Form.Item hidden name="shiftMasterId">
            <Input />
          </Form.Item>
          <Form.Item hidden name="startTime">
            <Input />
          </Form.Item>
          <Form.Item hidden name="shiftName">
            <Input />
          </Form.Item>
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
                        ]}
                      >
                        <TimePicker
                          placeholder="Select Start Time"
                          disabledTime={() =>
                            this.disabledTime(
                              fields.findIndex((field) => field.key === key)
                            )
                          }
                          onChange={(time) => this.startTimeChange(time, key)}
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
                <Row>
                  <Col sm={4}>
                    <Button onClick={this.props.prev}>Back</Button>
                  </Col>
                  <Col sm={{ span: 20 }} style={{ textAlign: "right" }}>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Form>
      </>
    );
  }
}

export default BreakStepper;
