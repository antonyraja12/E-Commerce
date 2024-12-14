import {
  Button,
  Col,
  Empty,
  Form,
  message,
  Row,
  Select,
  Typography,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import DowntimeReasonService from "../../../services/track-and-trace-service/downtime-reason-service";
import LossReasonService from "../../../services/track-and-trace-service/loss-reason-service";
import WorkStationInstanceService from "../../../services/track-and-trace-service/work-station-instance-service";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";

const { Title, Text } = Typography;

const DowntimeForm = (props) => {
  const { form, open, title, onClose, id, name } = props;
  const lossReasonService = new LossReasonService();
  const service = new DowntimeReasonService();
  const instanceService = new WorkStationInstanceService();
  const [data, setData] = useState([]);
  const [instanceData, setInstanceData] = useState([]);
  const [primaryReasonOption, setPrimaryReasonOption] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    if (open) {
      fetchInstance();
      fetchLoss();
      fetchDowntime();
    }
  }, [open]);
  const colors = [
    {
      name: "Pallet Release",
      color: "#13D048",
      prop: "palletRelease",
    },
    {
      name: "Material Call",
      color: "#FFD600",
      prop: "materialCall",
    },
    {
      name: "Work Delay",
      color: "#FF5353",
      prop: "workDelay",
    },
    {
      name: "Maintenance Call",
      color: "#1890FF",
      prop: "maintenanceCall",
    },
    {
      name: "Quality Call",
      color: "#000000",
      prop: "qualityCall",
    },
  ];
  const headerStyle = {
    display: "flex",
    justifyContent: "space-around",
    backgroundColor: "#f7f8fd",
    borderRadius: "5px",
    padding: "10px",
    alignItems: "center",
    marginBottom: "20px",
  };
  const TextColor = {
    color: "#999999",
  };
  const fetchLoss = () => {
    lossReasonService
      .list()
      .then((response) => {
        setPrimaryReasonOption(
          response.data?.map((e) => ({
            label: e.lossReason,
            value: e.lossReasonId,
          }))
        );
      })
      .catch((error) => {
        message.error("Failed to fetch loss reasons");
      });
  };

  const fetchDowntime = () => {
    service
      .getShiftDownTime(id)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        message.error("Failed to fetch downtime");
      });
  };
  const fetchInstance = () => {
    instanceService
      .retrieve(id)
      .then((response) => {
        const jobOrderData = response.data?.properties?.jobOrder;
        const jobOrder =
          typeof jobOrderData === "string"
            ? JSON.parse(response.data?.properties?.jobOrder)
            : jobOrderData;
        setInstanceData({
          ...response.data,
          model: jobOrder?.model,
          variant: jobOrder?.variant,
        });
      })
      .catch((error) => {
        console.log(error);

        message.error("Failed to fetch instance");
      });
  };

  const handleEditToggle = (index) => {
    if (editingIndex === index) {
      form.submit();
    } else {
      setEditingIndex(index);
      const downtime = data[index];
      form.setFieldsValue({
        lossReasonId: downtime.lossReason?.lossReasonId,
      });
    }
  };

  const onFinish = (values) => {
    const downtimeToEdit = data[editingIndex];
    const updatedValues = {
      ...downtimeToEdit,
      lossReasonId: values.lossReasonId,
    };

    service
      .update(updatedValues, downtimeToEdit.assemblyDetailId)
      .then(() => {
        message.success("Downtime updated successfully");
        setEditingIndex(null);
        fetchDowntime();
      })
      .catch((error) => {
        message.error("Failed to update downtime");
      });
  };
  const getFirstActiveColor = (value) => {
    if (!value || !value.properties) {
      return null;
    }
    return colors.find((color) => value.properties[color.prop]);
  };

  const activeColor = getFirstActiveColor(instanceData);

  return (
    <Popups
      destroyOnClose
      title={title}
      width={800}
      open={open}
      onCancel={() => {
        form.resetFields();
        setEditingIndex(null);
        onClose();
      }}
      footer={[
        <Row justify="space-between">
          <Col>
            <Button
              key="close"
              onClick={() => {
                form.resetFields();
                setEditingIndex(null);
                onClose();
              }}
            >
              Cancel
            </Button>
          </Col>
        </Row>,
      ]}
    >
      <div style={headerStyle}>
        <div>
          <Text strong style={TextColor}>
            Station Name
          </Text>
          <Title level={5} style={{ margin: 0 }}>
            {instanceData?.workStationName}
          </Title>
        </div>
        <div>
          <Text strong style={TextColor}>
            Model
          </Text>
          <Title level={5} style={{ margin: 0 }}>
            {instanceData?.model ? instanceData.model : "-"}
          </Title>
        </div>
        <div>
          <Text strong style={TextColor}>
            Variant
          </Text>
          <Title level={5} style={{ margin: 0 }}>
            {instanceData?.variant ? instanceData.variant : "-"}
          </Title>
        </div>
        <div>
          <Text strong style={TextColor}>
            Seat Type
          </Text>
          <Title level={5} style={{ margin: 0 }}>
            Driver
          </Title>
        </div>
        <div>
          <Text strong style={TextColor}>
            Build Label
          </Text>
          <Title level={5} style={{ margin: 0 }}>
            {instanceData?.properties?.buildLabel
              ? instanceData.properties.buildLabel
              : "-"}
          </Title>
        </div>
        <div>
          <Text strong style={TextColor}>
            Status
          </Text>
          <Title level={5} style={{ margin: 0, color: activeColor?.color }}>
            {activeColor?.name ? activeColor.name : "-"}
          </Title>
        </div>
      </div>

      <Title level={5}>Downtime Reason</Title>
      {data.length > 0 ? (
        <table className="sj-table">
          <thead>
            <tr style={{ backgroundColor: "#EEEEEE" }}>
              <th>S.No</th>
              <th style={{ width: "150px" }}>Build Label</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Diff (in seconds)</th>
              <th style={{ width: "200px" }}>Reason</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((field, index) => {
              const endtime =
                field.endTime !== null && field.endTime !== undefined
                  ? field.endTime
                  : new Date();
              const startTime = dayjs(field.startTime);
              const endTime = dayjs(endtime);
              const timeDiff = endTime.diff(startTime, "second");

              return (
                <tr key={field.tatDownTimeId}>
                  <td>{index + 1}</td>
                  <td>{field.buildLabel}</td>
                  <td>{startTime.format("HH:mm:ss")}</td>
                  <td>{endTime.format("HH:mm:ss")}</td>
                  <td>{timeDiff}</td>
                  <td style={{ width: "200px" }}>
                    {editingIndex === index ? (
                      <Form
                        form={form}
                        layout="inline"
                        onFinish={onFinish}
                        style={{ width: "100%" }}
                      >
                        <Form.Item
                          style={{ width: "100%" }}
                          name="lossReasonId"
                          rules={[
                            { required: true, message: "Field is required" },
                          ]}
                          noStyle
                        >
                          <Select
                            style={{ width: "100%" }}
                            options={primaryReasonOption}
                            showSearch
                            optionFilterProp="label"
                            allowClear
                          />
                        </Form.Item>
                      </Form>
                    ) : (
                      <span>
                        {field.lossReason != null
                          ? field.lossReason?.lossReason
                          : "-"}
                      </span>
                    )}
                  </td>
                  <td>
                    <Button type="link" onClick={() => handleEditToggle(index)}>
                      {editingIndex === index ? "Save" : "Edit"}
                    </Button>
                    {editingIndex === index && (
                      <Button type="link" onClick={() => setEditingIndex(null)}>
                        Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <Empty />
      )}
    </Popups>
  );
};

export default withForm(DowntimeForm);
