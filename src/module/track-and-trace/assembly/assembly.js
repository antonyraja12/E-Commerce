import {
  Col,
  Form,
  Input,
  Row,
  Table,
  Button,
  Select,
  Modal,
  Space,
  message,
} from "antd";
import AssemblyService from "../../../services/track-and-trace-service/assembly-service";
import { useEffect, useState } from "react";
import Page from "../../../utils/page/page";
import dayjs from "dayjs";
import Reprint from "./reprint";
import { AddButton } from "../../../utils/action-button/action-button";
import AssemblyForm from "./assembly-form";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import useCrudOperations from "../utils/useCrudOperation";
import { JobOrderService } from "../../digital-job-card/src/services/job-order-service";
import { JobOrderDetailService } from "../../digital-job-card/src/services/jobOrderDetailService";
import TatJobOrderService from "../../../services/track-and-trace-service/job-order-sevice";
const { confirm } = Modal;

function Assembly() {
  const title = "Assembly";

  const [total, setTotal] = useState(0);

  const [jobOrderOptions, setJobOrderOptions] = useState({});

  const [popup, setPopup] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [editingKey, setEditingKey] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
  });
  const [data, setData] = useState({
    dataSource: [],
    loading: false,
    size: "small",
    bordered: true,
  });
  const service = new AssemblyService();

  const columns = [
    {
      dataIndex: "assemblyId",
      title: "S.No.",
      render: (value, row, index) => {
        const { current, pageSize } = pagination;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      dataIndex: "start",
      title: "Start Date",
      render: (value) => {
        return dayjs(value).format("DD-MM-YYYY hh:mm A");
      },
    },
    {
      dataIndex: "end",
      title: "End Date",
      render: (value) => {
        return dayjs(value).format("DD-MM-YYYY hh:mm A");
      },
    },
    {
      dataIndex: "buildLabel",
      title: "Build Label",
    },
    {
      dataIndex: "productCode",
      title: "Product Code",
    },
    {
      dataIndex: "model",
      title: "Model",
    },
    {
      dataIndex: "variant",
      title: "Variant",
    },
    {
      dataIndex: "category",
      title: "Category",
    },
    {
      dataIndex: "status",
      title: "Status",
    },
  ];
  const handleStatusUpdate = () => {
    showStatusUpdateConfirm(async () => {
      try {
        const updatePromises = selectedRowKeys.map((id) => {
          const row = data.dataSource.find((item) => item.assemblyId === id);
          const newStatus = row.status === "Pending" ? "Paused" : "Pending";
          return service.updateStatus(newStatus, id);
        });

        await Promise.all(updatePromises);

        message.success("Statuses updated successfully");
        fetchData();
        setSelectedRowKeys([]);
      } catch (error) {
        message.error("Error while updating status");
      }
    });
  };

  const showStatusUpdateConfirm = (okCallBack) => {
    confirm({
      title: "Do you want to update the status of the selected assembly?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "primary",
      cancelText: "No",
      onOk() {
        okCallBack();
      },
      onCancel() {},
    });
  };

  const handleDelete = async () => {
    try {
      showDeleteConfirm(async () => {
        for (let id of selectedRowKeys) {
          const response = await service.delete(id);
          if (response.status !== 200) {
            message.error(`Failed to delete item with ID: ${id}`);
          }
        }
        message.success("Selected rows deleted successfully");
        fetchData();
        setEditingKey("");
        setSelectedRowKeys([]);
      });
    } catch (error) {
      message.error("Failed to delete selected rows");
    }
  };
  const showDeleteConfirm = (okCallBack) => {
    confirm({
      title: "Are you sure to delete these entries?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        okCallBack();
      },
      onCancel() {
        // Optionally handle cancel event
      },
    });
  };
  const fetchData = (value = {}) => {
    setData((state) => ({ ...state, loading: true }));
    service
      .list({
        ...value,
        page: pagination.current - 1,
        size: pagination.pageSize,
        sort: "assemblyId,asc",
      })
      .then(({ data }) => {
        setData((state) => ({ ...state, dataSource: data.content }));
        setTotal(data.totalElements);
      })
      .finally(() => {
        setData((state) => ({ ...state, loading: false }));
      });
  };
  useEffect(() => {
    fetchData();
    getJobOrder();
  }, [pagination]);
  const handleFilter = (values) => {
    fetchData(values);
  };
  const getJobOrder = () => {
    const jobOrderService = new TatJobOrderService();
    jobOrderService.list().then((response) => {
      const jobOrderOptions = [
        { value: "", label: "All" }, // Default "All" option with empty string as value
        ...response.data.map((e) => ({
          value: e.jobOrderId,
          label: e.jobOrderNo,
        })),
      ];
      setJobOrderOptions(jobOrderOptions);
    });
  };

  const onPageChange = (page, pageSize) => {
    setPagination((state) => ({
      ...state,
      current: page,
      pageSize: pageSize,
    }));
  };
  const onClose = () => {
    setPopup({
      open: false,
    });
  };
  const add = () => {
    setPopup({
      open: true,
      mode: "Add",
      title: `Add ${title}`,
      id: null,
      disabled: false,
    });
  };
  const isStatusUpdateEnabled =
    selectedRowKeys.length > 0 &&
    selectedRowKeys.every((key) => {
      const selectedRow = data.dataSource.find((row) => row.assemblyId === key);
      return (
        selectedRow &&
        (selectedRow.status === "Pending" || selectedRow.status === "Paused")
      );
    });
  return (
    <Page
      // title="Assembly"
      action={
        <>
          <Space>
            {
              <Button
                onClick={handleStatusUpdate}
                disabled={!isStatusUpdateEnabled}
              >
                Status Update
              </Button>
            }
            {
              <Button
                icon={<DeleteOutlined />}
                onClick={handleDelete}
                disabled={selectedRowKeys.length === 0}
              >
                Delete
              </Button>
            }

            {<AddButton onClick={add} />}
          </Space>
        </>
      }
    >
      <Row gutter={[10, 10]}>
        <Col span={24}>
          <Form
            layout="vertical"
            size="small"
            onFinish={handleFilter}
            initialValues={{
              jobOrderID: "",
              status: " ",
            }}
          >
            <Row gutter={[10, 10]}>
              <Col md={4} lg={4} xl={4}>
                <Form.Item label="Build Label" name={"buildLabel"}>
                  <Input />
                </Form.Item>
              </Col>
              <Col md={4} lg={4} xl={4}>
                <Form.Item label="J.O.No" name={"jobOrderId"}>
                  <Select
                    allowClear
                    optionFilterProp="label"
                    options={jobOrderOptions}
                    showSearch
                  />
                </Form.Item>
              </Col>
              <Col md={4} lg={3} xl={3}>
                <Form.Item label="Status" name="status">
                  <Select
                    allowClear
                    options={[
                      "All",
                      "Completed",
                      "Rejected",
                      "Rework",
                      "Pending",
                      "InProgress",
                      "Paused",
                    ]?.map((e) => {
                      return {
                        value: e === "All" ? " " : e,
                        label: e === "All" ? "All" : e,
                      };
                    })}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label=" ">
                  <Button htmlType="submit" type="primary">
                    Go
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col span={24}>
          <Table
            key={"assemblyId"}
            rowKey={"assemblyId"}
            columns={columns}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
              type: "checkbox",
            }}
            pagination={{
              ...pagination,
              total: total,
              onChange: onPageChange,
            }}
            {...data}
          />
          <AssemblyForm {...popup} onClose={onClose} />
        </Col>
      </Row>
    </Page>
  );
}

export default Assembly;
