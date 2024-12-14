import React, { useEffect, useState } from "react";
import { withRouter } from "../../../utils/with-router";
import TatJobOrderService from "../../../services/track-and-trace-service/job-order-sevice";
import useCrudOperations from "../utils/useCrudOperation";
import Page from "../../../utils/page/page";
import {
  AddButton,
  DeleteButton,
  EditButton,
} from "../../../utils/action-button/action-button";
import JobOrderForm from "./job-order-form";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Row,
  Select,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  Spin,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  PlayCircleFilled,
  PlayCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { dateFormat } from "../../../helpers/date-format";
import WorkStationInstanceService from "../../../services/track-and-trace-service/work-station-instance-service";
import CustomizeModel from "../utils/customizeModel";
import { withAuthorization } from "../../../utils/with-authorization";
import { Link } from "react-router-dom";
import { useProductMaster } from "../../../hooks/useProductMaster";
import { sort } from "d3";

const JobOrder = (props) => {
  const title = "Job Order";
  const service = new TatJobOrderService();
  const { form } = Form.useForm();
  const { access } = props;
  const [popup, setPopup] = useState({});
  const [productOption, setProductOption] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sortedData, setSortedData] = useState([]);
  const [isProductLoading, productList] = useProductMaster();

  const [state, setState] = useState({
    data: [],
  });

  const {
    data,
    isLoading,
    fetchData,
    handleDelete,
    setSelectedRowKeys,
    selectedRowKeys,
    handleUpload,
    handleDownload,
  } = useCrudOperations(service);
  // useEffect(() => {
  //   setProductOption(
  //     data.map((e) => ({
  //       value: e.productId,
  //       label: e.productName,
  //     }))
  //   );
  // }, [data]);

  useEffect(() => {
    const sorted = [...data].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setSortedData(sorted);
  }, [data]);
  const columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (value) => {
        return dateFormat(value);
      },
      width: 100,
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Job Order No",
      dataIndex: "jobOrderNo",
      width: 150,
    },
    {
      title: <Tooltip title="Vehicle Identification Number">VIN</Tooltip>,
      dataIndex: "vin",
      width: 150,
    },
    {
      title: "Product Info",
      dataIndex: "productMasters",
      key: "productMasters",
      render: (val, row) => {
        return (
          <>
            {val.map((e, index) => (
              <div key={e.productId} style={{ marginBottom: "8px" }}>
                <Typography.Text type="success">#{e.code}</Typography.Text>
                <p style={{ margin: 0 }}>
                  <strong>{e.productName}</strong>
                </p>
                <Space split={<Divider type="vertical" />}>
                  <span>Model: {row.model}</span>
                  <span>Variant: {row.variant}</span>
                </Space>
              </div>
            ))}
          </>
        );
      },
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (val) => {
        return <Tag>{val}</Tag>;
      },
      width: 100,
    },
    {
      title: "Action",
      dataIndex: "jobOrderId",
      key: "jobOrderId",
      width: 20,
      render: (value, rec) => {
        return (
          <Space>
            <Tooltip title="View">
              <Link to={`./${value}/assembly`}>
                <Button type="text" icon={<EyeOutlined />} />
              </Link>
            </Tooltip>
            <Tooltip title={rec.status === "Paused" ? "Resume" : "Pause"}>
              <Button
                onClick={() => onActivate(value, rec.status)}
                type="text"
                icon={<PlayCircleOutlined />}
              />
            </Tooltip>
            <EditButton onClick={() => onEdit(value)} />
          </Space>
        );
      },
    },
  ];
  const add = () => {
    setPopup({
      open: true,
      mode: "Add",
      title: `Add ${title}`,
      id: null,
      disabled: false,
    });
  };
  const onEdit = (id) => {
    setPopup({
      open: true,
      mode: "Update",
      title: `Update ${title}`,
      id: id,
      disabled: false,
    });
  };
  const onClose = () => {
    setPopup({
      open: false,
    });
    fetchData();
  };
  const onTableRowSelect = (selctedItems) => {
    setSelectedRowKeys(selctedItems);
  };
  const onActivate = (id, status) => {
    const { value, title } =
      status === "Pending"
        ? { value: "Paused", title: "Pause" }
        : status === "Paused"
        ? { value: "InProgress", title: "Resume" }
        : { value: "Paused", title: "Pause" };
    Modal.confirm({
      title: `Click Yes to ${title} this job!`,
      onOk: () => {
        return service.setJobOrderStatus(id, value).then(({ data }) => {
          fetchData();
        });
      },
      okText: "Yes",
      cancelText: "No",
    });
  };
  const filter = (val) => {
    const value = {
      fromDate: val.fromDate ? dayjs(val.fromDate).toISOString() : null,
      toDate: val.toDate ? dayjs(val.toDate).toISOString() : null,
      jobOrderStatus: val.jobOrderStatus || null,
      productId: val.productId || null,
    };
    fetchData(value).then((res) => {});
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
                  onClick={() => handleDownload("Job order")}
                >
                  Download
                </Button>
              }
              {<AddButton onClick={add} />}

              {
                <Button
                  type="primary"
                  onClick={() => setIsModalVisible(true)}
                  icon={<UploadOutlined />}
                >
                  Upload
                </Button>
              }
            </>
          }
        </Space>
      }
    >
      <Spin spinning={isLoading}>
        <Form form={form} layout="vertical" onFinish={filter}>
          <Row gutter={[10, 10]}>
            <Col sm={6}>
              <Form.Item label="Product name" name="productId">
                <Select
                  allowClear
                  placeholder="Select product name"
                  options={productList?.parentOptions}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="From" name="fromDate">
                <DatePicker allowClear format="DD-MM-YYYY" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="To" name="toDate">
                <DatePicker allowClear format="DD-MM-YYYY" />
              </Form.Item>
            </Col>
            <Col sm={4}>
              <Form.Item label="Status" name="jobOrderStatus">
                <Select allowClear placeholder="Select status">
                  <Select.Option value="InProgress">In Progress</Select.Option>
                  <Select.Option value="Pending">Pending</Select.Option>
                  <Select.Option value="Paused">Paused</Select.Option>
                  {/* <Select.Option value="Cancelled">Cancelled</Select.Option> */}
                  <Select.Option value="Completed">Completed</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label=" ">
                <Button type="primary" htmlType="submit">
                  Go
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          size="small"
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
            type: "checkbox",
          }}
          className="table"
          dataSource={sortedData}
          columns={columns}
          key="jobOrderId"
          rowKey="jobOrderId"
        />
        <JobOrderForm {...popup} onClose={onClose} />
      </Spin>
      <CustomizeModel
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        handleUpload={handleUpload}
      />
    </Page>
  );
};

export default withRouter(withAuthorization(JobOrder));
