import {
  Input,
  Col,
  Form,
  InputNumber,
  Row,
  Select,
  Space,
  Typography,
  Table,
  message,
  DatePicker,
  Spin,
} from "antd";
import React, { forwardRef, useEffect, useState } from "react";
import moment from "moment";
import MachineStatusService from "../../../services/oee/machine-status-service";
import DowntimeService from "../../../services/oee/downtime-service";
import DowntimeReasonService from "../../../services/oee/downtime-reason-service";
import dayjs from "dayjs";

function DowntimeReasonsSplitForm(props, ref) {
  console.log("props", props);
  const [form] = Form.useForm();
  const split = Form.useWatch("split", form);
  const [machineStatus, setMachineStatus] = useState(null);
  const [downtimeReason, setDowntimeReason] = useState([]);
  const [primaryReasonOption, setPrimaryOption] = useState([]);
  const [secondaryReasonOption, setSecondaryReasonOption] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const { machineStatusId, assetId } = props;

  useEffect(() => {
    processData();
  }, [split]);

  useEffect(() => {
    if (machineStatus) {
      let split = machineStatus?.downTime?.length;
      if (split === 0) {
        form.setFieldValue("split", 1);
      } else {
        let n = machineStatus?.downTime?.length;
        for (let i in machineStatus.downTime) {
          updatePrimaryReason(machineStatus.downTime[i].primaryReasonId, i);
        }
        form.setFieldsValue({
          items: machineStatus.downTime
            ?.sort((a, b) => {
              return dayjs(a.startTime).diff(dayjs(b.endTime));
            })
            ?.map((e) => ({
              startTime: dayjs(e?.startTime),
              endTime: dayjs(e?.endTime),
              duration: e.duration,
              // secondaryReasonId: e.secondaryReasonId,
              primaryReasonId: e.primaryReasonId,
              remarks: e.remarks,
            })),
        });
      }
    }
  }, [machineStatus]);

  useEffect(() => {
    const service = new MachineStatusService();
    const downtimeReasonService = new DowntimeReasonService();
    Promise.all([
      service.retrieve(machineStatusId),
      downtimeReasonService.list({ assetId: props.assetId }),
    ])
      .then((response) => {
        const machineStatusData = response[0].data;
        const downtimeReasonsData = response[1].data;
        setMachineStatus(machineStatusData);

        const filteredReasons = downtimeReasonsData?.filter((e) => {
          return e.parentId === null && e.assetId.includes(props.assetId);
        });
        setPrimaryOption(
          // response[1].data
          //   ?.filter((e) => e.parentId === null)
          filteredReasons?.map((e) => ({
            value: e.downtimeReasonId,
            label: e.downtimeReason,
          }))
        );
        setDowntimeReason(downtimeReasonsData);
      })
      .finally(() => {
        setLoading(false);
      });

    setLoading(true);
  }, [machineStatusId]);

  const processData = () => {
    let data = [];

    for (let i = 0; i < split; i++) {
      data.push({
        startTime: i === 0 ? dayjs(machineStatus?.startTime) : undefined,
        endTime: i === split - 1 ? dayjs(machineStatus?.endTime) : undefined,
        duration: null,
        // secondaryReasonId: null,
        primaryReasonId: null,
        remarks: null,
      });
    }
    let arr = calculateDuration(data);
    form.setFieldValue("items", arr);

    setSecondaryReasonOption((state) => {
      let data = [];
      for (let i = 0; i < split; i++) {
        data.push();
      }
      // console.log("data", data);
      return data;
    });
  };

  const updatePrimaryReason = (parentId, index) => {
    setSecondaryReasonOption((state) => {
      let arr = [...state];
      arr[index] = downtimeReason
        ?.filter((e) => e.parentId === parentId)
        ?.map((e) => ({
          value: e.downtimeReasonId,
          label: e.downtimeReason,
        }));
      return arr;
    });
  };

  const updateMins = (mins, index) => {
    let array = form.getFieldValue("items");

    let obj = array[index];
    obj.endTime = dayjs(obj.startTime).add(mins, "minute");

    array[index] = obj;

    let n = split - 1;
    let nextIndex = Number(index) + 1;
    if (index !== n) {
      let nextRecord = array[nextIndex];
      array[nextIndex] = {
        ...nextRecord,
        startTime: obj.endTime,
      };
    }

    if (nextIndex !== n) {
      for (let i = nextIndex; i < split; i++) {
        array[i] = { ...array[i], duration: 0 };
      }
    }
    let arr = calculateDuration(array);
    form.setFieldValue("items", arr);
  };

  const calculateDuration = (array) => {
    let lastRecord = array[array.length - 1];
    if (
      dayjs(lastRecord?.endTime).isValid() &&
      dayjs(lastRecord?.startTime).isValid()
    ) {
      let duration = dayjs(lastRecord?.endTime).diff(
        dayjs(lastRecord?.startTime),
        "minute"
      );

      return [...array.slice(0, -1), { ...lastRecord, duration: duration }];
    } else return array;
  };

  const onFinish = (data) => {
    setLoading(true);
    const service = new DowntimeService();
    service
      .add(machineStatusId, data.items)
      .then(({ data }) => {
        message.success("Saved successfully");
        if (props.afterSave) props.afterSave(data);
      })

      .finally(() => {
        setLoading(false);
      });
  };

  const onValuesChange = (changedValue, allValue) => {
    if (changedValue.items) {
      for (let i in changedValue.items) {
        if (changedValue.items[i].duration) {
          updateMins(changedValue.items[i].duration, i);
        }
      }
    }
  };

  return (
    <>
      <Spin spinning={isLoading}>
        <Form
          ref={ref}
          onFinish={onFinish}
          onValuesChange={onValuesChange}
          form={form}
          layout="inline"
        >
          <Row gutter={[5, 5]}>
            <Col>
              <Form.Item name="split" label="No of split">
                <InputNumber max={5} min={1} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.List name="items">
                {(fields, { add, remove }) => (
                  <table className="sj-table">
                    <tr>
                      <th>S.No</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Loss Time (Mins)</th>
                      <th>Primary Reason</th>
                      {/* <th>Secondary Reason</th> */}

                      <th>Remarks</th>
                    </tr>
                    {fields.map((field, index) => (
                      <tr>
                        <td>{index + 1}</td>
                        <td>
                          <Form.Item noStyle name={[field.name, "startTime"]}>
                            <DatePicker
                              format="DD-MM-YYYY hh:mm:ss A"
                              disabled
                            />
                          </Form.Item>
                        </td>
                        <td>
                          <Form.Item noStyle name={[field.name, "endTime"]}>
                            <DatePicker
                              format="DD-MM-YYYY hh:mm:ss A"
                              disabled
                            />
                          </Form.Item>
                        </td>
                        <td>
                          <Form.Item
                            noStyle
                            name={[field.name, "duration"]}
                            rules={[
                              { required: true, message: "Field is required" },
                              {
                                type: "number",
                                min: 1,
                                message: "Less than 1 min",
                              },
                            ]}
                          >
                            <InputNumber
                              // min={1}
                              precision={0}
                              readOnly={index === split - 1}
                            />
                          </Form.Item>
                        </td>
                        <td>
                          <Form.Item
                            noStyle
                            name={[field.name, "primaryReasonId"]}
                            rules={[
                              { required: true, message: "Field is required" },
                            ]}
                          >
                            <Select
                              style={{ width: "100%" }}
                              options={primaryReasonOption}
                              showSearch
                              onChange={(v) => {
                                updatePrimaryReason(v, index);
                              }}
                              allowClear
                            />
                          </Form.Item>
                        </td>

                        <td>
                          <Form.Item noStyle name={[field.name, "remarks"]}>
                            <Input.TextArea />
                          </Form.Item>
                        </td>
                      </tr>
                    ))}
                  </table>
                )}
              </Form.List>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  );
}

export default forwardRef(DowntimeReasonsSplitForm);
