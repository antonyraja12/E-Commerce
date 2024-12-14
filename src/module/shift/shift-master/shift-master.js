import { CloseOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Space,
  Table,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import { forwardRef, useEffect, useRef, useState } from "react";
import { timeFormat } from "../../../helpers/url";
import ShiftMasterService from "../../../services/shift-configuration/shift-master-service";
import { AddButton } from "../../../utils/action-button/action-button";
const ShiftMasterForm = forwardRef(function ShiftMasterForm(props, ref) {
  const { shiftMasterId } = props;
  const [form] = Form.useForm();
  const startTime = Form.useWatch("startTime", form);
  const endTime = Form.useWatch("endTime", form);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (shiftMasterId) {
      const service = new ShiftMasterService();
      service
        .retrieve(shiftMasterId)
        .then(({ data }) => {
          form.setFieldsValue({
            ...data,
            startTime: data.startTime ? dayjs(data.startTime) : null,
            endTime: data.endTime ? dayjs(data.endTime) : null,
            shiftMasterBreaks: data.shiftMasterBreaks?.map((e) => ({
              ...e,
              startTime: e.startTime ? dayjs(e.startTime) : null,
              endTime: e.endTime ? dayjs(e.endTime) : null,
            })),
          });
        })
        .finally(() => {});
    }
  }, [shiftMasterId]);

  useEffect(() => {
    if (endTime && startTime) {
      let start = dayjs(startTime);
      let end = dayjs(endTime);
      if (end.isBefore(start)) end = end.add(1, "d");
      form.setFieldsValue({
        duration: end.diff(start, "m"),
      });
    }
  }, [startTime, endTime]);

  const onFinish = (value) => {
    const service = new ShiftMasterService();
    setSaving(true);
    let req;
    if (shiftMasterId) {
      req = service.update(value, shiftMasterId);
    } else {
      req = service.add(value);
    }

    req
      .then(({ data }) => {
        message.success("Saved Successfully");
        props.afterSave(true);
      })
      .finally(() => {
        setSaving(false);
      });
  };
  const calcEndTime = (index) => {
    const { startTime, breakDuration } = form.getFieldValue([
      "shiftMasterBreaks",
      index,
    ]);
    if (startTime && breakDuration) {
      const endTime = dayjs(startTime).add(breakDuration, "m");
      form.setFieldValue(["shiftMasterBreaks", index, "endTime"], endTime);
    } else {
      form.setFieldValue(["shiftMasterBreaks", index, "endTime"], undefined);
    }
    // const endTime = dayjs(startTime).add(breakDuration, "m");
    // form.setFieldValue(["shiftMasterBreaks", index, "endTime"], endTime);
  };
  return (
    <Form
      ref={ref}
      labelAlign="left"
      form={form}
      onFinish={onFinish}
      wrapperCol={{
        lg: {
          span: 16,
        },
        md: {
          span: 16,
        },
        sm: {
          span: 16,
        },
        xs: {
          span: 24,
        },
      }}
      labelCol={{
        lg: {
          span: 8,
        },
        md: {
          span: 8,
        },
        sm: {
          span: 8,
        },
        xs: {
          span: 24,
        },
      }}
      colon={false}
    >
      <Row gutter={[10, 10]}>
        <Col md={8} lg={8}>
          <Form.Item
            label="Shift Name"
            name="shiftName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Start Time"
            name="startTime"
            rules={[{ required: true, message: "Select start time" }]}
          >
            <TimePicker
              showNow={false}
              use12Hours
              format="hh:mm A"
              minuteStep={5}
            />
          </Form.Item>

          <Form.Item
            label="End Time"
            name="endTime"
            rules={[{ required: true, message: "Select end time" }]}
          >
            <TimePicker
              showNow={false}
              use12Hours
              format="hh:mm A"
              minuteStep={5}
            />
          </Form.Item>
          <Form.Item
            label="Duration (Mins)"
            name="duration"
            rules={[{ required: true, message: "Select duration" }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item label=" " hidden>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Col>
        <Col md={16} lg={16}>
          <Form.List name="shiftMasterBreaks">
            {(fields, { add, remove }) => (
              <table className="parameter-table">
                <thead>
                  <tr>
                    <th width="50%">Description</th>
                    <th>Start</th>
                    <th>Duration (Mins)</th>
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
                            format="HH:mm"
                            minuteStep={5}
                            style={{ width: "100%" }}
                            onChange={(val) => calcEndTime(name)}
                          />
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item
                          label="Duration"
                          name={[name, "breakDuration"]}
                          noStyle
                        >
                          <InputNumber
                            style={{ width: "100%" }}
                            onChange={(val) => calcEndTime(name)}
                          />
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item
                          label="Time"
                          name={[name, "endTime"]}
                          noStyle
                        >
                          <TimePicker
                            disabled
                            showNow={false}
                            disabledTime={(now) => {
                              // console.log(now);
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
                            format="HH:mm"
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
                    <td colspan={5} align="right">
                      <Button type="dashed" onClick={() => add()} block>
                        + Add Break
                      </Button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </Form.List>
        </Col>
      </Row>
    </Form>
  );
});

function ShiftMaster() {
  const ref = useRef();
  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      width: 80,
    },

    {
      title: "Shift Name",
      dataIndex: "shiftName",
      // width: 250,
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      render: (value) => {
        return timeFormat(value);
      },
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      render: (value) => {
        return timeFormat(value);
      },
    },
    {
      title: "Action",
      dataIndex: "shiftMasterId",
      align: "center",
      render: (value) => {
        return (
          <Space>
            <Button
              onClick={() => {
                onEdit(value);
              }}
              icon={<EditOutlined />}
              type="text"
            />

            <Button
              onClick={() => deleteData(value)}
              icon={<DeleteOutlined />}
              type="text"
            />
          </Space>
        );
      },
    },
  ];
  const [modal, setModal] = useState({
    open: false,
    title: "Add Shift Master",
  });
  const [data, setData] = useState({ loading: false, dataSource: [] });
  useEffect(() => {
    list();
  }, []);
  const list = () => {
    setData((state) => ({ ...state, loading: true }));
    const service = new ShiftMasterService();
    service
      .list()
      .then(({ data }) => {
        setData((state) => ({
          ...state,
          dataSource: data.map((e, i) => ({ ...e, sno: i + 1 })),
        }));
      })
      .finally(() => {
        setData((state) => ({ ...state, loading: false }));
      });
  };
  const deleteData = (id) => {
    Modal.confirm({
      title: "Delete",
      content: "Are you sure, you want to delete this record ?",
      onOk: () => {
        return new Promise((resolve, reject) => {
          const service = new ShiftMasterService();
          service
            .delete(id)
            .then(() => {
              message.success("Deleted Successfully");
              list();
              resolve();
            })
            .catch((err) => reject(err));
        });
      },
    });
  };
  const onAdd = () => {
    setModal({ open: true, title: "Add Shift Master" });
  };
  const onCancel = () => {
    setModal({ open: false });
  };
  const onEdit = (shiftMasterId) => {
    setModal({
      open: true,
      title: "Update Shift Master",
      shiftMasterId: shiftMasterId,
    });
  };
  const afterSave = () => {
    onCancel();
    list();
  };
  const onOk = () => {
    ref.current.submit();
  };
  return (
    <Card
      // title="Shift Master"
      extra={<AddButton onClick={onAdd} />}
    >
      <Table
        rowKey="shiftMasterId"
        size="small"
        columns={columns}
        bordered
        {...data}
      />
      <Modal
        {...modal}
        onCancel={onCancel}
        width={1100}
        destroyOnClose
        onOk={onOk}
      >
        <ShiftMasterForm
          ref={ref}
          shiftMasterId={modal.shiftMasterId}
          afterSave={afterSave}
        />
      </Modal>
    </Card>
  );
}

export default ShiftMaster;
