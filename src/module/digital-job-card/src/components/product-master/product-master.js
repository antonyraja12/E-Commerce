import React, { Component } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
} from "antd";
import dayjs from "dayjs";
import { ProductService } from "../../services/product-services";
import { DateTimeFormat } from "../../utils/helper";
import List from "../base/list";
import ProductMasterForm from "./product-master-form";
import Page from "../../../../../utils/page/page";

class ProductMaster extends List {
  service = new ProductService();
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }
  columns = [
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
      render: (value) => {
        return value ? (
          <Badge color="green" text="Active" />
        ) : (
          <Badge text="Inactive" color="#cccccc" />
        );
      },
    },
    // {
    //   dataIndex: "createdAt",
    //   key: "createdAt",
    //   title: "Created At",
    //   width: "180px",
    //   render: (value) => {
    //     return DateTimeFormat(value);
    //   },
    // },
    // {
    //   dataIndex: "lastUpdatedAt",
    //   key: "lastUpdatedAt",
    //   title: "Last Updated At",
    //   width: "180px",
    //   render: (value) => {
    //     return DateTimeFormat(value);
    //   },
    // },
    {
      dataIndex: "productId",
      key: "productId",
      title: "Action",
      width: "180px",
      align: "center",
      render: (value) => {
        return (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => this.edit(value)}
            />
            <Popconfirm
              title="Confirm to delete"
              description="Are you sure to delete this entry?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => this.delete(value)}
            >
              <Button type="text" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  componentDidUpdate(prevProps, prevState) {
    if (this.state.dataSource !== prevState.dataSource) {
      this.setState({ rows: this.state.dataSource });
    }
  }
  patchForm(data) {
    let form = this.getFormInstance();
    form.setFieldsValue({
      ...data,
      shiftCalendarDetails: data.shiftCalendarDetails?.map((e) => ({
        ...e,
        startTime: dayjs(e.startTime),
        endTime: dayjs(e.endTime),
      })),
    });
  }
  filter = () => {
    const searchValue = this.formRef.current.getFieldValue("search");
    const s = searchValue.toLowerCase().trim();
    if (s === "") {
      this.setState({ rows: this.state.dataSource });
    } else {
      const rows = this.state.dataSource.filter((e) =>
        e.productName?.toLowerCase().includes(s)
      );
      this.setState({ rows });
    }
  };
  resetSearchInput = () => {
    this.formRef.current.resetFields();
    this.setState({ rows: this.state.dataSource });
  };
  onClose1 = () => {
    this.closePopup();
    this.resetSearchInput();
  };
  render() {
    const { isLoading, dataSource, rows, popup, isSaving, isDeleting } =
      this.state;
    return (
      <Page
        title="Product"
        action={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            htmlType="button"
            onClick={this.add}
          >
            Add
          </Button>
        }
      >
        <Row gutter={[10, 10]}>
          <Col span={24}>
            <Row justify="space-between">
              <Col span={24}>
                <Form ref={this.formRef} onValuesChange={this.filter}>
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
              dataSource={rows}
              columns={this.columns}
              size="small"
              rowKey="productId"
              // onRow={(record, rowIndex) => {
              //   if (!record.status) {
              //     return {
              //       style: {
              //         opacity: 0.5,
              //       },
              //     };
              //   }
              // }}
            />

            <Modal
              maskClosable={false}
              confirmLoading={isSaving}
              onOk={this.submitForm}
              onCancel={this.closePopup}
              open={popup.open}
              title={popup.title}
              destroyOnClose
              width={650}
            >
              <ProductMasterForm
                ref={this.ref}
                submit={this.submit}
                id={popup.id}
              />
            </Modal>
          </Col>
        </Row>
      </Page>
    );
  }
}

export default ProductMaster;
