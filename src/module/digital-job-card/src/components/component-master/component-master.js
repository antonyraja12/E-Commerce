import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import { createRef } from "react";
import { connect } from "react-redux";
import { ComponentMasterService } from "../../services/component-master-service";
import { ProductService } from "../../services/product-services";
import {
  setComponent,
  setProduct,
} from "../../store/actions/product-module-action";
import List from "../base/list";
import ComponentMasterForm from "./component-master-form";
import Page from "../../../../../utils/page/page";

class ComponentMaster extends List {
  service = new ComponentMasterService();
  formRef = createRef();
  productService = new ProductService();
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: "80px",
    },
    {
      dataIndex: "productId",
      key: "productId",
      title: "Product",
      render: (value) => {
        return this.state.productHash[value];
      },
    },
    {
      dataIndex: "componentName",
      key: "componentName",
      title: "Component Name",
      width: "250px",
    },
    {
      dataIndex: "componentNumber",
      key: "componentNumber",
      title: "Component.No",
      width: "150px",
    },
    {
      dataIndex: "quantity",
      key: "quantity",
      title: "Quantity",
      width: "50px",
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: "120px",
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
      dataIndex: "componentId",
      key: "componentId",
      title: "Action",
      width: "100px",
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
  componentDidMount() {
    this.formRef.current?.setFieldValue("productId", this.props.productId);
    this.productService
      .list({ status: true })
      .then(({ data }) => {
        let pId = data?.length > 0 ? data[0].productId : null;
        if (!this.props.productId) {
          this.formRef.current?.setFieldValue("productId", pId);
          this.props.setProduct(pId);
        }

        this.formRef.current?.submit();
        let productHash = {};
        for (let e of data) {
          productHash[e.productId] = e.productName;
        }
        this.setState((state) => ({
          ...state,
          productOption: data.map((e) => ({
            value: e.productId,
            label: e.productName,
          })),
          productHash: productHash,
        }));
      })
      .finally(() => {
        this.formRef.current?.submit();
      });
  }
  onValuesChange = (changedValue, allValue) => {
    if (changedValue.productId) {
      this.props.setProduct(changedValue.productId);
    }
  };
  componentDidUpdate(prevProp, prevState) {
    if (prevState.popup.open !== this.state.popup.open) {
      setTimeout(() => {
        let pId = this.formRef.current?.getFieldValue("productId");
        let form = this.getFormInstance();

        form?.setFieldValue("productId", pId);
      }, 100);
    }
  }

  render() {
    console.log("log", this.props);
    const { productOption, isLoading, dataSource, popup, isSaving } =
      this.state;
    return (
      <Page
        title="BOM"
        action={
          <Button
            onClick={this.add}
            type="primary"
            icon={<PlusOutlined />}
            htmlType="button"
          >
            Add
          </Button>
        }
      >
        <Row gutter={[10, 10]}>
          <Col sm={24}>
            <Form
              onValuesChange={this.onValuesChange}
              ref={this.formRef}
              layout="vertical"
              onFinish={this.list}
            >
              <Row gutter={[10, 10]} align="middle">
                <Col sm={4}>
                  <Form.Item name="productId">
                    <Select options={productOption} placeholder="Product" />
                  </Form.Item>
                </Col>
                {/* <Col sm={2}>
                  <Form.Item name="sequenceNumber" label="Seq.No">
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>
                </Col> */}
                <Col sm={4}>
                  <Form.Item name="componentName">
                    <Input placeholder="Component Name" />
                  </Form.Item>
                </Col>
                <Col sm={4}>
                  <Form.Item name="componentNumber">
                    <Input placeholder="Comp.No" />
                  </Form.Item>
                </Col>
                <Col sm={2}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Go
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>

          <Col span={24}>
            <Table
              loading={isLoading}
              bordered
              dataSource={dataSource}
              columns={this.columns}
              size="small"
              rowKey="componentId"
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
              <ComponentMasterForm
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
const mapStateToProps = (state) => {
  return (
    {
      productId: state.productModuleReducer.productId,
      // productId: 0,
      componentId: state.productModuleReducer.componentId,
      // componentId: 0,
    } ?? {}
  );
};
export default connect(mapStateToProps, {
  setProduct,
  setComponent,
})(ComponentMaster);
