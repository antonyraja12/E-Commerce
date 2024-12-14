import {
  Form,
  Select,
  Input,
  Card,
  Button,
  message,
  Table,
  Space,
  TimePicker,
  Row,
  Col,
  Modal,
  Radio,
  Checkbox,
  Flex,
  Breadcrumb,
} from "antd";
import { useEffect, forwardRef, useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import AssetService from "../../../services/asset-service";
import ShiftMasterAssetWiseService from "../../../services/shift-configuration/shift-master-assetwise-service";
import { timeFormat } from "../../../helpers/url";
import ShiftMasterService from "../../../services/shift-configuration/shift-master-service";
import {
  CloseCircleOutlined,
  CloseOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import ShiftDetailsAssetwiseService from "../../../services/shift-configuration/shift-details-assetwise-service";
import BreadcrumbCustom from "../bread-crumb";
const dayOptions = [
  { value: "SUNDAY", label: "Sunday" },
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
];
function AssetMapping() {
  const dayOptions = [
    { value: "SUNDAY", label: "Sunday" },
    { value: "MONDAY", label: "Monday" },
    { value: "TUESDAY", label: "Tuesday" },
    { value: "WEDNESDAY", label: "Wednesday" },
    { value: "THURSDAY", label: "Thursday" },
    { value: "FRIDAY", label: "Friday" },
    { value: "SATURDAY", label: "Saturday" },
  ];
  const navigate = useNavigate();
  const [assetOptions, setAssetOptions] = useState({
    loading: false,
    options: [],
  });
  const [saving, setSaving] = useState(false);
  const onFinish = (value) => {
    const service = new ShiftMasterAssetWiseService();
    setSaving(true);
    service
      .add(value)
      .then(({ data }) => {
        message.success("Added Successfully");
        navigate(`?shiftMasterAssetWiseId=${data.shiftMasterAssetWiseId}`);
      })
      .finally(() => {
        setSaving(false);
      });
  };
  // useEffect(() => {
  //   setAssetOptions((state) => ({ ...state, loading: true }));
  //   const service = new AssetService();
  //   service
  //     .list({ active: true })
  //     .then(({ data }) => {
  //       let options = data.map((e) => ({
  //         label: e.assetName,
  //         value: e.assetId,
  //       }));
  //       setAssetOptions((state) => ({ ...state, options: options }));
  //     })
  //     .finally(() => {
  //       setAssetOptions((state) => ({ ...state, loading: false }));
  //     });
  // }, []);
  return (
    <Form
      labelAlign="left"
      onFinish={onFinish}
      wrapperCol={{ span: 12 }}
      labelCol={{
        span: 4,
      }}
    >
      <Form.Item label="Set Name" name="name">
        <Input />
      </Form.Item>
      {/* <Form.Item label="Asset" name="assetIds">
        <Select mode="multiple" {...assetOptions} />
      </Form.Item> */}

      {/* <Form.Item label="Recurrence" name="recurrence">
        <Select
          options={[
            { label: "Daily", value: "Daily" },
            { label: "Alternate Days", value: "Alternate Days" },
            {
              label: "Custom",
              value: "Custom",
            },
          ]}
        />
      </Form.Item>
      <Form.Item label="Days" name="days">
        <Checkbox.Group options={dayOptions} />
      </Form.Item> */}
      <Form.Item
        wrapperCol={{
          offset: 4,
          span: 16,
        }}
      >
        <Button loading={saving} htmlType="submit" type="primary">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
}
const ShiftConfigurationForm = forwardRef(function ShiftConfigurationForm(
  props,
  ref
) {
  const { shiftMasterAssetWiseId } = props;
  const [form] = Form.useForm();
  const startTime = Form.useWatch("startTime", form);
  const endTime = Form.useWatch("endTime", form);
  const [saving, setSaving] = useState(false);
  const [shiftDetail, setShiftDetail] = useState(null);
  const [shiftOptions, setShiftOptions] = useState({
    options: [],
    loading: false,
  });
  useEffect(() => {
    const service = new ShiftMasterService();
    setShiftOptions((state) => ({ ...state, loading: true }));
    service
      .list({ active: true })
      .then(({ data }) => {
        let options = data.map((e) => ({
          label: e.shiftName,
          value: e.shiftMasterId,
        }));
        setShiftOptions((state) => ({ ...state, options: options }));
      })
      .finally(() => {
        setShiftOptions((state) => ({ ...state, loading: false }));
      });
  }, []);

  const getShift = (value) => {
    const service = new ShiftMasterService();
    service.retrieve(value).then(({ data }) => {
      setShiftDetail(data);

      form.setFieldsValue({
        ...data,
        startTime: data.startTime ? dayjs(data.startTime) : null,
        endTime: data.endTime ? dayjs(data.endTime) : null,
        shiftBreakDetails: data.shiftMasterBreaks?.map((e) => ({
          ...e,
          startTime: e.startTime ? dayjs(e.startTime) : null,
          endTime: e.endTime ? dayjs(e.endTime) : null,
        })),
      });
    });
  };
  // useEffect(() => {
  //   if (shiftDetail && startTime) {
  //     const { shiftDuration, shiftName } = shiftDetail;
  //     let start = dayjs(startTime);
  //     let endTime = start.add(shiftDuration, "m");
  //     form.setFieldsValue({
  //       endTime: endTime,
  //       shiftName: shiftName,
  //     });
  //   }
  // }, [shiftDetail, startTime]);

  const onFinish = (value) => {
    const service = new ShiftDetailsAssetwiseService();
    setSaving(true);
    service
      .bulkAdd({
        ...value,
        shiftMasterAssetWiseId: Number(shiftMasterAssetWiseId),
      })
      .then(({ data }) => {
        message.success("Saved Successfully");
        props.afterSave(true);
      })
      .finally(() => {
        setSaving(false);
      });
  };
  return (
    <Form
      ref={ref}
      labelAlign="left"
      form={form}
      onFinish={onFinish}
      wrapperCol={{
        lg: {
          span: 19,
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
      labelCol={{
        lg: {
          span: 5,
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
      colon={false}
    >
      <Row gutter={[10, 10]}>
        <Col md={12} lg={12}>
          <Form.Item
            label="Shift Starts On"
            name="shiftDay"
            rules={[{ required: true, message: "Select shift day" }]}
          >
            <Radio.Group
              // showSearch
              options={[
                { label: "Same Day", value: "same" },
                { label: "Next Day", value: "next" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Shift Master"
            name="shiftMasterId"
            rules={[{ required: true, message: "Select shift type" }]}
          >
            <Select {...shiftOptions} onChange={getShift} />
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
              disabled
              showNow={false}
              use12Hours
              format="hh:mm A"
              minuteStep={5}
            />
          </Form.Item>
          <Form.Item
            label="Shift Name"
            name="shiftName"
            rules={[{ required: true, message: "Enter shift name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Days"
            name="days"
            rules={[{ required: true, message: "Select atlease 1 day" }]}
          >
            <Checkbox.Group options={dayOptions} />
          </Form.Item>
          <Form.Item label=" " hidden>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Col>
        <Col md={12} lg={12}>
          <Form.List name="shiftBreakDetails">
            {(fields, { add, remove }) => (
              <table className="parameter-table">
                <thead>
                  <tr>
                    <th width="50%">Description</th>
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
                      </td> */}
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
                      </td> */}
                      <td>
                        <Form.Item
                          label="Time"
                          name={[name, "endTime"]}
                          noStyle
                        >
                          <TimePicker
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
        </Col>
      </Row>
    </Form>
  );
});
const ShiftMappingForm = forwardRef(function ShiftMappingForm(props, ref) {
  const [form] = Form.useForm();
  const { shiftDetailId, shiftMasterAssetWiseId } = props;

  const [shiftOptions, setShiftOptions] = useState({
    options: [],
    loading: false,
  });

  const [dayOptionsBreak, setDayOptionsBreak] = useState(dayOptions);
  const dayStart = Form.useWatch("dayStart", form);
  const dayEnd = Form.useWatch("dayEnd", form);
  const startTime = Form.useWatch("startTime", form);
  const endTime = Form.useWatch("endTime", form);
  const [shiftDetail, setShiftDetail] = useState(null);
  useEffect(() => {
    if (dayStart && dayEnd) {
      setDayOptionsBreak(() => {
        let startIndex = dayOptions.findIndex((e) => e.value === dayStart);
        let endIndex = dayOptions.findIndex((e) => e.value === dayEnd);
        let options = [];
        for (let i = startIndex; i <= endIndex; i++) {
          options.push(dayOptions[i]);
        }
        return options ?? [];
      });
    }
  }, [dayStart, dayEnd]);

  useEffect(() => {
    const service = new ShiftMasterService();
    setShiftOptions((state) => ({ ...state, loading: true }));
    service
      .list({ active: true })
      .then(({ data }) => {
        let options = data.map((e) => ({
          label: e.shiftName,
          value: e.shiftMasterId,
        }));
        setShiftOptions((state) => ({ ...state, options: options }));
      })
      .finally(() => {
        setShiftOptions((state) => ({ ...state, loading: false }));
      });
  }, []);
  const onFinish = (value) => {
    const service = new ShiftDetailsAssetwiseService();
    let req;
    if (shiftDetailId) {
      req = service.update({ shiftMasterAssetWiseId, ...value }, shiftDetailId);
    } else req = service.add({ shiftMasterAssetWiseId, ...value });
    req.then((res) => {
      props.afterSave(res.data);
      if (res.status === 200) {
        message.success("Saved successfully");
      }
    });
  };

  useEffect(() => {
    if (shiftDetailId) {
      const service = new ShiftDetailsAssetwiseService();
      service.retrieve(shiftDetailId).then(({ data }) => {
        ref.current.setFieldsValue({
          ...data,
          endTime: dayjs(data.endTime),
          startTime: dayjs(data.startTime),
          shiftBreakDetails: data.shiftBreakDetails?.map((e) => ({
            ...e,
            endTime: dayjs(e.endTime),
            startTime: dayjs(e.startTime),
          })),
        });
      });
    }
  }, [shiftDetailId]);

  const getShift = (value) => {
    const service = new ShiftMasterService();
    service.retrieve(value).then(({ data }) => {
      setShiftDetail(data);
      form.setFieldValue("shiftName", data.shiftName);
    });
  };

  useEffect(() => {
    if (shiftDetail && dayStart) {
      const dayOpt = dayOptions.map((e) => e.value);
      const { duration, shiftMasterBreaks } = shiftDetail;
      const startTime = dayjs(shiftDetail.startTime).set(
        "day",
        dayOpt.indexOf(dayStart)
      );
      const endTime = startTime.add(duration, "m");
      const dayEnd = dayOpt[endTime.get("day")];

      form.setFieldsValue({
        startTime,
        endTime,
        dayEnd,
        shiftBreakDetails: shiftMasterBreaks?.map((e) => {
          const { description } = e;
          let st = dayjs(e.startTime);
          let bStartTime = startTime
            .set("h", st.get("h"))
            .set("m", st.get("m"))
            .set("s", 0);

          if (startTime.get("h") > st.get("h")) {
            bStartTime = bStartTime.add(1, "d");
          }

          let bEndTime = bStartTime.add(e.breakDuration, "m");

          const dayStart = dayOpt[bStartTime.get("d")];
          const dayEnd = dayOpt[bEndTime.get("d")];
          return {
            startTime: bStartTime,
            endTime: bEndTime,
            description,
            dayEnd,
            dayStart,
          };
        }),
      });
    }
  }, [shiftDetail, dayStart]);
  return (
    <Form
      ref={ref}
      labelAlign="left"
      form={form}
      onFinish={onFinish}
      wrapperCol={{
        lg: {
          span: 19,
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
      labelCol={{
        lg: {
          span: 5,
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
      colon={false}
    >
      <Row gutter={[40, 10]}>
        <Col md={24} sm={24} xs={24} lg={8}>
          <Form.Item
            label="Shift Day"
            name="shiftDay"
            rules={[{ required: true, message: "Select shift day" }]}
          >
            <Select showSearch options={dayOptions ?? []} />
          </Form.Item>
          <Form.Item label="Shift Master" name="shiftMasterId">
            <Select {...shiftOptions} onChange={getShift} />
          </Form.Item>
          <Form.Item label="Shift Name" name="shiftName">
            <Input />
          </Form.Item>
          <Form.Item label="Start">
            <Row gutter={10}>
              <Col span={16}>
                <Form.Item label="Day" name="dayStart" noStyle>
                  <Select showSearch options={dayOptions} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Time" name="startTime" noStyle>
                  <TimePicker disabled use12Hours format="hh:mm A" />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="End">
            <Row gutter={10}>
              <Col span={16}>
                <Form.Item label="Day" name="dayEnd" noStyle>
                  <Select showSearch options={dayOptions} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Time" name="endTime" noStyle>
                  <TimePicker disabled use12Hours format="hh:mm A" />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Col>
        <Col md={24} sm={24} xs={24} lg={16}>
          <Form.List name="shiftBreakDetails">
            {(fields, { add, remove }) => (
              <table className="parameter-table">
                <thead>
                  <tr>
                    <th width="25%">Description</th>
                    <th colSpan={2}>Start</th>
                    <th colSpan={2}>End</th>
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
                      </td>
                      <td>
                        <Form.Item
                          label="Time"
                          name={[name, "startTime"]}
                          noStyle
                        >
                          <TimePicker
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
                            style={{ width: "100%" }}
                            use12Hours
                            format="hh:mm A"
                          />
                        </Form.Item>
                      </td>
                      <td>
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
                      </td>
                      <td>
                        <Form.Item
                          label="Time"
                          name={[name, "endTime"]}
                          noStyle
                        >
                          <TimePicker
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
                            style={{ width: "100%" }}
                            use12Hours
                            format="hh:mm A"
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
                    <td colspan={6} align="right">
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

function ShiftMapping(props) {
  const ref = useRef();
  const ref2 = useRef();
  const [reload, setReload] = useState(0);
  const [form] = Form.useForm();
  const { shiftMasterAssetWiseId } = props;
  const [assetOptions, setAssetOptions] = useState({
    loading: false,
    options: [],
  });
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState({ open: false, title: "Add" });
  const [bulkAddModal, setBulkAddModal] = useState({
    open: false,
    title: "Bulk Add",
  });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const columns = [
    {
      title: "Name",
      dataIndex: "shiftName",
      render: (value, record, index) => {
        return (
          <Button
            size="small"
            type="link"
            onClick={() => onEditClick(record.shiftDetailId)}
          >
            {value}
          </Button>
        );
      },
    },
    {
      title: "Shift Day",
      dataIndex: "shiftDay",
    },
    {
      title: "Type",
      dataIndex: "shiftMaster",
      render: (value) => {
        return value?.shiftName;
      },
    },
    {
      title: "Start",
      children: [
        {
          title: "Day",
          dataIndex: "dayStart",
        },
        {
          title: "Time",
          dataIndex: "startTime",
          render: (value) => {
            return timeFormat(value);
          },
        },
      ],
    },
    {
      title: "End",
      children: [
        {
          title: "Day",
          dataIndex: "dayEnd",
        },
        {
          title: "Time",
          dataIndex: "endTime",
          render: (value) => {
            return timeFormat(value);
          },
        },
      ],
    },
  ];
  const onFinish = (value) => {
    const service = new ShiftMasterAssetWiseService();
    setSaving(true);
    service
      .update(value, shiftMasterAssetWiseId)
      .then(({ data }) => {
        message.success("Updated Successfully");
        setReload((state) => ++state);
        setEdit(false);
      })
      .finally(() => {
        setSaving(false);
      });
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // useEffect(() => {
  //   setAssetOptions((state) => ({ ...state, loading: true }));
  //   const service = new AssetService();
  //   service
  //     .list({ active: true })
  //     .then(({ data }) => {
  //       let options = data.map((e) => ({
  //         label: e.assetName,
  //         value: e.assetId,
  //       }));
  //       setAssetOptions((state) => ({ ...state, options: options }));
  //     })
  //     .finally(() => {
  //       setAssetOptions((state) => ({ ...state, loading: false }));
  //     });
  // }, []);
  useEffect(() => {
    if (shiftMasterAssetWiseId) {
      setLoading(true);
      const service = new ShiftMasterAssetWiseService();

      service
        .retrieve(shiftMasterAssetWiseId)
        .then(({ data }) => {
          form.setFieldsValue({
            name: data.name,
            assetIds: data.shiftAssetMappingList.map((e) => e.assetId),
          });
          setDataSource(data.shiftDetailAssetWises);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [shiftMasterAssetWiseId, reload]);
  const onAdd = () => {
    setModal({ open: true, title: "Add Shift" });
  };
  const onEdit = () => {
    if (selectedRowKeys.length > 0) {
      setModal({
        open: true,
        title: "Update Shift",
        shiftDetailId: selectedRowKeys[0],
      });
    }
  };
  const onEditClick = (id) => {
    setModal({
      open: true,
      title: "Update Shift",
      shiftDetailId: id,
    });
  };
  const onDelete = () => {
    Modal.confirm({
      title: "Delete",
      content:
        "Are you sure you want to proceed with deleting the selected item(s)?",
      onOk: () => {
        const service = new ShiftDetailsAssetwiseService();
        let deleteService = selectedRowKeys.map((id) => service.delete(id));
        setDeleting(true);
        Promise.all(deleteService)
          .then((e) => {
            message.success("Deleted Successfully");
            setReload((state) => ++state);
          })
          .catch((err) => {
            message.error(err.message);
          })
          .finally(() => {
            setDeleting(false);
          });
      },
      okText: "Yes",
      cancelText: "No",
    });
  };
  const onCancel = () => {
    setModal({ open: false });
  };

  const saveData = (data) => {
    ref.current.submit();
  };
  const afterSave = (data) => {
    onCancel();
    if (data) {
      setReload((state) => ++state);
    }
  };
  const onBulkAdd = () => {
    setBulkAddModal({ open: true, title: "Add Shift" });
  };
  const onBulkAddCancel = () => {
    setBulkAddModal({ open: false });
  };
  const saveBulkAddData = (data) => {
    ref2.current.submit();
  };
  const afterBulkAddSave = (data) => {
    onBulkAddCancel();
    if (data) {
      setReload((state) => ++state);
    }
  };
  const submitForm = () => {
    form.submit();
  };
  return (
    <>
      <Flex style={{ maxWidth: 900 }} gap={10} align="bottom">
        <div style={{ flexGrow: 1 }}>
          <Form
            disabled={!edit}
            labelAlign="left"
            form={form}
            onFinish={onFinish}
            wrapperCol={{ span: 18 }}
            labelCol={{
              span: 6,
            }}
          >
            <Form.Item label="Set Name" name="name">
              <Input />
            </Form.Item>
            {/* <Form.Item label="Asset" name="assetIds">
              <Select mode="multiple" {...assetOptions} />
            </Form.Item> */}

            <Form.Item
              hidden
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button
                // loading={saving}
                htmlType="submit"
                type="primary"
              >
                Save
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div>
          {edit ? (
            <Space>
              <Button
                shape="circle"
                icon={<CloseCircleOutlined />}
                onClick={() => setEdit(false)}
                loading={saving}
              />
              <Button
                shape="circle"
                onClick={submitForm}
                icon={<SaveOutlined />}
                loading={saving}
              />
            </Space>
          ) : (
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => setEdit(true)}
            />
          )}
        </div>
      </Flex>

      <Row gutter={10} justify="space-between">
        <Col>
          <Button
            type="primary"
            danger
            onClick={onDelete}
            disabled={selectedRowKeys.length === 0}
            loading={deleting}
          >
            Delete
          </Button>
        </Col>
        <Col>
          <Space>
            <Button
              type="primary"
              onClick={onEdit}
              disabled={selectedRowKeys.length !== 1}
            >
              Edit
            </Button>
            <Button type="primary" onClick={onAdd}>
              Add
            </Button>
            <Button type="primary" onClick={onBulkAdd}>
              Bulk Add
            </Button>
          </Space>
        </Col>
      </Row>
      <br />

      <Table
        rowSelection={rowSelection}
        rowKey="shiftDetailId"
        bordered
        size="small"
        columns={columns}
        dataSource={dataSource}
        loading={loading}
      />
      <Modal
        {...modal}
        onCancel={onCancel}
        width={1300}
        destroyOnClose
        okText="Save"
        onOk={saveData}
      >
        <ShiftMappingForm
          ref={ref}
          shiftDetailId={modal.shiftDetailId}
          shiftMasterAssetWiseId={shiftMasterAssetWiseId}
          afterSave={afterSave}
        />
      </Modal>

      <Modal
        {...bulkAddModal}
        onCancel={onBulkAddCancel}
        width={1300}
        destroyOnClose
        okText="Save"
        onOk={saveBulkAddData}
      >
        <ShiftConfigurationForm
          ref={ref2}
          shiftMasterAssetWiseId={shiftMasterAssetWiseId}
          afterSave={afterBulkAddSave}
        />
      </Modal>
    </>
  );
}

function ShiftConfigurationNew(props) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const params = useParams();
  const [shiftMasterAssetWiseId, setShiftMasterAssetWiseId] = useState(null);
  useEffect(() => {
    if (params.id) {
      setShiftMasterAssetWiseId(params.id);
    } else {
      setShiftMasterAssetWiseId(searchParams.get("shiftMasterAssetWiseId"));
    }
  }, [location]);
  return (
    <Card title="Shift configuration">
      {/* <BreadcrumbCustom /> */}
      {shiftMasterAssetWiseId ? (
        <>
          {/* <AssetMapping /> */}
          <ShiftMapping shiftMasterAssetWiseId={shiftMasterAssetWiseId} />
        </>
      ) : (
        <AssetMapping />
      )}
    </Card>
  );
}

export default ShiftConfigurationNew;
