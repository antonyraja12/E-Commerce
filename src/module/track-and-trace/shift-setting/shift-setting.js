import {
  Button,
  DatePicker,
  Empty,
  Form,
  message,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import ShiftAllocationService from "../../../services/shift-configuration/shift-allocation-service";
import Page from "../../../utils/page/page";
import { withRouter } from "../../../utils/with-router";
import useCrudOperations from "../utils/useCrudOperation";

const { Title } = Typography;

const ShiftSetting = (props) => {
  const title = "Shift Setting";
  const { access } = props;
  const [form] = Form.useForm();
  const [editingIndex, setEditingIndex] = useState(null);
  const service = new ShiftAllocationService();
  const filters = {
    startDate: dayjs().startOf("day").toISOString(),
    endDate: dayjs().endOf("day").toISOString(),
  };
  const { data, fetchData } = useCrudOperations(service, filters);

  const handleEditToggle = (index) => {
    if (editingIndex === index) {
      form.submit();
    } else {
      setEditingIndex(index);
      const shift = data[index];
      form.setFieldsValue({
        startTime: dayjs(shift.startDate),
        endTime: dayjs(shift.endDate),
      });
    }
  };

  const onFinish = (values, index) => {
    const shiftToEdit = data[index];
    const updatedValues = {
      shiftAllocationBreaks: shiftToEdit.shiftAllocationBreaks,
      startDate: values.startTime,
      endDate: values.endTime,
    };

    service
      .update(updatedValues, shiftToEdit?.shiftAllocationId)
      .then((res) => {
        if (res.status === 200) {
          message.success("Shift Updated successfully");
          setEditingIndex(null);
          fetchData(filters);
        }
      })
      .catch((err) => {
        console.error("Error updating shift:", err);
      });
  };

  const getDisabledDatesAndHours = (time, isStart) => {
    const disabledHours = () => {
      const hours = [];
      if (time) {
        const selectedTime = dayjs(time);
        const startHour = selectedTime.hour();

        for (let i = 0; i < 24; i++) {
          if (isStart) {
            if (i < startHour - 2 || i > startHour + 2) {
              hours.push(i);
            }
          } else {
            const endHour = selectedTime.hour();
            if (i < endHour - 2 || i > endHour + 2) {
              hours.push(i);
            }
          }
        }
      }
      return hours;
    };

    const disabledDate = (current) => {
      if (!time) return false;

      const selectedTime = dayjs(time);
      const minDate = selectedTime.subtract(2, "hours").startOf("minute");
      const maxDate = selectedTime.add(2, "hours").endOf("minute");

      return current.isBefore(minDate) || current.isAfter(maxDate);
    };

    return {
      disabledHours,
      disabledDate,
    };
  };

  const startDateProps = getDisabledDatesAndHours(
    form.getFieldValue("startTime"),
    true
  );

  const endDateProps = getDisabledDatesAndHours(
    form.getFieldValue("endTime"),
    false
  );
  const columns = [
    {
      title: "Shift Name",
      dataIndex: "shiftName",
      key: "shiftName",
      width: 200,
    },
    {
      title: "Start Time",
      dataIndex: "startDate",
      key: "startDate",
      width: 200,
      render: (text, record, index) =>
        editingIndex === index ? (
          <Form.Item
            name="startTime"
            dependencies={["endTime"]}
            rules={[
              { required: true, message: "Start time is required" },
              {
                validator: (_, value) => {
                  if (!value || !form.getFieldValue("endTime")) {
                    return Promise.resolve();
                  }
                  const startTime = dayjs(value, "HH:mm");
                  const endTime = dayjs(form.getFieldValue("endTime"), "HH:mm");
                  if (endTime.isBefore(startTime)) {
                    return Promise.reject(
                      new Error("Start time must be less than end time")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
            style={{ margin: 0 }}
          >
            <DatePicker
              showNow={false}
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{ disabledHours: startDateProps.disabledHours }}
              disabledDate={startDateProps.disabledDate}
            />
          </Form.Item>
        ) : (
          <Tag color="blue">{dayjs(text).format("HH:mm:ss")}</Tag>
        ),
    },
    {
      title: "End Time",
      dataIndex: "endDate",
      key: "endDate",
      width: 200,
      render: (text, record, index) =>
        editingIndex === index ? (
          <Form.Item
            name="endTime"
            dependencies={["startTime"]}
            rules={[
              { required: true, message: "End time is required" },
              {
                validator: (_, value) => {
                  if (!value || !form.getFieldValue("startTime")) {
                    return Promise.resolve();
                  }
                  const startTime = dayjs(
                    form.getFieldValue("startTime"),
                    "HH:mm"
                  );
                  const endTime = dayjs(value, "HH:mm");
                  if (endTime.isBefore(startTime)) {
                    return Promise.reject(
                      new Error("End time must be greater than start time")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
            style={{ margin: 0 }}
          >
            <DatePicker
              showNow={false}
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{ disabledHours: endDateProps.disabledHours }}
              disabledDate={endDateProps.disabledDate}
            />
          </Form.Item>
        ) : (
          <Tag color="magenta">{dayjs(text).format("HH:mm:ss")}</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record, index) => (
        <Space>
          <Button type="primary" onClick={() => handleEditToggle(index)}>
            {editingIndex === index ? "Save" : "Edit"}
          </Button>
          {editingIndex === index && (
            <Button type="primary" onClick={() => setEditingIndex(null)}>
              Cancel
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Page
      action={
        <Title level={5} style={{ margin: 0 }}>
          {dayjs().format("MMMM D, YYYY")}
        </Title>
      }
    >
      {data.length === 0 ? (
        <Empty description="No Shift" />
      ) : (
        <Form
          form={form}
          layout="inline"
          onFinish={(values) => onFinish(values, editingIndex)}
        >
          <Table
            dataSource={data}
            columns={columns}
            rowKey="shiftAllocationId"
            style={{ width: "100%" }}
          />
        </Form>
      )}
    </Page>
  );
};

export default withRouter(ShiftSetting);
