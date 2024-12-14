import React, { useEffect, useState } from "react";
import {
  Upload,
  Button,
  Table,
  Tag,
  Space,
  Input,
  Form,
  Select,
  Badge,
  Modal,
  message,
  Row,
  Col,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  SaveOutlined,
  DownloadOutlined,
  CloseOutlined,
  EditOutlined,
  CheckOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import Page from "../../../utils/page/page";
import { withRouter } from "../../../utils/with-router";
import { withAuthorization } from "../../../utils/with-authorization";
import LineMasterService from "../../../services/track-and-trace-service/line-master-service";
import useCrudOperations from "../utils/useCrudOperation";
import DeviceService from "../../../services/track-and-trace-service/device-service";
import CustomizeModel from "../utils/customizeModel";
import DeviceTypeService from "../../../services/track-and-trace-service/device-type-service";
import { EditButton } from "../../../utils/action-button/action-button";
const { Option } = Select;

const Device = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deviceTypeName, setDeviceTypeName] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [deviceList, setDeviceList] = useState([]);
  const deviceService = new DeviceService();
  const deviceTypeService = new DeviceTypeService();
  const isEditing = (record) => record.deviceId === editingKey;
  const {
    data,
    selectedRowKeys,
    setSelectedRowKeys,
    handleUpload,
    handleDelete,
    handleDownload,
    editingKey,
    setEditingKey,
    form,
    save,
    cancel,
  } = useCrudOperations(deviceService);
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    setDeviceList(data);
  }, [data]);
  const fetchData = async () => {
    try {
      const response = await deviceTypeService.list();

      setDeviceTypeName(response.data);
    } catch (error) {
      message.error("Failed to fetch data");
    }
  };
  const edit = (record) => {
    form.setFieldsValue({
      // deviceName: record.deviceName || "",
      deviceTypeName: record.deviceType?.deviceTypeName,
      // status: record.status,
      ...record,
    });

    setEditingKey(record.deviceId);
  };

  const columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      dataIndex: "deviceName",
      key: "deviceName",
      title: "Name",
      editable: true,
      width: 250,
    },
    {
      dataIndex: "deviceType",
      key: "deviceType",
      title: "Type",
      width: 250,
      editable: true,

      render: (deviceType) => (
        <span>{deviceType ? deviceType.deviceTypeName : "N/A"}</span>
      ),
    },

    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: 150,
      editable: true,

      render: (value) => (
        // <Tag color={value === true ? "green" : "red"}>
        //   {value ? "Active" : "Inactive"}
        // </Tag>
        <Badge
          color={value ? "green" : "#cccccc"}
          text={value ? "Active" : "Inactive"}
        />
      ),
    },
    {
      title: "Action",
      key: "deviceId",
      width: 50,
      align: "center",
      fixed: "right",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button
              icon={<CheckOutlined />}
              type="primary"
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              onClick={() => save(record.deviceId)}
            />
            <Button
              icon={<CloseOutlined />}
              type="primary"
              danger
              onClick={cancel}
            />
          </Space>
        ) : (
          <Space>
            <EditButton
              onClick={() => edit(record)}
              disabled={editingKey !== ""}
            />
          </Space>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === "status" || col.dataIndex === "deviceType"
            ? "select"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    inputType,
    editing,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex === "deviceType" ? "deviceTypeName" : dataIndex}
            style={{ margin: 0 }}
            rules={[{ required: true, message: `Please Input ${title}!` }]}
          >
            {dataIndex === "status" && inputType === "select" ? (
              <Select>
                <Option value={true}>Active</Option>
                <Option value={false}>Inactive</Option>
              </Select>
            ) : dataIndex === "deviceType" && inputType === "select" ? (
              <Select>
                {deviceTypeName
                  ?.filter((e) => e.status)
                  ?.map((e) => (
                    <Option key={e.deviceTypeName} value={e.deviceTypeName}>
                      {e.deviceTypeName}
                    </Option>
                  ))}
              </Select>
            ) : (
              <Input />
            )}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const filter = (e) => {
    let s = e.target.value.toLowerCase();
    let result = data.filter((e) => {
      return e.deviceName?.toLowerCase().includes(s);
    });
    setSearchValue(s);
    setDeviceList(result);
  };
  return (
    <Page
      // title="Device"
      action={
        <Space>
          {
            <>
              <Button
                icon={<DeleteOutlined />}
                onClick={handleDelete}
                disabled={selectedRowKeys.length === 0}
              >
                Delete
              </Button>

              <Button
                icon={<DownloadOutlined />}
                onClick={() => {
                  handleDownload("device");
                }}
              >
                Download
              </Button>
            </>
          }
          <Button
            type="primary"
            onClick={() => setIsModalVisible(true)}
            icon={<UploadOutlined />}
          >
            Upload
          </Button>
        </Space>
      }
    >
      <Form form={form} component={false}>
        <Row justify="space-between">
          <Col span={7}>
            <Form>
              <Form.Item>
                <Input
                  prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
                  value={searchValue}
                  onChange={filter}
                  placeholder={"Search..."}
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Table
          size="small"
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          rowKey="deviceId"
          columns={mergedColumns}
          dataSource={deviceList}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          // onRow={(record) => ({
          //   onClick: () => {
          //     if (!isEditing(record)) {
          //       edit(record);
          //     }
          //   },
          // })}
        />
      </Form>
      <CustomizeModel
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        handleUpload={handleUpload}
      />
    </Page>
  );
};

export default withRouter(withAuthorization(Device));
