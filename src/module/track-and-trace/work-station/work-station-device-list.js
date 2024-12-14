import React, { useEffect, useState } from "react";
import Page from "../../../utils/page/page";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import { DeleteOutlined, PlusOutlined, CloseOutlined } from "@ant-design/icons";
import WorkStationService from "../../../services/track-and-trace-service/work-station-service";
import { useParams } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import DeviceService from "../../../services/track-and-trace-service/device-service";
import { showDeleteConfirm } from "../../../utils/action-button/action-button";
import { withRouter } from "../../../utils/with-router";
import { subscribe } from "graphql";

function Devicelist(props) {
  const workStationService = new WorkStationService();
  const deviceService = new DeviceService();
  const [drawer, setDrawer] = useState({ open: false });
  const [datasource, setDataSource] = useState([]);
  const [deviceOption, setDeviceOption] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();
  const { id } = useParams();

  useEffect(() => {
    list();
    fetchDeviceOption();
  }, [id]);

  const fetchDeviceOption = async () => {
    setIsLoading(true);
    try {
      const response = await deviceService.list({ active: true });
      setDeviceOption(
        response.data?.map((e) => ({
          label: e.deviceName,
          value: e.deviceId,
        }))
      );
    } catch (error) {
      message.error("Failed to fetch device");
    } finally {
      setIsLoading(false);
    }
  };
  const list = () => {
    workStationService.listDevice(id).then((res) => {
      setDataSource(
        res.data.map((item) => ({
          ...item,
          key: item.deviceId,
        }))
      );
    });
  };

  const handleEdit = (deviceId, index) => {
    workStationService.retrieveDevice(id, deviceId).then(({ data }) => {
      form.setFieldsValue({
        ...data,
      });
    });
    setDrawer({ open: true, editing: true });
  };

  const handleDelete = async () => {
    try {
      showDeleteConfirm(async () => {
        for (let selectedIds of selectedRowKeys) {
          const response = await workStationService.deleteDevice(
            id,
            selectedIds
          );
          if (response.status !== 200) {
            message.error(`Failed to delete item with ID: ${id}`);
          }
        }
        message.success("Selected rows deleted successfully");
        list();
        setSelectedRowKeys([]);
      });
    } catch (error) {
      message.error("Failed to delete selected rows");
    }
  };
  const onClose = () => {
    setDrawer({ open: false });
    form.resetFields();
  };
  const onTableRowSelect = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };
  const onFinish = (value) => {
    workStationService
      .addorUpdateDevice(id, value.deviceId, value)
      .then((response) => {
        if (response.status == 200) {
          message.success("Saved successfully");
          onClose();
          list();
        } else {
          message.error("error");
        }
      });
  };

  const columns = [
    {
      title: "Connection Id",
      dataIndex: "connectionId",
      render: (value, record, index) => {
        return (
          <a onClick={() => handleEdit(record.deviceId, index)}>{value}</a>
        );
      },
    },
    {
      title: "URL",
      dataIndex: "url",
    },
    {
      title: "Protocol",
      dataIndex: "protocol",
    },
  ];

  const subscribeColumn = (remove) => [
    {
      title: "Tag",
      dataIndex: "tag",
      render: (value, _, index) => {
        return (
          <Form.Item
            rules={[{ required: true }]}
            name={[_.name, "tag"]}
            noStyle
          >
            <Input />
          </Form.Item>
        );
      },
    },
    {
      title: "Address",
      dataIndex: "address",
      render: (value, _, index) => {
        return (
          <Form.Item
            rules={[{ required: true }]}
            name={[_.name, "address"]}
            noStyle
          >
            <Input />
          </Form.Item>
        );
      },
    },
    {
      title: "",
      key: "remove",
      dataIndex: "address",
      render: (value, _, index) => {
        return (
          <Form.Item noStyle>
            <CloseOutlined onClick={() => remove(_.name)} />
          </Form.Item>
        );
      },
    },
  ];

  return (
    <>
      <Spin spinning={isLoading}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Row gutter={[10, 10]}>
            <Col span={24}>
              <Space>
                <Button
                  onClick={() => setDrawer({ open: true })}
                  type="primary"
                  size="small"
                  icon={<PlusOutlined />}
                >
                  Add
                </Button>
                <Button
                  size="small"
                  onClick={handleDelete}
                  disabled={selectedRowKeys.length === 0}
                  icon={<DeleteOutlined />}
                >
                  Delete
                </Button>
              </Space>
            </Col>
          </Row>

          <Table
            className="table"
            size="small"
            rowSelection={{
              type: "checkbox",
              onChange: onTableRowSelect,
              selectedRowKeys,
            }}
            dataSource={datasource}
            columns={columns}
            // pagination={false}
          />

          <Drawer
            size="large"
            onClose={onClose}
            open={drawer.open}
            title={drawer.editing ? "Edit Device" : "Add Device"}
            destroyOnClose
          >
            <Form layout="vertical" form={form} onFinish={onFinish}>
              <Row gutter={[10, 10]}>
                <Col span={24}>
                  <Form.Item
                    name="deviceId"
                    label="Device Name"
                    rules={[
                      { required: true, message: "Please select device" },
                    ]}
                  >
                    <Select
                      placeholder="Select Device"
                      options={deviceOption}
                      showSearch
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="connectionId"
                    label="Connection Id"
                    rules={[
                      { required: true, message: "Please enter connection id" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="url"
                    label="URL"
                    rules={[
                      { required: true, message: "Please enter device id" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item
                    name="protocol"
                    label="Protocol"
                    rules={[
                      { required: true, message: "Please enter device id" },
                    ]}
                  >
                    <Select
                      options={[
                        { label: "MQTT", value: "mqtt" },
                        { label: "OPC UA", value: "opcua" },
                        { label: "MODBUS TCP", value: "modbus-tcp" },
                        // { label: "Open Protocol", value: "open-protocol" },
                        { label: "Socket", value: "socket" },
                        { label: "Atlas Copco", value: "atlas-copco" },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Typography.Text>Subscription</Typography.Text>
                  <Form.List name="plcReads">
                    {(dataSub, { add, remove }) => (
                      <Table
                        size="small"
                        summary={() => (
                          <Table.Summary.Row>
                            <Table.Summary.Cell colSpan={8} align="center">
                              <Form.Item noStyle>
                                <Button type="dashed" onClick={() => add()}>
                                  Add
                                </Button>
                              </Form.Item>
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        )}
                        bordered
                        pagination={false}
                        columns={subscribeColumn(remove)}
                        dataSource={dataSub}
                      />
                    )}
                  </Form.List>
                </Col>

                {/* <Col span={24}>
                  <Form.Item
                    name="script"
                    label="Script"
                    rules={[{ required: true, message: "Please enter script" }]}
                  >
                    <Editor
                      className="jsEditor"
                      height="300px"
                      width="100%"
                      defaultLanguage="javascript"
                    />
                  </Form.Item>
                </Col> */}
              </Row>
              <Row>
                <Col>
                  <Button type="primary" htmlType="submit">
                    Save Device
                  </Button>
                </Col>
              </Row>
            </Form>
          </Drawer>
        </Space>
      </Spin>
    </>
  );
}
export default withRouter(Devicelist);
