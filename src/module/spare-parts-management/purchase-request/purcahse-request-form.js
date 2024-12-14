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
import {
  CloseOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
const { Option } = Select;
class PurchaseRequestForm extends PageForm {
  service = new PurchaseHistoryService();
  supplierService = new SupplierService();
  spareRequestService = new InventoryRequestService();
  stockJournalService = new StockJournalService();

  constructor(props) {
    super(props);
    this.state = {
      propId: null,
    };
  }

  componentDidMount() {}
  patchForm(data) {
    if (this.props.id && this.props.id !== this.state.currentId) {
      this.setState({ currentId: this.props.id, isLoading: true });
      this.loadList(this.props.id);
    }
  }

  loadList = () => {
    const { spareRequestService, stockJournalService } = this;
    const { id, form } = this.props;

    Promise.all([
      spareRequestService.retrieve(id),
      stockJournalService.getReport(id),
      spareRequestService.getPendingQuantity(id),
    ])
      .then(([spareResponse, stockJournalResponse, pendingQuantityRes]) => {
        const spareData = spareResponse.data;
        const stockJournalData = stockJournalResponse.data;
        const pendingQuantityData = pendingQuantityRes.data;

        const loadValues = spareData.spareRequestSubList
          .filter((item) => {
            const stockItem = stockJournalData.find(
              (stock) => stock.sparePartId === item.sparePartId
            );
            const pendingItem = pendingQuantityData.find(
              (pending) => pending.sparePartId === item.sparePartId
            );

            const pendingQuantity = pendingItem
              ? pendingItem.pendingQuantity
              : 0;

            return (
              (stockItem ? stockItem.quantity < pendingQuantity : false) &&
              !item.closed
            );
          })
          .map((item) => {
            const stockItem = stockJournalData.find(
              (stock) => stock.sparePartId === item.sparePartId
            );
            const pendingItem = pendingQuantityData.find(
              (pending) => pending.sparePartId === item.sparePartId
            );
            const pendingQuantity = pendingItem
              ? pendingItem.pendingQuantity
              : 0;

            return {
              ...item,
              sparePartName: item.sparePart.sparePartName,
              sparePartNumber: item.sparePart.sparePartNumber,
              supplierId: item.sparePart.supplier.supplierId,
              pendingQuantity,
              maxQuantity:
                pendingQuantity - (stockItem ? stockItem.quantity : 0),
              // closed: true,
            };
          });

        form.setFieldsValue({
          purchaseRequestSubList: loadValues,
        });

        this.setState((state) => ({
          ...state,
          spareData,
          stockJournalData, // Store stockJournalData in the state if needed
          supplier: spareData.spareRequestSubList?.map(
            (e) => e?.sparePart.supplier
          ),
        }));
      })
      .catch((err) => console.log("err", err))
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
      });
  };
  closePopup = (data = false) => {
    this.props.form.resetFields();
    this.props.close();
    this.setState({ currentId: null });
  };
  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
  }
  //   loadValue = () => {

  //       this.props.form.setFieldsValue(
  //         {
  //             this.state.spareData?.spareRequestSubList?.map((e) =>
  //           ...e,
  //         },
  //         console.log("eeee", e)
  //       )
  //     );
  //   };
  onFinish = (value) => {
    this.setState((state) => ({ ...state, isLoading: true }));
    value.spareRequestId = this.props.id;
    value.purchaseRequestStatus = "Requested";
    value.spareRequestSubList = value.purchaseRequestSubList;

    this.service
      .add(value)
      .then(({ data }) => {
        if (data.success) {
          this.onSuccess(data);
        } else {
          message.error(data.message);
        }
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
      });
  };
  render() {
    return (
      <Popups
        width="1000px"
        footer={[
          <Row justify="space-between">
            <Col>
              {
                <Button
                  key="close"
                  onClick={() => {
                    this.props.close();
                  }}
                >
                  Cancel
                </Button>
              }
            </Col>
            <Col>
              {
                // <Link to={"/spare-parts/purchase-history"}>
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => this.props.form.submit()}
                  htmlType="submit"
                >
                  Request Purchase
                </Button>
              }
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
            colon={false}
            // layout="vertical"
            form={this.props.form}
            labelCol={{ sm: 8, xs: 24 }}
            wrapperCol={{ sm: 16, xs: 24 }}
            onFinish={this.onFinish}
            disabled={this.props.disabled}
          >
            <Form.List
              name="purchaseRequestSubList"
              initialValue={{
                closed: true,
              }}
            >
              {(fields, { add, remove }) => (
                <table className="sj-table">
                  <thead>
                    <tr>
                      <td>Item Name</td>
                      <td>Item Number</td>
                      <td>Supplier</td>
                      <td>Pending Quantity</td>
                      <td>Quantity</td>
                    </tr>
                  </thead>

                  <tbody>
                    {fields.map((field, index) => (
                      <tr key={field.key}>
                        <td>
                          <Form.Item
                            noStyle
                            name={[index, "sparePartName"]}
                            fieldKey={[field.fieldKey, "sparePartName"]}
                          >
                            <Input
                              style={{
                                width: "100%",
                                maxWidth: "250px",
                                // overflow: "hidden",
                              }}
                              readOnly
                              disabled
                            />
                          </Form.Item>
                        </td>
                        <td>
                          <Form.Item
                            noStyle
                            name={[index, "sparePartNumber"]}
                            fieldKey={[field.fieldKey, "sparePartNumber"]}
                          >
                            <Input
                              style={{
                                width: "100%",
                                maxWidth: "250px",
                              }}
                              readOnly
                              disabled
                            />
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
                              disabled
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
                              style={{
                                width: "100%",
                                maxWidth: "250px",
                                // overflow: "hidden",
                              }}
                              autoFocus
                              stringMode={false}
                              maxLength={20}
                            />
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
                              min={
                                this.props.form.getFieldValue(
                                  "purchaseRequestSubList"
                                )[index]?.maxQuantity
                              }
                              controls={false}
                              style={{
                                width: "100%",
                                maxWidth: "250px",
                                // overflow: "hidden",
                              }}
                              autoFocus
                              stringMode={false}
                              maxLength={20}
                            />
                          </Form.Item>
                        </td>
                        <td>
                          <Form.Item noStyle>
                            {fields.length > 1 ? (
                              <Button onClick={() => remove(field.name)}>
                                <CloseOutlined />
                              </Button>
                            ) : null}
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

export default withForm(PurchaseRequestForm);
