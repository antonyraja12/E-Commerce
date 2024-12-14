import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Table,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { ProductService } from "../../../services/djc/product-service";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import ProductForm from "./product-form";
import { withRouter } from "../../../utils/with-router";
import { withAuthorization } from "../../../utils/with-authorization";

const Product = (props) => {
  const title = "Product";
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, title: "", id: null });
  const [form] = Form.useForm();

  const service = new ProductService();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await service.list();
      setData(response.data);
    } catch (error) {
      message.error("Failed to fetch product");
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
  };

  const remove = async (id) => {
    try {
      await service.delete(id);
      fetchProducts();
    } catch (error) {
      message.error("Failed to delete product");
    }
  };

  const filter = (search) => {};

  const columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: "80px",
    },
    {
      dataIndex: "productName",
      key: "productName",
      title: "Product Name",
    },
    {
      dataIndex: "model",
      key: "model",
      title: "Model",
    },
    {
      dataIndex: "itemNumber",
      key: "itemNumber",
      title: "Item.No",
    },
    {
      dataIndex: "itemDescription",
      key: "itemDescription",
      title: "Item Description",
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
      dataIndex: "productId",
      key: "productId",
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
            <DeleteButton onConfirm={() => remove(value)} />
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
      <Row gutter={[10, 10]}>
        <Col span={24}>
          <Row justify="space-between">
            <Col span={24}>
              <Form form={form} onValuesChange={({ search }) => filter(search)}>
                <Form.Item name="search">
                  <Input
                    prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
                    placeholder="Search..."
                  />
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <Table
            loading={isLoading}
            bordered
            dataSource={data}
            columns={columns}
            size="small"
            rowKey="productId"
          />
          <ProductForm modal={modal} onClose={onClose} />
        </Col>
      </Row>
    </Page>
  );
};

export default withRouter(withAuthorization(Product));
