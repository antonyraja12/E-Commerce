import React, { useEffect, useState } from "react";
import {
  Upload,
  Button,
  Table,
  Tag,
  Space,
  Badge,
  Row,
  Col,
  Form,
  Input,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Page from "../../../utils/page/page";
import { withRouter } from "../../../utils/with-router";
import { withAuthorization } from "../../../utils/with-authorization";
import useCrudOperations from "../utils/useCrudOperation";
import WorkStationService from "../../../services/track-and-trace-service/work-station-service";
import {
  AddButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";

const WorkStation = (props) => {
  const title = "Workstation";
  const { access } = props;
  const workStationService = new WorkStationService();
  const {
    data,
    setData,
    selectedRowKeys,
    fileUploaded,
    setSelectedRowKeys,
    handleUpload,
    handleDelete,
    handleDownload,
  } = useCrudOperations(workStationService);

  const [columns, setColumns] = useState([]);
  const [modal, setModal] = useState({ open: false, title: "", id: null });
  const [searchValue, setSearchValue] = useState("");
  const [workStationList, setWorkStationList] = useState([]);

  useEffect(() => {
    if (data) {
      setWorkStationList(data);
      setData(data);
      setColumns([
        {
          dataIndex: "sno",
          key: "sno",
          title: "S.No",
          width: "80px",
          render: (_, __, index) => index + 1,
        },
        {
          dataIndex: "workStationName",
          key: "workStationName",
          title: "Work Station Name",
          width: 250,
        },

        {
          dataIndex: "lineMaster",
          key: "lineMaster",
          title: "Line Name",
          width: 200,
          render: (value) => {
            return value.lineMasterName;
          },
        },
        {
          dataIndex: "mode",
          key: "mode",
          title: "Mode",
          width: 150,
        },
        {
          dataIndex: "type",
          key: "type",
          title: "Type",
          width: 100,
        },
        {
          dataIndex: "status",
          key: "status",
          title: "Status",
          width: 150,
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
          dataIndex: "workStationId",
          key: "workStationId",
          title: "Action",
          width: 50,
          align: "center",
          fixed: "right",
          render: (value) => (
            <Space>
              {<ViewButton onClick={() => view(value)} />}
              {<EditButton onClick={() => update(value)} />}{" "}
            </Space>
          ),
        },
      ]);
    }
  }, [data]);

  const add = () => {
    props.navigate("add");
  };
  const update = (id) => {
    props.navigate(`update/${id}/basic-details`);
  };
  const view = (id) => {
    props.navigate(`${id}/view`);
  };
  const onClose = () => {
    setModal({ open: false, mode: null, title: "", id: null, disabled: false });
  };
  const filter = (e) => {
    let s = e.target.value.toLowerCase();
    let result = data.filter((e) => {
      return e.workStationName?.toLowerCase().includes(s);
    });
    setSearchValue(s);
    setWorkStationList(result);
  };
  const hasAccess = (permission) => {
    return access?.[0]?.includes(permission);
  };
  return (
    <Page
      // title={title}
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
                  handleDownload("workstation");
                }}
              >
                Download
              </Button>
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
        rowKey="workStationId"
        scroll={{ x: "max-content" }}
        columns={columns}
        dataSource={workStationList?.sort((a, b) => a.seqNo - b.seqNo)}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        bordered
        pagination={false}
        size="small"
      />
      {/* <WorkStationForm modal={modal} onClose={onClose} /> */}
    </Page>
  );
};

export default withRouter(withAuthorization(WorkStation));
