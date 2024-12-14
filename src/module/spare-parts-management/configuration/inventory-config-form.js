import { PlusOutlined } from "@ant-design/icons";
import {
  validateName,
  validateStringWithUnderscore,
} from "../../../helpers/validation";

import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { remoteAsset } from "../../../helpers/url";
import InventoryConfigurationService from "../../../services/inventory-services/inventory-configuration-service";
import InventoryCategoryService from "../../../services/inventory-services/inventory-category-service";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import SupplierService from "../../../services/inventory-services/supplier-service";
import AssetLibraryService from "../../../services/asset-library-service";
import dayjs from "dayjs";
const { Option } = Select;
class InventoryConfigForm extends PageForm {
  service = new InventoryConfigurationService();
  assetLibraryService = new AssetLibraryService();
  inventoryCategoryService = new InventoryCategoryService();
  supplierService = new SupplierService();
  closePopup = (v = false) => {
    this.props.form.resetFields();
    this.props.close(v);
    this.setState((state) => ({
      ...state,
      new_price: false,
      ref_price: true,
      ref_spare: false,
      expiryDate: true,
      // notificationType: false,
      showPeriodDetails: false,
      notificationValue: "date",
    }));
  };
  constructor(props) {
    super(props);
    this.setState((state) => ({
      ...state,
      new_price: false,
      ref_price: true,
      ref_spare: false,
      expiryDate: true,
      // notificationType: false,
      showPeriodDetails: false,
      notificationValue: "date",
    }));
  }
  componentDidMount() {
    this.setState((state) => ({
      ...state,
      new_price: false,
      ref_price: true,
      ref_spare: false,
      expiryDate: true,
      // notificationType: false,
      showPeriodDetails: false,
      notificationValue: "date",
    }));
    this.assetLibraryService.list({}).then(({ data }) => {
      this.setState((state) => ({
        ...state,
        assetLibrary: data,
      }));
    });
    this.inventoryCategoryService.list({ status: true }).then(({ data }) => {
      this.setState((state) => ({ ...state, sparePartTypes: data }));
    });
    this.supplierService.list({ status: true }).then(({ data }) => {
      this.setState((state) => ({ ...state, suppliers: data }));
    });
  }
  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
  }

  remove = (e) => {
    this.props.form.setFieldValue("image", []);
    this.props.form.setFieldValue("imagePath", null);
    this.setState((state) => state);
    return false;
  };

  checkFileType = (file) => {
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    const isImage = allowedFileTypes.includes(file.type);
    if (!isImage) {
      message.error("You can only upload image files (JPEG, PNG)");
    }
    return isImage;
  };
  normFile = (e) => {
    this.setState((state) => state);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  beforeUpload = (file) => {
    this.checkFileType(file);
    return false;
  };
  checkRefurbished = (status) => {
    if (status.target.checked)
      this.setState((state) => ({ ...state, ref_price: false }));
    else this.setState((state) => ({ ...state, ref_price: true }));
  };
  patchForm(data) {
    if (this.props.form) {
      this.props.form.setFieldsValue({
        ...data,
        image: data.imagePath
          ? [
              {
                uid: "-1",
                name: "Asset Image",
                status: "done",
                url: remoteAsset(data.imagePath),
              },
            ]
          : [],
      });
      if (data.newSpare) {
        this.setState((state) => ({
          ...state,
          new_price: false,
          ref_spare: true,
        }));
      } else if (data.refSpare) {
        this.setState((state) => ({
          ...state,
          new_price: true,
          ref_spare: true,
          ref_price: false,
        }));
      } else this.setState((state) => ({ ...state, new_price: true }));
      if (data.hasCritical) {
        this.setState((state) => ({ ...state, showPeriodDetails: true }));
      } else {
        this.setState((state) => ({ ...state, showPeriodDetails: false }));
      }
      if (data.maintenancePeriod) {
        if (data.expiryDate) {
          this.setState((state) => ({
            ...state,
            notificationValue: "date",
            expiryDate: true,
          }));
          this.props.form.setFieldsValue({
            expiryDate: dayjs(data.expiryDate),
          });
        } else {
          this.setState((state) => ({
            ...state,
            notificationValue: "count",
            expiryDate: false,
          }));
        }

        // this.onMaintenanceCycleChange(data.maintenancePeriod);
      }
    }
  }
  // onNotificationTypeChange = ({ target }) => {
  //   if (target.value == "count") {
  //     this.setState((state) => ({
  //       ...state,
  //       expiryDate: false,
  //       notificationValue: target.value,
  //     }));
  //   } else {
  //     this.setState((state) => ({
  //       ...state,
  //       expiryDate: true,
  //       notificationValue: target.value,
  //     }));
  //   }
  // };
  // onMaintenanceCycleChange = (value) => {
  //   if (value) {
  //     this.setState((state) => ({ ...state, notificationType: true }));
  //   } else {
  //     this.setState((state) => ({ ...state, notificationType: false }));
  //   }
  // };
  onHasCriticalChange = ({ target }) => {
    if (target.value == "true") {
      this.setState((state) => ({ ...state, showPeriodDetails: true }));
    } else {
      this.setState((state) => ({ ...state, showPeriodDetails: false }));
    }
  };
  filter = (search) => {
    let s = search.target.value.toLowerCase().trim();
    let res = this.state.rows.filter((e) => {
      return e.ahname?.toLowerCase().includes(s);
    });
    this.setState((state) => ({ ...state, res: res }));
  };
  render() {
    const disablePastDates = (current) => {
      // Disable dates before today
      return current && current < dayjs().startOf("day");
    };
    const period = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24, 36, 48, 60, 72, 84, 96, 108,
      120,
    ];
    return (
      <>
        <Popups
          title={this.state?.title}
          open={this.state?.open}
          onCancel={this.closePopup}
          width={1000}
          footer={[
            <Row justify="space-between">
              <Col>
                {(this.props.mode == "Add" || this.props.mode == "Update") && (
                  <Button key="close" onClick={this.closePopup}>
                    Cancel
                  </Button>
                )}
              </Col>
              <Col>
                {(this.props.mode == "Add" || this.props.mode == "Update") && (
                  <Button
                    key="submit"
                    type="primary"
                    onClick={this.props.form.submit}
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
              onFinish={this.onFinish}
            >
              <Row gutter={[16, 16]}>
                <Col md={8} sm={24}>
                  <Form.Item
                    label="Item Name"
                    name="sparePartName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter item name",
                      },
                      { validator: validateName },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Item No"
                    name="sparePartNumber"
                    rules={[
                      {
                        required: true,
                        message: "Please enter item number",
                      },
                      {
                        validator: validateStringWithUnderscore,
                      },
                    ]}
                  >
                    <Input
                      style={{
                        width: "100%",
                      }}
                    />
                  </Form.Item>
                  <Form.Item name="imagePath" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Reorder Stock"
                    name="reorder"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the reorder stock",
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      style={{
                        width: "100%",
                      }}
                    />
                  </Form.Item>
                  {this.state.showPeriodDetails ? (
                    <Form.Item
                      name="warrantyPeriod"
                      label="Warranty Period"
                      rules={[
                        {
                          required: this.state.showPeriodDetails,
                          message: "Please select the warranty period",
                        },
                      ]}
                    >
                      <Select>
                        {period?.map((e) => (
                          <Option key={e} value={e}>
                            {e <= 11 ? `${e} Month` : `${e / 12} Year`}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ) : null}
                  <Form.Item
                    label="Supplier"
                    name="supplierId"
                    rules={[
                      {
                        required: true,
                        message: "Please select the supplier",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      filterOption={(inputValue, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(inputValue.toLowerCase()) >= 0
                      }
                    >
                      {this.state.suppliers?.map((e) => (
                        <Option value={e.supplierId} key={e.supplierId}>
                          {e.supplierName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={8} sm={24}>
                  <Row>
                    <Col md={12}>
                      <Form.Item
                        name="newSpare"
                        label="New"
                        initialValue={true}
                        valuePropName="checked"
                      >
                        <Checkbox disabled={true} defaultChecked />
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item
                        label="Price"
                        name="newPrice"
                        rules={[
                          {
                            required: !this.state.new_price,
                            message: "Please enter the cost",
                          },
                        ]}
                      >
                        <InputNumber
                          disabled={this.state.new_price}
                          controls={false}
                          min={0}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <Form.Item
                        name="refSpare"
                        label="Refurbished"
                        valuePropName="checked"
                      >
                        <Checkbox
                          disabled={this.state.ref_spare}
                          onChange={this.checkRefurbished}
                        />
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item
                        label="Price"
                        name="refPrice"
                        rules={[
                          {
                            required: !this.state.ref_price,
                            message: "Please enter the cost",
                          },
                        ]}
                      >
                        <InputNumber
                          disabled={this.state.ref_price}
                          controls={false}
                          min={0}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="Minimum Stock Required"
                    name="minimumStockRequired"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the minimum stock",
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      style={{
                        width: "100%",
                      }}
                    />
                  </Form.Item>
                  {this.state.showPeriodDetails ? (
                    <Form.Item
                      name="maintenancePeriod"
                      label="Maintenance Period"
                      rules={[
                        {
                          required: this.state.showPeriodDetails,
                          message: "Please select the maintenance period",
                        },
                      ]}
                    >
                      <Select>
                        {period?.map((e) => (
                          <Option key={e} value={e}>
                            {e <= 11 ? `${e} Month` : `${e / 12} Year`}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ) : null}
                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the description",
                      },
                    ]}
                  >
                    <TextArea />
                  </Form.Item>
                </Col>
                <Col md={8} sm={24}>
                  <Form.Item
                    label="Category"
                    name="sparePartTypeId"
                    rules={[
                      {
                        required: true,
                        message: "Please select the category",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      filterOption={(inputValue, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(inputValue.toLowerCase()) >= 0
                      }
                    >
                      {this.state.sparePartTypes?.map((e) => (
                        <Option
                          key={e.sparePartTypeId}
                          value={e.sparePartTypeId}
                        >
                          {e.sparePartTypeName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Asset Library"
                    name="assetLibraryId"
                    rules={[
                      {
                        required: true,
                        message: "Please select the asset library",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      filterOption={(inputValue, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(inputValue.toLowerCase()) >= 0
                      }

                      // options={this.state.assetLibrary}
                    >
                      {this.state.assetLibrary?.map((e) => (
                        <Option key={e.assetLibraryId} value={e.assetLibraryId}>
                          {e.assetLibraryName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="hasCritical"
                    label="Is Critical"
                    initialValue={false}
                    onChange={this.onHasCriticalChange}
                  >
                    <Radio.Group>
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  </Form.Item>
                  {this.state.showPeriodDetails ? (
                    <Form.Item
                      name="totalCycleCount"
                      label="Cycle Count"
                      // rules={[
                      //   {
                      //     required: this.state.showPeriodDetails,
                      //     message: "Please enter cycle count",
                      //   },
                      // ]}
                    >
                      <InputNumber
                        min={1}
                        style={{
                          width: "100%",
                        }}
                      />
                    </Form.Item>
                  ) : null}
                  <Form.Item name="status" label="Status" initialValue={true}>
                    <Radio.Group>
                      <Radio value={true}>Active</Radio>
                      <Radio value={false}>Inactive</Radio>
                    </Radio.Group>
                  </Form.Item>
                  {/* {this.state.notificationType &&
                  this.state.showPeriodDetails ? (
                    <Form.Item
                      label="Notification Type"
                      name={"notificationType"}
                      // initialValue={"date"}
                    >
                      
                      <Space direction="vertical">
                        <Radio.Group
                          defaultValue={"date"}
                          onChange={this.onNotificationTypeChange}
                          value={this.state.notificationValue}
                        >
                          <Radio value={"date"}>Expiry Date</Radio>
                          <Radio value={"count"}>Cycle Count</Radio>
                        </Radio.Group>
                        {this.state.expiryDate ? (
                          <Form.Item
                            name={"expiryDate"}
                            rules={[
                              {
                                required: this.state.showPeriodDetails,
                                message: "Please select any expiry date",
                              },
                            ]}
                          >
                            <DatePicker disabledDate={disablePastDates} />
                          </Form.Item>
                        ) : (
                          <Form.Item
                            name={"totalCycleCount"}
                            rules={[
                              {
                                required: this.state.showPeriodDetails,
                                message: "Please enter cycle count",
                              },
                            ]}
                          >
                            <InputNumber
                              placeholder="Enter Cycle Count"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        )}
                      </Space>
                    </Form.Item>
                  ) : null} */}
                </Col>
              </Row>
            </Form>
          </Spin>
        </Popups>
      </>
    );
  }
}

export default withForm(InventoryConfigForm);
