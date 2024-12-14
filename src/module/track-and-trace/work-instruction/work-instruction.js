import {
  DeleteOutlined,
  DownloadOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Table,
  Upload,
} from "antd";
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import WorkInstructionService from "../../../services/track-and-trace-service/work-instruction-service";
import {
  AddButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import useCrudOperations from "../utils/useCrudOperation";

import { withAuthorization } from "../../../utils/with-authorization";
import { withRouter } from "../../../utils/with-router";

const WorkInstruction = (props) => {
  const title = "Work Instruction";
  const { access } = props;
  const navigate = useNavigate();
  const workInstructionService = new WorkInstructionService();
  const [modal, setModal] = useState({ open: false, title: "", id: null });
  const [searchValue, setSearchValue] = useState("");
  const {
    data,
    isLoading,
    selectedRowKeys,
    fileUploaded,
    setSelectedRowKeys,
    fetchData,
    handleUpload,
    handleDelete,
    handleDownload,
  } = useCrudOperations(workInstructionService);

  const columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: "80px",
      render: (_, __, index) => index + 1,
    },

    {
      title: "Product",
      dataIndex: "productMaster",
      key: "productMaster",
      render: (value, record) => {
        return value.productName;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: 150,
      render: (value) => (
        <Badge
          color={value ? "green" : "#cccccc"}
          text={value ? "Active" : "Inactive"}
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "workInstructionId",
      key: "workInstructionId",
      width: 150,
      align: "center",
      render: (value, record) => (
        <Space>
          {<ViewButton onClick={() => view(value)} />}
          {<EditButton onClick={() => update(value)} />}
        </Space>
      ),
    },
    // {
    //   dataIndex: "workInstructionId",
    //   key: "workInstructionId",
    //   title: "",
    //   width: 50,
    //   align: "center",
    //   fixed: "right",
    //   render: (value) => (
    //     <Space>
    //       <ViewButton onClick={() => view(value)} />
    //       <EditButton onClick={() => update(value)} />
    //     </Space>
    //   ),
    // },
  ];

  const filteredData = useMemo(() => {
    const str = searchValue?.toLowerCase();
    return data.filter((e) => {
      if (!searchValue) return true;
      return (
        e.description?.toLowerCase().includes(str) ||
        e.productMaster.productName?.toLowerCase().includes(str)
      );
    });
  }, [data, searchValue]);

  const filter = (e) => {
    let s = e.target.value.toLowerCase();
    setSearchValue(s);
  };

  const update = (id) => {
    props.navigate(`${id}/update`);
  };
  const view = (id) => {
    props.navigate(`${id}`);
  };
  // const add = () => {
  //   setModal({
  //     open: true,
  //     mode: "Add",
  //     title: `Add ${title}`,
  //     id: null,
  //     disabled: false,
  //   });
  // };
  const add = () => {
    props.navigate("add");
  };
  const onClose = () => {
    setModal({ open: false, mode: null, title: "", id: null, disabled: false });
    fetchData();
  };
  console.log("filter", filteredData);

  return (
    <Page
      // title="Work Instruction"
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
                    handleDownload("work instruction");
                  }}
                >
                  Download
                </Button>
              }
            </>
          }
          {
            <Upload
              beforeUpload={handleUpload}
              showUploadList={false}
              accept=".xlsx, .xls"
            >
              <Button type="primary" icon={<UploadOutlined />}>
                Upload
              </Button>
            </Upload>
          }

          {<AddButton onClick={add} />}
        </Space>
      }
    >
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
        rowKey="workInstructionId"
        dataSource={filteredData}
        columns={columns}
        bordered
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
      />
    </Page>
  );
};

export default withRouter(withAuthorization(WorkInstruction));
