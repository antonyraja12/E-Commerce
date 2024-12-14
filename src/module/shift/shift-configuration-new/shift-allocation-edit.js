import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
// import { useAsset } from "../../../hooks/useAsset";
import { useShift } from "../../../hooks/useShift";
import ShiftAllocationService from "../../../services/shift-configuration/shift-allocation-service";
import { forwardRef, useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import ShiftMasterService from "../../../services/shift-configuration/shift-master-service";

function ShiftAllocationEdit(props, ref) {
  // const [assetLoading, assetData] = useAsset();
  const [shiftLoading, shiftData] = useShift();
  const [data, setData] = useState();
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const startTime = Form.useWatch("startTime", form);
  const endTime = Form.useWatch("endTime", form);
  const [shiftDetail, setShiftDetail] = useState(null);
  const shiftMasterId = Form.useWatch("shiftMasterId", form);
  const { shiftAllocationId } = props;
  useEffect(() => {
    let service = new ShiftAllocationService();
    service.retrieve(shiftAllocationId).then(({ data }) => {
      setData(data);

      form.setFieldsValue({
        ...data,
        assetId: data.assetId,
        shiftMasterId: data.shiftMasterId,
        shiftName: data.shiftName,
        shiftDate: dayjs(data.shiftDate),
        startDate: dayjs(data.startDate),
        endDate: dayjs(data.endDate),
        nextDay: data.nextDay,
        shiftAllocationBreaks: data.shiftAllocationBreaks.map((e) => ({
          ...e,
          description: e.description,
          startTime: dayjs(e.startTime),
          endTime: dayjs(e.endTime),
        })),
      });
    });
  }, [shiftAllocationId]);
  const onFinish = (value) => {
    const service = new ShiftAllocationService();
    setSaving(true);
    service
      .update(value, shiftAllocationId)
      .then((res) => {
        props.afterSave();
        if (res.status === 200) {
          message.success("Saved successfully");
        }
      })
      .finally(() => {
        setSaving(false);
      });
  };

  // const onChangeValue = (value) => {
  //   const shiftService = new ShiftMasterService();
  //   shiftService.retrieve(value).then(({ data }) => {
  //     setShiftDetail(data);
  //     form.setFieldValue("shiftName", data.shiftName);
  //   });
  // };
  // useEffect(() => {
  //   if (shiftDetail) {
  //     console.log(shiftDetail, "shiftDetail");

  //     form.setFieldsValue({
  //       shiftAllocationBreaks: shiftDetail?.shiftMasterBreaks.map((item) => ({
  //         description: item.description,
  //         startTime: dayjs(item.startTime),
  //         endTime: dayjs(item.endTime),
  //       })),
  //     });
  //   }
  // }, [shiftDetail]);

  const validateDates = (fieldName) => (_, value) => {
    const startDate = form.getFieldValue("startDate");
    const endDate = form.getFieldValue("endDate");

    if (fieldName === "startDate") {
      if (value && endDate && dayjs(value).isAfter(dayjs(endDate))) {
        return Promise.reject(new Error("Start date must be before end date"));
      }
    } else if (fieldName === "endDate") {
      if (startDate && value && dayjs(value).isBefore(dayjs(startDate))) {
        return Promise.reject(new Error("End date must be after start date"));
      }
    }

    return Promise.resolve();
  };

  return (
    <Form
      ref={ref}
      form={form}
      layout="horizontal"
      labelAlign="left"
      labelCol={{
        lg: {
          span: 6,
        },
        md: {
          span: 6,
        },
        sm: {
          span: 8,
        },
        xs: {
          span: 24,
        },
      }}
      wrapperCol={{
        lg: {
          span: 18,
        },
        md: {
          span: 18,
        },
        sm: {
          span: 16,
        },
        xs: {
          span: 24,
        },
      }}
      onFinish={onFinish}
      initialValues={{
        nextDay: false,
      }}
      colon={false}
    >
      <Row gutter={[40, 10]}>
        <Col md={24} sm={24} xs={24} lg={8}>
          {/* <Form.Item
            name="assetId"
            label="Assets"
            // rules={[{ required: true }]}
          >
            <Select
              disabled
              loading={assetLoading}
              options={assetData.options}
            />
          </Form.Item> */}
          <Form.Item
            name="shiftMasterId"
            label="Shift"
            rules={[{ required: true }]}
          >
            <Select
              disabled
              // onChange={onChangeValue}
              loading={shiftLoading}
              options={shiftData.options}
            />
          </Form.Item>
          <Form.Item
            name="shiftName"
            label="Shift Name"
            rules={[{ required: true }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item name="shiftDate" label="Date" rules={[{ required: true }]}>
            <DatePicker disabled format="DD-MM-YYYY" />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Starts On"
            rules={[
              { required: true },
              { validator: validateDates("startDate") },
            ]}
          >
            <DatePicker use12Hours format="DD-MM-YYYY hh:mm A" />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="Ends On"
            rules={[
              { required: true },
              { validator: validateDates("endDate") },
            ]}
          >
            <DatePicker use12Hours format="DD-MM-YYYY hh:mm A" />
          </Form.Item>
        </Col>
        <Col md={24} sm={24} xs={24} lg={16}>
          <Form.List name="shiftAllocationBreaks">
            {(fields, { add, remove }) => (
              <table className="parameter-table">
                <thead>
                  <tr>
                    <th width="40%">Description</th>
                    <th>Start</th>
                    <th>End</th>
                    <th width="40px"></th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map(({ name }) => (
                    <tr>
                      <td>
                        <Form.Item name={[name, "description"]} noStyle>
                          <Input style={{ width: "100%" }} />
                        </Form.Item>
                      </td>
                      {/* <td>
                        <Form.Item
                          label="Start Day"
                          name={[name, "dayStart"]}
                          noStyle
                        >
                          <Select
                            showSearch
                            options={dayOptionsBreak ?? []}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </td>  // */}
                      <td>
                        <Form.Item
                          label="Time"
                          name={[name, "startTime"]}
                          noStyle
                        >
                          <TimePicker
                            disabledTime={(now) => {
                              const disabledHours = () => {
                                const st = dayjs(startTime).get("h");
                                const et = dayjs(endTime).get("h");
                                let disabledHours = [];
                                if (st < et) {
                                  for (let i = 0; i < st; i++) {
                                    disabledHours.push(i);
                                  }
                                  for (let i = et; i < 24; i++) {
                                    disabledHours.push(i);
                                  }
                                } else {
                                  for (let i = et + 1; i < st; i++) {
                                    disabledHours.push(i);
                                  }
                                }
                                return disabledHours;
                              };
                              const disabledMinutes = (selectedHour) => {
                                return [];
                              };

                              return {
                                disabledHours,
                                disabledMinutes,
                              };
                            }}
                            showNow={false}
                            // use12Hours
                            // format="hh:mm A"
                            minuteStep={5}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </td>
                      {/* <td>
                        <Form.Item
                          label="End Day"
                          name={[name, "dayEnd"]}
                          noStyle
                        >
                          <Select
                            showSearch
                            options={dayOptionsBreak ?? []}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </td>  */}
                      <td>
                        <Form.Item
                          label="Time"
                          name={[name, "endTime"]}
                          noStyle
                        >
                          <TimePicker
                            showNow={false}
                            disabledTime={(now) => {
                              const disabledHours = () => {
                                const st = dayjs(startTime).get("h");
                                const et = dayjs(endTime).get("h");
                                let disabledHours = [];
                                if (st < et) {
                                  for (let i = 0; i < st; i++) {
                                    disabledHours.push(i);
                                  }
                                  for (let i = et; i < 24; i++) {
                                    disabledHours.push(i);
                                  }
                                } else {
                                  for (let i = et + 1; i < st; i++) {
                                    disabledHours.push(i);
                                  }
                                }
                                return disabledHours;
                              };
                              const disabledMinutes = (selectedHour) => {
                                return [];
                              };

                              return {
                                disabledHours,
                                disabledMinutes,
                              };
                            }}
                            // use12Hours
                            // format="hh:mm A"
                            minuteStep={5}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </td>
                      <td>
                        <CloseOutlined
                          onClick={() => {
                            remove(name);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan={4} align="right">
                      <Button type="dashed" onClick={() => add()} block>
                        + Add Break
                      </Button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </Form.List>

          <Form.Item hidden>
            <Button htmlType="submit">Save</Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default forwardRef(ShiftAllocationEdit);
