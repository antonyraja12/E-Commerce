import {
  Button,
  DatePicker,
  Input,
  Popover,
  Radio,
  Row,
  Col,
  Form,
  Select,
} from "antd";
import { useState, React, useEffect } from "react";
import moment from "moment";
import dayjs from "dayjs";
import { CalendarFilled } from "@ant-design/icons";
//import { useForm } from "antd/lib/form/Form";
const style = {
  formItem: {
    minWidth: "120px",
  },
};
const options = [
  { label: "Today", value: 1 },
  { label: "Weekly", value: 2 },
  { label: "Monthly", value: 3 },
  { label: "Yearly", value: 4 },
  { label: "CUSTOM", value: 5 },
];

const DateTabs = ({ change, visible, open, setOpen, onChangeMode }) => {
  const [form] = Form.useForm();
  // const [open, setOpen] = useState(false);
  const [mode, setMode] = useState();
  const initialValue = {
    mode: 2,

    startDate: dayjs().startOf("Week"),

    endDate: dayjs().endOf("D"),
  };
  const [filter, setFilter] = useState(initialValue);

  useEffect(() => {
    change(filter);
  }, []);

  const valueChange = (change, allValue) => {
    if (change.mode) {
      setMode(change.mode);
      setDate(change.mode);
      onChangeMode(change.mode);
    }
  };

  const setDate = (value) => {
    switch (value) {
      case 1:
        form.setFieldsValue({
          startDate: dayjs().startOf("D"),
          endDate: dayjs().endOf("D"),
        });
        break;
      case 2:
        form.setFieldsValue({
          startDate: dayjs().startOf("week"),
          endDate: dayjs().endOf("D"),
        });
        break;
      case 3:
        form.setFieldsValue({
          startDate: dayjs().startOf("M"),
          endDate: dayjs().endOf("D"),
        });
        break;
      case 4:
        form.setFieldsValue({
          startDate: dayjs().startOf("year"),
          endDate: dayjs().endOf("D"),
        });
        break;
      default:
        break;
    }
  };
  const finish = (data) => {
    setFilter(data);
    change(data);
    setOpen(false);
  };
  const formatDate = (date) => {
    return date ? date.format("DD-MM-YYYY") : "";
  };
  const handleClick = () => {
    setOpen(!open);
    //  console.log(open,"first")
  };
  const handleCancel = () => {
    setOpen(false);
    // console.log(open, "second");
  };
  const content = (
    <>
      <Form
        form={form}
        layout="vertical"
        // style={{ width: "200px" }}
        onValuesChange={valueChange}
        initialValues={initialValue}
        onFinish={finish}
        size="small"
      >
        <Form.Item label="Range" name="mode">
          <Select options={options} />
        </Form.Item>

        <Form.Item
          label="Start Date"
          name="startDate"
          style={{ width: "100%" }}
        >
          <DatePicker
          //   disabled={mode !== 5}
          // value={filter?.startDate}
          // showTime
          //   format="DD-MM-YYYY hh:mm:ss A"
          />
        </Form.Item>

        <Form.Item label="End Date" name="endDate" style={{ width: "100%" }}>
          <DatePicker
          //   disabled={mode !== 5}
          // value={filter?.endDate}
          // showTime
          //   format="DD-MM-YYYY hh:mm:ss A"
          />
        </Form.Item>
        <Row justify="space-between">
          <Col>
            <Button size="small" type="default" onClick={handleCancel}>
              Cancel
            </Button>
          </Col>
          <Col>
            <Button size="small" type="primary" htmlType="submit">
              Ok
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );

  return (
    <>
      <Input
        style={{ minWidth: "250px" }}
        suffix={
          <Popover
            open={open}
            content={content}
            title="Date Range"
            trigger="click"
            visible={visible}
          >
            <Button
              onClick={handleClick}
              size="small"
              icon={<CalendarFilled />}
              shape="circle"
              type="primary"
            ></Button>
          </Popover>
        }
        value={`${formatDate(filter.startDate)} to ${formatDate(
          filter.endDate
        )}`}
        readOnly
      />
    </>
  );
};
export default DateTabs;
