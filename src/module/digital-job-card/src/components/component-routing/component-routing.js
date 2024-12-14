import { createRef } from "react";
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
import { ComponentRoutingService } from "../../services/component-routing-service";
import List from "../base/list";
import { ProductService } from "../../services/product-services";
import ComponentRoutingForm from "./component-routing-form";
import { ComponentMasterService } from "../../services/component-master-service";
import { connect } from "react-redux";
import {
  setProduct,
  setComponent,
} from "../../store/actions/product-module-action";
class ComponentRouting extends List {
  formRef = createRef();
  service = new ComponentRoutingService();
  productService = new ProductService();
  componentService = new ComponentMasterService();
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: "80px",
    },
    {
      dataIndex: "sequenceNumber",
      key: "sequenceNumber",
      title: "Seq.No",
      width: "80px",
    },
    {
      dataIndex: "labourCode",
      key: "labourCode",
      title: "Labour Code",
      width: "150px",
    },
    {
      dataIndex: "machineMaster",
      key: "machineMaster",
      title: "Machine",
      width: "120px",
      render: (value) => {
        return value?.machineName;
      },
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Seq Description",
      width: "250px",
    },
    {
      dataIndex: "machineMaster",
      key: "machineMaster",
      title: "Machine",
      render: (value) => {
        return value.machineName;
      },
      width: "150px",
    },

    {
      dataIndex: "componentRoutingId",
      key: "componentRoutingId",
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
  constructor() {
    super();
    this.getComponentOption = this.getComponentOption.bind(this);
  }
  componentDidMount() {
    this.formRef.current?.setFieldValue("productId", this.props.productId);
    this.formRef.current?.setFieldValue("componentId", this.props.componentId);

    this.productService
      .list({ status: true })
      .then(({ data }) => {
        let productHash = {};
        let pId = this.props.productId;
        if (!this.props.productId) {
          pId = data?.length > 0 ? data[0].productId : null;
          this.formRef.current?.setFieldValue("productId", pId);
          this.props.setProduct(pId);
        }

        this.getComponentOption(pId);
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
        this.formRef.current.submit();
      });
  }
  componentDidUpdate(prevProp, prevState) {
    if (this.props.productId !== prevProp.productId) {
      this.props.setComponent(null);
    }

    if (prevState.popup.open !== this.state.popup.open) {
      setTimeout(() => {
        let pId = this.formRef.current?.getFieldValue("productId");
        let cId = this.formRef.current?.getFieldValue("componentId");
        this.props.setProduct(pId);
        this.props.setComponent(cId);
        let form = this.getFormInstance();
        this.ref.current?.getComponent(pId);
        form?.setFieldsValue({ productId: pId, componentId: cId });
      }, 100);
    }
  }
  getComponentOption(productId) {
    this.setState((state) => ({ ...state, isComponentOptionLoading: true }));
    this.componentService
      .list({ productId: productId })
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          componentOption: data.map((e) => ({
            label: e.componentName,
            value: e.componentId,
          })),
        }));
        if (!this.props.componentId) {
          let cid = data.length > 0 ? data[0].componentId : null;
          this.formRef.current?.setFieldValue("componentId", cid);
          this.props.setComponent(cid);
        }
      })
      .finally(() => {
        this.setState((state) => ({
          ...state,
          isComponentOptionLoading: false,
        }));
      });
  }
  onValuesChange = (changedValue, allValue) => {
    if (changedValue.productId) {
      this.props.setProduct(changedValue.productId);
    }

    if (changedValue.componentId) {
      this.props.setComponent(changedValue.componentId);
    }
  };
  render() {
    const {
      productOption,
      componentOption,
      isComponentOptionLoading,
      isLoading,
      dataSource,
      popup,
      isSaving,
      isDeleting,
    } = this.state;
    return (
      <>
        <Row gutter={[10, 10]}>
          <Col sm={20}>
            <Form
              onValuesChange={this.onValuesChange}
              ref={this.formRef}
              layout="vertical"
              onFinish={this.list}
            >
              <Row gutter={[10, 10]} align="middle">
                <Col sm={4}>
                  <Form.Item name="productId" label="Product">
                    <Select
                      options={productOption}
                      onChange={this.getComponentOption}
                    />
                  </Form.Item>
                </Col>
                <Col sm={4}>
                  <Form.Item name="componentId" label="Component">
                    <Select
                      loading={isComponentOptionLoading}
                      options={componentOption}
                    />
                  </Form.Item>
                </Col>
                <Col sm={2}>
                  <Form.Item name="sequenceNumber" label="Seq.No">
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col sm={2}>
                  <Button type="primary" htmlType="submit">
                    Go
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>

          <Col style={{ marginLeft: "auto" }}>
            <Button
              onClick={this.add}
              type="primary"
              icon={<PlusOutlined />}
              htmlType="button"
            >
              Add
            </Button>
          </Col>

          <Col span={24}>
            <Table
              loading={isLoading}
              bordered
              dataSource={this.state.dataSource}
              columns={this.columns}
              size="small"
              rowKey="componentRoutingId"
            />

            <Modal
              maskClosable={false}
              confirmLoading={isSaving}
              onOk={this.submitForm}
              onCancel={this.closePopup}
              open={popup.open}
              title={popup.title}
              destroyOnClose
              width={1000}
            >
              <ComponentRoutingForm
                ref={this.ref}
                submit={this.submit}
                id={popup.id}
              />
            </Modal>
          </Col>
        </Row>
      </>
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
})(ComponentRouting);
