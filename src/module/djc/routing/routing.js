import {
  Badge,
  Button,
  Col,
  Form,
  Row,
  Select,
  Space,
  Table,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { RoutingService } from "../../../services/djc/routing-service";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import { withAuthorization } from "../../../utils/with-authorization";
import { withRouter } from "../../../utils/with-router";
import { MaterialService } from "../../../services/djc/material-service";

const Routing = (props) => {
  const title = "Routing";
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, title: "", id: null });
  const [productOption, setProductOption] = useState([]);
  const service = new RoutingService();
  const materialService = new MaterialService();

  useEffect(() => {
    fetchRouting();
    fetchProductOption();
  }, []);
  const fetchProductOption = async () => {
    setIsLoading(true);
    try {
      const response = await materialService.getProductionProduct({
        status: true,
      });
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
  const fetchRouting = async (filter = {}) => {
    setIsLoading(true);
    try {
      const response = await service.list(filter);
      setData(response.data);
    } catch (error) {
      message.error("Failed to fetch routing");
    } finally {
      setIsLoading(false);
    }
  };

  const add = () => {
    props.navigate(`add`);
  };

  const update = (id) => {
    props.navigate(`update/${id}`);
  };
  const view = (id) => {
    props.navigate(`view/${id}`);
  };

  const remove = async (id) => {
    try {
      const response = await service.delete(id);
      fetchRouting();
      if (response.status == 200) {
        message.success(`Routing deleted successfully`);
      } else {
        message.success(`Something went wrong, Try again!`);
      }
    } catch (error) {
      message.error("Failed to delete routing");
    }
  };

  const columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: "80px",
      render: (_, __, index) => index + 1,
    },
    {
      dataIndex: "routingName",
      key: "routingName",
      title: "Routing Name",
    },
    {
      dataIndex: "finishedProductName",
      key: "finishedProductName",
      title: "Product Name",
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: "100px",
      render: (value) =>
        value ? (
          <Badge color="green" text="Active" />
        ) : (
          <Badge text="Inactive" color="#cccccc" />
        ),
    },
    {
      dataIndex: "routingId",
      key: "routingId",
      title: "Action",
      width: "180px",
      align: "center",
      render: (value) => (
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
      ),
    },
  ];

  return (
    <Page
      title={title}
      action={props.access[0]?.includes("add") && <AddButton onClick={add} />}
    >
      <Form onFinish={fetchRouting}>
        <Row gutter={[10, 10]}>
          <Col span={4}>
            <Form.Item name="materialId">
              <Select
                placeholder="Material"
                options={productOption}
                allowClear
                showSearch
                optionFilterProp="label"
              />
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
            rowKey="routingMasterId"
          />
        </Col>
      </Row>
    </Page>
  );
};

export default withRouter(withAuthorization(Routing));
