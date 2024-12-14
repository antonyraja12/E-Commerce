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
  CloseOutlined,
  EditOutlined,
  CheckOutlined,
  DownloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import Page from "../../../utils/page/page";
import { withRouter } from "../../../utils/with-router";
import { withAuthorization } from "../../../utils/with-authorization";
import LineMasterService from "../../../services/track-and-trace-service/line-master-service";
import useCrudOperations from "../utils/useCrudOperation";
import CustomizeModel from "../utils/customizeModel";
import { EditButton } from "../../../utils/action-button/action-button";
const { Option } = Select;

const LineMaster = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { access } = props;
  const lineMasterService = new LineMasterService();
  const [searchValue, setSearchValue] = useState("");
  const [lineList, setLineList] = useState([]);
  const {
    data,
    isLoading,
    selectedRowKeys,
    setSelectedRowKeys,
    fetchData,
    handleUpload,
    handleDelete,
    handleDownload,
    editingKey,
    setEditingKey,
    form,
    save,
    cancel,
  } = useCrudOperations(lineMasterService);
  useEffect(() => {
    setLineList(data);
  }, [data]);
  const isEditing = (record) => record.lineMasterId === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.lineMasterId);
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
      dataIndex: "lineMasterName",
      key: "lineMasterName",
      title: "Name",
      width: 200,
      editable: true,
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: 200,
      editable: true,
      render: (value) => {
        // <Tag color={value === true ? "green" : "red"}>
        //   {value ? "Active" : "Inactive"}
        // </Tag>
        return (
          <Badge
            color={value ? "green" : "#cccccc"}
            text={value ? "Active" : "Inactive"}
          />
        );
      },
    },
    {
      title: "Action",
      key: "lineMasterId",
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
              onClick={() => save(record.lineMasterId)}
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
        inputType: col.dataIndex === "status" ? "select" : "text",
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
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[{ required: true, message: `Please Input ${title}!` }]}
          >
            {dataIndex === "status" && inputType === "select" ? (
              <Select>
                <Option value={true}>Active</Option>
                <Option value={false}>Inactive</Option>
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
      return e.lineMasterName?.toLowerCase().includes(s);
    });
    setSearchValue(s);
    setLineList(result);
  };

  const hasAccess = (permission) => {
    return access?.[0]?.includes(permission);
  };
  return (
    <Page
      // title="Line Master"
      action={
        <Space>
          {
            <>
              {
                <Button
                  icon={<DeleteOutlined />}
                  onClick={handleDelete}
                  disabled={selectedRowKeys.length === 0}
                >
                  Delete
                </Button>
              }

              {
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    handleDownload("linemaster");
                  }}
                >
                  Download
                </Button>
              }
            </>
          }

          {
            <Button
              type="primary"
              onClick={() => setIsModalVisible(true)}
              icon={<UploadOutlined />}
            >
              Upload
            </Button>
          }
        </Space>
      }
    >
      {/* <Table
        rowKey="lineMasterId"
        columns={columns}
        dataSource={data}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
      /> */}
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
          rowKey="lineMasterId"
          columns={mergedColumns}
          dataSource={lineList}
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

export default withRouter(withAuthorization(LineMaster));
