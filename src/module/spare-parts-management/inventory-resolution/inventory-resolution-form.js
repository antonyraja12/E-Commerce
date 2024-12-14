import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Spin,
} from "antd";
import React from "react";
import InventoryConfigurationService from "../../../services/inventory-services/inventory-configuration-service";
import InventoryRequestService from "../../../services/inventory-services/inventory-request-service";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import {
  CloseCircleOutlined,
  CloseOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import DispatchSpareService from "../../../services/inventory-services/dispatch-spare-service";
class InventoryResolutionForm extends PageForm {
  inventoryService = new InventoryConfigurationService();
  dispatchservice = new DispatchSpareService();
  service = new InventoryRequestService();
  onSuccess(data) {
    super.onSuccess(data);
    this.props.form.resetFields();
    this.props.spareClose();
  }
  loadSparePart = () => {
    this.inventoryService
      .list({ assetLibraryId: this.props.assetLibraryId })
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          spareList: data,
        }));
      })
      .catch((error) => {
        console.error("Failed to load spare parts:", error);
      });
  };
  onClose = () => {
    this.props.form.resetFields();
    this.props.spareClose();
  };
  componentDidUpdate(prevProps) {
    if (this.props.assetFamilyId !== prevProps.assetFamilyId) {
      this.loadSparePart();
    }
    if (this.props.id !== prevProps.id) {
      super.componentDidMount();
    }
  }
  patchForm = (data) => {
    const Values = data.spareRequestSubList.map((e) => ({
      ...e,
      sparePartId: e.sparePartId,
      requestedQuantity: e.requestedQuantity,
    }));
    this.props.form.setFieldsValue({ spareRequestSubList: Values });
  };

  componentDidMount() {
    this.loadSparePart();

    // if (this.props.id && this.props.mode === "Edit") {
    //   console.log("edit");
    //   this.onRetrieve(this.props.id);
    // }
  }
  onFinish1 = (data) => {
    this.onFinish({
      ...data,
      resolutionWorkOrderId: this.props.resolutionWorkOrderId,
      status: "Requested",
    });
  };

  validateUniqueValue = (_, value, callback) => {
    const { form } = this.props;
    const spareRequestSubList = form.getFieldValue("spareRequestSubList") || [];

    const selectedValues = spareRequestSubList
      .map((item) => item?.sparePartId)
      .filter((val) => val !== undefined);

    if (selectedValues.filter((v) => v === value).length > 1) {
      callback("This spare part is already selected.");
    } else {
      callback();
    }
  };

  render() {
    console.log("log", this.props);
    return (
      <>
        <Popups
          title={this.props?.title}
          open={this.props?.open}
          width={600}
          onCancel={this.onClose}
          footer={[
            <Row justify="space-between">
              <Col>
                {(this.props.mode == "Add" || this.props.mode == "Update") && (
                  <Button key="close" onClick={this.onClose}>
                    Cancel
                  </Button>
                )}
              </Col>
              <Col>
                {(this.props.mode == "Add" || this.props.mode == "Update") && (
                  <Button
                    key="submit"
                    type="primary"
                    onClick={this.props.form?.submit}
                    htmlType="submit"
                  >
                    {this.props.mode == "Add" ? "Save" : "Update"}
                  </Button>
                )}
              </Col>
            </Row>,
          ]}
        >
          <Spin spinning={!!this.state.isLoading}>
            <Form
              size="small"
              className="form-horizontal"
              layout="horizontal"
              form={this.props.form}
              labelAlign="left"
              colon={false}
              labelCol={{ sm: 24, xs: 24 }}
              wrapperCol={{ sm: 24, xs: 24 }}
              disabled={this.props.disabled}
              onFinish={this.onFinish1}
            >
              {/* <Form.Item
                label="Item Name"
                name="sparePartId"
                rules={[
                  {
                    required: true,
                    message: "Please select the item name!",
                  },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  options={this.state.spareList?.map((e) => ({
                    label: `${e.sparePartName} - #${e.sparePartNumber}`,
                    value: e.sparePartId,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Please enter the quantity",
                  },
                ]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item> */}
              <Form.List initialValue={[""]} name={"spareRequestSubList"}>
                {(fields, { add, remove }) => (
                  <>
                    {fields?.map(({ key, name, ...restField }) => (
                      <Row key={key}>
                        <Col lg={11} md={11} xs={11}>
                          <Form.Item
                            // label={"Item Name"}}}
                            {...restField}
                            name={[name, "sparePartId"]}
                            rules={[
                              {
                                required: true,
                                message: "Please select any spare part",
                              },
                              {
                                validator: this.validateUniqueValue,
                              },
                            ]}
                          >
                            <Select
                              style={{ width: "95%" }}
                              placeholder="Item Name"
                              showSearch
                              optionFilterProp="label"
                              options={this.state.spareList?.map((e) => ({
                                label: `${e.sparePartName} - #${e.sparePartNumber}`,
                                value: e.sparePartId,
                              }))}
                            />
                          </Form.Item>
                        </Col>
                        <Col lg={11} md={11} xs={11}>
                          <Form.Item
                            // label="Quantity"
                            {...restField}
                            name={[name, "requestedQuantity"]}
                            rules={[
                              {
                                required: true,
                                message: "Please enter the quantity",
                              },
                            ]}
                          >
                            <InputNumber
                              placeholder="Quantity"
                              min={1}
                              style={{ width: "95%" }}
                            />
                          </Form.Item>
                        </Col>
                        <Col lg={2} md={2} xs={2}>
                          {fields.length > 1 ? (
                            <Button onClick={() => remove(name)}>
                              <CloseOutlined />
                            </Button>
                          ) : null}
                        </Col>
                      </Row>
                    ))}
                    <Row justify={"center"}>
                      <Button
                        icon={<PlusOutlined />}
                        type="dashed"
                        onClick={() => add()}
                      >
                        Add items
                      </Button>
                    </Row>
                  </>
                )}
              </Form.List>
            </Form>
          </Spin>
        </Popups>
      </>
    );
  }
}

export default withForm(InventoryResolutionForm);
