import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { dateTimeFormat } from "../../../helpers/url";
import { JobOrderService } from "../../../services/djc/job-order-service";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import { withAuthorization } from "../../../utils/with-authorization";
import { withRouter } from "../../../utils/with-router";
import JobOrderForm from "./job-order-form";
import { MaterialService } from "../../../services/djc/material-service";
const { RangePicker } = DatePicker;
const JobOrder = (props) => {
  const title = "Job Order";
  const [data, setData] = useState([]);
  const [productOption, setProductOption] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, title: "", id: null });

  const service = new JobOrderService();
  const materialService = new MaterialService();

  useEffect(() => {
    fetchJobOrder();
    fetchProductOption({ materialType: "Product" });
  }, []);
  const fetchProductOption = async (filter = {}) => {
    if (filter.date && Array.isArray(filter.date) && filter.date.length === 2) {
      const [startDate, endDate] = filter.date;

      const fromDate = new Date(startDate).toISOString();
      const toDate = new Date(endDate).toISOString();
      filter = {
        ...filter,
        fromDate,
        toDate,
      };
      delete filter.date;
    }
    setIsLoading(true);
    try {
      const response = await materialService.list(filter);
      setProductOption(
        response.data?.map((e) => ({
          label: e.materialName,
          value: e.materialId,
        }))
      );
    } catch (error) {
      message.error("Failed to fetch product");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchJobOrder = async () => {
    setIsLoading(true);
    try {
      const response = await service.list();
      setData(response.data);
    } catch (error) {
      message.error("Failed to fetch job order");
    } finally {
      setIsLoading(false);
    }
  };

  const add = () => {
    setModal({
      open: true,
      mode: "Add",
      title: `Add ${title}`,
      id: null,
      disabled: false,
    });
  };

  const update = (id) => {
    setModal({
      open: true,
      mode: "Update",
      title: `Edit ${title}`,
      id,
      disabled: false,
    });
  };
  const view = (id) => {
    setModal({
      open: true,
      mode: "View",
      title: `View ${title}`,
      id,
      disabled: true,
    });
  };

  const onClose = () => {
    setModal({ open: false, mode: null, title: "", id: null, disabled: false });
    fetchJobOrder();
  };

  const remove = async (id) => {
    try {
      const response = await service.delete(id);
      fetchJobOrder();
      if (response.status == 200) {
        message.success(`Job order deleted successfully`);
      } else {
        message.success(`Something went wrong, Try again!`);
      }
    } catch (error) {
      message.error("Failed to delete operator");
    }
  };

  const columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      render: (_, __, index) => index + 1,
    },
    {
      dataIndex: "soNo",
      key: "soNo",
      title: "Sale Order No",
    },
    {
      dataIndex: "materialName",
      key: "materialName",
      title: "Product Name",
    },
    {
      dataIndex: "joNo",
      key: "joNo",
      title: "Job Order No",
    },
    {
      dataIndex: "joDate",
      key: "joDate",
      title: "Date",
      render: (value) => {
        return dateTimeFormat(value);
      },
    },
    {
      dataIndex: "joQuantity",
      key: "joQuantity",
      title: "Quantity",
    },
    {
      dataIndex: "joStatus",
      key: "joStatus",
      title: "Status",
      render: (value) => {
        return value ? "Active" : "Inactive";
      },
    },
    {
      dataIndex: "joId",
      key: "joId",
      title: "Action",
      render: (value) => {
        return (
          <Space>
            {props.access[0]?.includes("view") && (
              <ViewButton onClick={() => view(value)} />
            )}
            {props.access[0]?.includes("edit") && (
              <EditButton onClick={() => update(value)} />
            )}
            {props.access[0]?.includes("delete") && (
              <DeleteButton onClick={() => remove(value)} />
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Page
      title={title}
      action={props.access[0]?.includes("add") && <AddButton onClick={add} />}
    >
      <Form onFinish={fetchJobOrder}>
        <Row gutter={[10, 10]}>
          <Col span={4}>
            <Form.Item name="soNo">
              <Input placeholder="So.No" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="joNo">
              <Input placeholder="Jo.No" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="productId">
              <Select
                placeholder="Product"
                options={productOption}
                allowClear
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="date">
              <RangePicker />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Go
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Row gutter={[10, 10]}>
        <Col span={24}>
          <Table
            loading={isLoading}
            bordered
            dataSource={data}
            columns={columns}
            size="small"
            rowKey="operatorId"
          />
          <JobOrderForm modal={modal} onClose={onClose} />
        </Col>
      </Row>
    </Page>
  );
};

export default withRouter(withAuthorization(JobOrder));
