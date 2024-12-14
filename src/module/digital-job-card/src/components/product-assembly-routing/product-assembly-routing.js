import { createRef } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  FileSearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
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
  message,
} from "antd";
import List from "../base/list";
import { ProductService } from "../../services/product-services";
import ProductAssemblyRoutingForm from "./product-assembly-routing-form";
import { ComponentMasterService } from "../../services/component-master-service";
import { connect } from "react-redux";
import {
  setProduct,
  setComponent,
} from "../../store/actions/product-module-action";
import { ProductAssemblyRoutingService } from "../../services/product-assembly-routing-service";
import Page from "../../../../../utils/page/page";
class ProductAssemblyRouting extends List {
  formRef = createRef();
  service = new ProductAssemblyRoutingService();
  productService = new ProductService();
  componentService = new ComponentMasterService();
  isMobile = window.innerWidth <= 768;
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: "80px",
      fixed: this.isMobile ? undefined : "left",
    },
    // {
    //   dataIndex: "productMaster",
    //   key: "productMaster",
    //   title: "Product",
    //   width: "150px",
    //   fixed: this.isMobile ? undefined : "left",
    //   render: (value) => {
    //     return value?.productName;
    //   },
    // },
    {
      dataIndex: "sequenceNumber",
      key: "sequenceNumber",
      title: "Seq.No",
      width: "80px",
      // fixed: this.isMobile ? undefined : "left",
    },
    {
      dataIndex: "seqTime",
      key: "seqTime",
      title: "Seq Time (min)",
      width: "80px",
    },
    // {
    //   dataIndex: "labourCode",
    //   key: "labourCode",
    //   title: "Labour Code",
    //   width: "150px",
    // },
    {
      dataIndex: "asset",
      key: "asset",
      title: "Machine",
      width: "120px",
      render: (value) => {
        return value?.assetName;
      },
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Seq Description",
      width: "250px",
    },
    // {
    //   dataIndex: "partsPerLoad",
    //   key: "partsPerLoad",
    //   title: "Parts / Load",
    //   width: "80px",
    // },
    // {
    //   dataIndex: "machineTimePerLoad",
    //   key: "machineTimePerLoad",
    //   title: "Machine Time / Load",
    //   width: "80px",
    // },
    // {
    //   dataIndex: "setUpTime",
    //   key: "setUpTime",
    //   title: "Setup Time",
    //   width: "80px",
    // },
    // {
    //   dataIndex: "loadUnloadTime",
    //   key: "loadUnloadTime",
    //   title: "Load Unload Time",
    //   width: "80px",
    // },
    // {
    //   dataIndex: "labourMachineTimePerLoad",
    //   key: "labourMachineTimePerLoad",
    //   title: "Labour Machine Time / Load",
    //   width: "80px",
    // },
    // {
    //   dataIndex: "machineTime",
    //   key: "machineTime",
    //   title: "Machine Time",
    //   width: "80px",
    // },
    // {
    //   dataIndex: "labourTimePerLoad",
    //   key: "labourTimePerLoad",
    //   title: "Labour Time / Load",
    //   width: "80px",
    // },
    // {
    //   dataIndex: "labourTime",
    //   key: "labourTime",
    //   title: "Labour Time",
    //   width: "80px",
    // },
    // {
    //   dataIndex: "machineMaster",
    //   key: "machineMaster",
    //   title: "Machine",
    //   render: (value) => {
    //     return value.machineName;
    //   },
    //   width: "150px",
    //   fixed: this.isMobile ? undefined : "right",
    // },

    {
      dataIndex: "productAssemblyRoutingId",
      key: "productAssemblyRoutingId",
      title: "Action",
      width: "120px",
      align: "center",
      fixed: this.isMobile ? undefined : "right",
      render: (value) => {
        return (
          <Space>
            <Button
              type="text"
              icon={<FileSearchOutlined />}
              onClick={() => this.view(value)}
            />
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
  onSuccess(data) {
    message.success("Saved Successfully");
    this.formRef.current.submit();
    this.closePopup();
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

        // this.getComponentOption(pId);
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
        // this.ref.current?.getComponent(pId);
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
      <Page
        title="Product Assembly Routing"
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
                    <Select
                      options={productOption}
                      // onChange={this.getComponentOption}
                      placeholder="Product"
                    />
                  </Form.Item>
                </Col>
                {/* <Col sm={4}>
                   <Form.Item name="componentId" label="Component">
                    <Select
                      loading={isComponentOptionLoading}
                      options={componentOption}
                    />
                  </Form.Item> 
                </Col> */}
                {/* <Col sm={2}>
                  <Form.Item name="sequenceNumber" label="Seq.No">
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>
                </Col> */}

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
              dataSource={this.state.dataSource}
              columns={this.columns}
              size="small"
              rowKey="componentRoutingId"
              scroll={{
                x: 1500,
                y: 300,
              }}
            />

            <Modal
              maskClosable={false}
              confirmLoading={isSaving}
              // onOk={this.submitForm}
              onCancel={this.closePopup}
              open={popup.open}
              title={popup.title}
              destroyOnClose
              // width={500}
              footer={
                popup.mode !== "view" && (
                  <>
                    <Button type="primary" onClick={this.submitForm}>
                      OK
                    </Button>
                    <Button onClick={this.closePopup}>Cancel</Button>
                  </>
                )
              }
            >
              <ProductAssemblyRoutingForm
                ref={this.ref}
                submit={this.submit}
                id={popup.id}
                mode={popup.mode}
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
})(ProductAssemblyRouting);
