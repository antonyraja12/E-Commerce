import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Spin,
  Radio,
  Select,
  message,
  Space,
  Table,
} from "antd";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import PurchaseHistoryService from "../../../services/inventory-services/purchase-history-service";
import InventoryRequestService from "../../../services/inventory-services/inventory-request-service";
import SupplierService from "../../../services/inventory-services/supplier-service";
import StockJournalService from "../../../services/inventory-services/stock-journal-service";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
const { Option } = Select;
class PurchaseHistoryForm extends PageForm {
  service = new PurchaseHistoryService();
  supplierService = new SupplierService();
  spareRequestService = new InventoryRequestService();
  stockJournalService = new StockJournalService();
  closePopup = () => {
    this.props.form.resetFields();
    this.props.close();
    // this.stockInPurchaseSpare();
  };
  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
  }
  changeStatus = () => {
    this.service
      .update(this.props.form.getFieldsValue(), this.props.id)
      .then(({ data }) => {
        if (data.success) {
          message.success(data.message);
          this.service.updatePurchaseRequestStatus(
            this.state.purchaseData.purchaseRequestId,
            "Received"
          );
          this.closePopup();
        } else {
          message.error(data.message);
        }
      });
  };
  stockInPurchaseSpare = () => {
    this.stockJournalService.add({
      refNo: `Purchase Ref ${dayjs().format("DD-MM-YY - HH:mm:ss")}`,
      date: dayjs().format(),
      stockType: "Purchase",
      description: "Purchase",
      stockInList: this.state.purchaseData?.purchaseRequestSubList.map(
        (item) => ({
          sparePartId: item.sparePartId,
          quantity: item.quantity,
          price: item.sparePart?.price,
          stockValue: "IN",
          totalValue: item.quantity * item.sparePart?.price,
        })
      ),
      stockOutList: [],
    });
    this.service.updatePurchaseRequestStatus(
      this.state.purchaseData.purchaseRequestId,
      "Closed"
    );
  };
  patchForm(data) {
    console.log("data.purchaseRequestSubList", data);
    this.props.form.setFieldsValue({
      prNo: data?.prNo,
      startDate: data?.startDate,
      purchaseRequestStatus: data?.purchaseRequestStatus,
      systemUpdate: data?.systemUpdate,

      purchaseRequestSubList: data.purchaseRequestSubList
        .filter((e) => e?.pendingQuantity != 0)
        .map((item) => ({
          ...item,
          sparePartName: item.sparePart.sparePartName,
          sparePartNumber: item.sparePart.sparePartNumber,
          supplierId: item.sparePart.supplier.supplierId,
        })),
    });
    this.setState((state) => ({
      ...state,
      purchaseData: data,
      startDate: data?.startDate,
      endDate: data?.endDate,
    }));

    this.supplierService.list().then(({ data }) => {
      this.setState((state) => ({ ...state, supplier: data }));
    });

    // if (this.props.data) {
    //   this.props.form.setFieldsValue({
    //     sparePartId: this.props.data?.sparePart?.sparePartId,
    //     itemName: this.props.data?.sparePart?.sparePartName,
    //     itemNumber: this.props.data?.sparePart?.sparePartNumber,
    //     condition: this.props.data?.condition,
    //     supplierId: this.props.data?.sparePart?.supplierId
    //       ? this.props.data?.sparePart?.supplierId
    //       : null,
    //     supplier: this.props.data?.sparePart?.supplier?.supplierName
    //       ? this.props.data?.sparePart?.supplier?.supplierName
    //       : null,
    //     spareRequestId: this.props.data?.spareRequestId,
    //   });
    // } else {
    //   this.service.retrieve(this.props.id).then(({ data }) => {
    //     this.props.form.setFieldsValue({
    //       sparePartId: data?.sparePartId,
    //       itemName: data?.itemName,
    //       itemNumber: data?.itemNumber,

    //       supplierId: data?.supplierId ? data?.supplierId : null,
    //       supplier: data?.supplier?.supplierName
    //         ? data?.supplier?.supplierName
    //         : null,
    //       quantity: data?.quantity,
    //       purchaseRequestStatus: "Received",
    //     });
    //     this.setState((state) => ({ ...state, purchaseData: data }));
    //   });
    // }
  }
  // updateProcessing = (data) => {
  //   this.service.update(data, this.props.id).then(({ data }) => {
  //     console.log("dataa", data);
  //   });
  // };
  // onFinish = (value) => {
  //   this.setState((state) => ({ ...state, isLoading: true }));
  //   this.service.add(value).then(({ data }) => {
  //     if (data.success) {
  //       message.success(data.message);
  //       // this.stockInPurchaseSpare();
  //       this.props.onClose();
  //     } else {
  //       message.error(data.message);
  //     }
  //   });
  // };
  onFinish = (value) => {
    this.setState((state) => ({ ...state, isLoading: true }));
    if (this.props.startDate) {
      this.service
        .add(value)
        .then(({ data }) => {
          if (data.success) {
            message.success(data.message);
            this.stockInPurchaseSpare();
          } else {
            message.error(data.message);
          }
        })
        .catch((err) => console.log("catch error", err))
        .finally(() => {
          this.closePopup();
        });
    } else {
      value.startDate = new Date();
      this.service
        .update(value, this.props.id)
        .then(({ data }) => {
          if (data.success) {
            message.success(data.message);
          } else {
            message.error(data.message);
          }
        })
        .catch((err) => console.log("catch error", err))
        .finally(() => {
          this.closePopup();
        });
    }
  };
  render() {
    return (
      <Popups
        width="1000px"
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
              {this.props.mode == "Add" || this.props.mode == "Update" ? (
                // <Link to={"/spare-parts/purchase-history"}>
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => this.props.form.submit()}
                  htmlType="submit"
                >
                  Request Purchase
                </Button>
              ) : this.state.startDate ? (
                <Link
                  to={"/spare-parts/stock-journal/add"}
                  state={this.props.id}
                >
                  <Button
                    key="submit"
                    type="primary"

                    // onClick={this.changeStatus}
                    // htmlType="submit"
                  >
                    Stock In
                  </Button>
                </Link>
              ) : (
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => this.props.form.submit()}
                  htmlType="submit"
                >
                  Processing
                </Button>
              )}
            </Col>
          </Row>,
        ]}
        title={this.state?.title}
        open={this.state?.open}
        onCancel={this.closePopup}
      >
        <Spin spinning={this.state.isLoading}>
          <Form
            size="small"
            labelAlign="left"
            className="form-horizontal"
            // colon={false}
            // layout="vertical"
            form={this.props.form}
            // labelCol={{ sm: 8, xs: 24 }}
            // wrapperCol={{ sm: 16, xs: 24 }}
            onFinish={this.onFinish}
            disabled={this.props.disabled}
          >
            <Row gutter={[10, 10]}>
              <Col span={6}>
                <Form.Item label={"PR.No"} name="prNo">
                  <Input />
                </Form.Item>
                <Form.Item hidden name={"startDate"}>
                  <Input />
                </Form.Item>
                <Form.Item hidden name={"purchaseRequestStatus"}>
                  <Input />
                </Form.Item>
                <Form.Item hidden name={"systemUpdate"}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.List name="purchaseRequestSubList">
              {(fields, { add, remove }) => (
                <table className="sj-table">
                  <thead>
                    <tr>
                      <td>Item Name</td>
                      <td>Item Number</td>
                      <td>Supplier</td>
                      <td>Quantity</td>
                      <td>Pending Quantity</td>
                    </tr>
                  </thead>

                  <tbody>
                    {fields.map((field, index) => (
                      <tr style={{ width: "100%" }} key={field.key}>
                        <td>
                          <Form.Item
                            noStyle
                            name={[index, "sparePartName"]}
                            fieldKey={[field.fieldKey, "sparePartName"]}
                            disabled={this.props.disabled}
                          >
                            <Input readOnly disabled />
                          </Form.Item>
                          <Form.Item
                            noStyle
                            name={[index, "startDate"]}
                            // fieldKey={[field.fieldKey, "startDate"]}
                            hidden
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item hidden name={"pendingQuantity"}>
                            <Input />
                          </Form.Item>
                        </td>
                        <td>
                          <Form.Item
                            noStyle
                            name={[index, "sparePartNumber"]}
                            fieldKey={[field.fieldKey, "sparePartNumber"]}
                          >
                            <Input readOnly disabled={this.props.disabled} />
                          </Form.Item>
                        </td>
                        <td>
                          <Form.Item
                            noStyle
                            name={[index, "supplierId"]}
                            fieldKey={[field.fieldKey, "supplierId"]}
                          >
                            <Select
                              style={{
                                width: "100%",
                                maxWidth: "250px",
                                // overflow: "hidden",
                              }}
                              disabled={this.props.disabled}
                            >
                              {this.state.supplier?.map((e) => (
                                <Option key={e.supplierId} value={e.supplierId}>
                                  {e.supplierName}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </td>
                        <td>
                          <Form.Item
                            noStyle
                            name={[index, "quantity"]}
                            fieldKey={[field.fieldKey, "quantity"]}
                            rules={[
                              {
                                required: true,
                                message: "Please enter your quantity",
                              },
                            ]}
                          >
                            <InputNumber
                              controls={false}
                              style={{ width: "100%" }}
                              autoFocus
                              stringMode={false}
                              maxLength={20}
                              disabled={this.state.startDate ? true : false}
                            />
                          </Form.Item>
                        </td>
                        <td>
                          <Form.Item
                            noStyle
                            name={[index, "pendingQuantity"]}
                            fieldKey={[field.fieldKey, "pendingQuantity"]}
                            rules={[
                              {
                                required: true,
                                message: "Please enter your quantity",
                              },
                            ]}
                          >
                            <InputNumber
                              disabled
                              controls={false}
                              style={{ width: "100%" }}
                              autoFocus
                              stringMode={false}
                              maxLength={20}
                            />
                          </Form.Item>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Form.List>
          </Form>
        </Spin>
      </Popups>
    );
  }
}

export default withForm(PurchaseHistoryForm);
