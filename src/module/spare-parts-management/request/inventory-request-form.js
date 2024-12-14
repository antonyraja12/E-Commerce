import {
  Button,
  Col,
  Form,
  Row,
  Spin,
  message,
  Select,
  InputNumber,
  Input,
  Checkbox,
  DatePicker,
  Table,
} from "antd";
import {
  CloseOutlined,
  PlusOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import moment from "moment";
import React from "react";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import InventoryRequestService from "../../../services/inventory-services/inventory-request-service";
import PurchaseHistoryForm from "../purchase-request/purchase-history-form";
import SerialNumberPopup from "../stock-journal/serial-Number-popup";
import InventoryConfigurationService from "../../../services/inventory-services/inventory-configuration-service";
import dayjs from "dayjs";
import StockJournalService from "../../../services/inventory-services/stock-journal-service";
import DispatchSpareService from "../../../services/inventory-services/dispatch-spare-service";
import PurchaseRequestForm from "../purchase-request/purcahse-request-form";
import { validateEmail, validateNumber } from "../../../helpers/validation";
const { Option } = Select;
class InventoryRequestForm extends PageForm {
  state = {
    hasCritical: false,
    stockInData: [],
    sortedStockInData: [],
    selectedRows: [],
    uniquePrices: [],
    isLoading: false,
  };
  spareRequestService = new InventoryRequestService();
  service = new DispatchSpareService();
  inventoryConfigurationService = new InventoryConfigurationService();
  stockJournalService = new StockJournalService();
  onSuccess(data) {
    this.setState((state) => ({ ...state, data: data.data, isLoading: true }));
  }

  componentDidMount() {
    if (this.props.id) {
      this.list();
    }
    this.props.form.setFieldsValue({
      date: dayjs(),
    });
  }

  list = () => {
    Promise.all([
      this.spareRequestService.getPendingQuantity(this.props.id),
      this.stockJournalService.getReport(),
    ])
      .then(([spareRequestResponse, stockJournalResponse]) => {
        const spareRequestData = spareRequestResponse.data;
        const stockJournalData = stockJournalResponse.data;
        this.setDispatchTable(spareRequestData, stockJournalData);
        this.setState((state) => ({
          ...state,
          spareRequestData: spareRequestData,
          stockJournalData: stockJournalData,
        }));
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
      });
  };
  patchForm(data) {
    if (this.props.id && this.props.id !== this.state.currentId) {
      this.list();
      this.setState({ currentId: this.props.id, isLoading: true });
    }
    this.props.form.setFieldsValue({
      date: dayjs(),
    });
  }

  setDispatchTable = (responseArray, stockJournalData) => {
    const dispatchItemsWithQuantity = responseArray
      ?.map((item) => {
        if (item.pendingQuantity === 0) {
          return null;
        }
        const stockJournalEntry = stockJournalData?.find(
          (journal) => journal?.sparePartId === item.sparePartId
        );

        let dispatchQuantity = null;
        if (!item?.hasCritical) {
          if (stockJournalEntry) {
            dispatchQuantity =
              stockJournalEntry.quantity >= item.pendingQuantity
                ? item.pendingQuantity
                : null;
          }
        }

        return {
          ...item,
          sparePartName: item?.sparePartName,
          availableQuantity: stockJournalEntry ? stockJournalEntry.quantity : 0,
          dispatchedQuantity: dispatchQuantity,
          pendingQuantity: item.pendingQuantity ? item.pendingQuantity : 0,
        };
      })
      .filter((item) => item !== null);

    this.setState((state) => ({
      ...state,
      dispatchItemsWithQuantity: dispatchItemsWithQuantity,
    }));
    this.props.form.setFieldsValue({
      dispatchItems: dispatchItemsWithQuantity,
      spareRequestId: this.props.id,
    });
  };

  openPurchaseModal = (value) => {
    this.setState({
      ...this.state,
      purchaseModal: {
        open: true,
        mode: "Update",
        title: "Purchase History",
        id: value,
        data: this.state.data,
        disabled: false,
      },
    });
  };
  purchaseButton = (status) => {
    return status ? (
      <Button
        type="primary"
        disabled
        onClick={() => this.openPurchaseModal(this.props.id)}
      >
        Purchase Requested
      </Button>
    ) : (
      <Button
        type="primary"
        onClick={() => this.openPurchaseModal(this.props.id)}
      >
        Purchase
      </Button>
    );
  };
  loadAvailability(id) {
    this.service
      .getAvailability({ sparePartId: id })
      .then(({ data }) => {
        this.setState((state) => ({ ...state, avail: data.quantity }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
      });
    this.inventoryConfigurationService.retrieve(id).then(({ data }) => {
      if (data?.hasCritical) {
        this.setState((state) => ({
          ...state,
          sparePartId: id,
          hasCritical: true,
        }));
        this.stockJournalService
          .getStockDetails({ sparePartId: id, stockValue: "IN" })
          .then(({ data }) => {
            this.setState((state) => ({
              ...state,
              stockInData: data,
              sortedStockInData: data,
              serialNo: [],
              uniquePrices: [...new Set(data.map((e) => e.price))],
            }));
          });
      } else {
        this.setState((state) => ({
          ...state,
          hasCritical: false,
        }));
      }
    });
  }
  closeOrderPopup = () => {
    this.setState((state) => ({
      ...state,
      data: null,
      avail: null,
      currentId: null,
    }));
    this.props.closeOrderPopup();
    this.props.form.resetFields();
  };
  closePurchasePopup = () => {
    this.setState((state) => ({
      ...state,
      purchasePopup: {
        open: false,
      },
    }));
    // this.props.form.resetFields();
    this.list();
  };
  closePurchaseModal = () => {
    this.props.closeOrderPopup();
    this.setState((state) => ({ ...state, purchaseModal: { open: false } }));
  };
  textContainerStyle = {
    lineHeight: "1.2",
  };

  paraStyle = {
    lineHeight: "1",
    marginBottom: "5px",
    color: "#C7C1C1",
  };
  headStyle = {
    lineHeight: "1.5",
    marginTop: "0",
  };
  openModal = () => {
    if (this.state.hasCritical) {
      this.setState((state) => ({ ...state, openModal: true }));
    } else {
      this.props.form.submit();
    }
  };
  onCancel = () => {
    this.setState((state) => ({ ...state, openModal: false }));
  };
  onSelectPrice = (value) => {
    this.setState({
      sortedStockInData: this.state.stockInData.filter(
        (item) => item.price === value
      ),
    });
  };
  getTableData = () => {
    return this.state.sortedStockInData.map((item, index) => ({
      key: index + 1,
      ...item,
    }));
  };
  okModalSave = (data, price) => {
    const serialData = data?.map((e) => ({ serialNumber: e }));
    let quantity = 0;
    const form = this.props.form;
    let obj = [...form.getFieldValue("dispatchItems")];

    quantity = serialData.length ? serialData.length : 0;
    this.setState((state) => ({ ...state, openModal: false }));

    obj[this.state.index] = {
      ...obj[this.state.index],
      dispatchItemSubs: serialData,
      dispatchedQuantity: quantity,
    };

    form.setFieldValue("dispatchItems", obj);
  };
  onFinish = (data) => {
    this.setState((state) => ({ ...state, isLoading: true }));
    this.service
      .add(data)
      .then(({ data, statuscode }) => {
        if (data.success) {
          message.success(data.message);
        }
      })
      .catch((err) => {
        console.log("catch error", err);
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
        this.closeOrderPopup();

        this.list();
      });
  };
  findHasCritical = (id) => {
    this.inventoryConfigurationService.retrieve(id).then(({ data }) => {
      if (data?.hasCritical) {
        return true;
      } else {
        return false;
      }
    });
  };
  openPopup = (index, id, pendingQuantity, sparePartName) => {
    this.stockJournalService
      .getStockDetails({
        sparePartId: id,
        // availabilityStatus: "Available",
      })
      .then(({ data }) => {
        this.setState((state) => ({ ...state, isLoading: true }));
        this.inventoryConfigurationService.retrieve(id).then((res) => {
          if (res.data?.hasCritical) {
            if (data.length > 0) {
              this.setState((state) => ({
                ...state,
                sparePartName: res.data.sparePartName,
                pendingQuantity: pendingQuantity,
                openModal: true,
                index: index,
                stockInData: data,
                sortedStockInData: data,
                serialNo: [],
                uniquePrices: [...new Set(data.map((e) => e.price))],
              }));
            } else {
              message.error("Please purchase a stock!!!");
            }
          }
          this.setState((state) => ({ ...state, isLoading: false }));
        });
      });
  };

  validateDispatchQuantity = (rule, value, callback, index) => {
    const pendingQuantity = this.props.form.getFieldValue([
      "dispatchItems",
      index,
      "pendingQuantity",
    ]);
    const availableQuantity = this.props.form.getFieldValue([
      "dispatchItems",
      index,
      "availableQuantity",
    ]);

    if (value <= 0) {
      callback("Dispatched quantity should be greater than zero");
    } else if (value > pendingQuantity) {
      callback("Dispatched quantity cannot be greater than pending quantity");
    } else if (value > availableQuantity) {
      callback("Dispatched quantity cannot be greater than available quantity");
    } else {
      callback();
    }
  };
  openPurchasePopup = (id) => {
    this.setState((state) => ({
      ...state,
      purchasePopup: {
        open: true,
        id: id,
        mode: "Add",
        title: `Purchase Request`,
        disabled: false,
        // isLoading: true,
      },
    }));
  };
  disableButton = () => {
    const { spareRequestData } = this.state;
    const { id, form } = this.props;

    const filteredItem = spareRequestData?.find((e) => e.spareRequestId === id);
    const dispatchItems = form.getFieldValue("dispatchItems");

    const isQuantityValid = dispatchItems?.every((item) => {
      const { availableQuantity, requestedQuantity } = item;
      return availableQuantity >= requestedQuantity;
    });
    return filteredItem?.purchased || isQuantityValid;
  };

  render() {
    const tableData =
      this.state.stockInData.length > 0
        ? !this.state.hasCritical && this.getTableData()
        : [];
    const columns = [
      {
        title: "Serial Number",
        dataIndex: "serialNumber",
        width: "50%",
      },
      {
        title: "Price",
        dataIndex: "price",
        width: "30%",
      },
    ];

    return (
      <Popups
        title={this.props?.title}
        open={this.props?.open}
        width={1100}
        onCancel={this.closeOrderPopup}
        footer={[
          <Row justify="space-between">
            <Col>
              <Button key="close" onClick={this.closeOrderPopup}>
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                disabled={this.disableButton()}
                type="primary"
                style={{ marginRight: "8px" }}
                onClick={() => this.openPurchasePopup(this.props.id)}
              >
                Purchase
              </Button>
              <Button
                key="submit"
                type="primary"
                onClick={this.props.form?.submit}
                htmlType="submit"
              >
                Dispatch
              </Button>
            </Col>
          </Row>,
        ]}
      >
        <Form onFinish={this.onFinish} size="small" form={this.props.form}>
          <Spin spinning={this.state.isLoading}>
            <Row gutter={[10, 10]}>
              <Col md={6} lg={6} xs={6}>
                <Form.Item name={"spareRequestId"} label="IR.NO">
                  <Select disabled onChange={this.setDispatchTable}>
                    {this.state.spareRequestData?.map((e) => (
                      <Option key={e?.spareRequestId} value={e?.spareRequestId}>
                        {e?.spareRequestNumber}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col md={5} lg={5} xs={5}>
                <Form.Item
                  name={"date"}
                  label="Date"
                  rules={[
                    { required: true, message: "Please select any date " },
                  ]}
                >
                  <DatePicker
                    disabledDate={(current) => {
                      return current && current < dayjs().startOf("day");
                    }}
                    format={"DD-MM-YYYY"}
                  />
                </Form.Item>
              </Col>
              <Col md={6} lg={6} xs={6}>
                <Form.Item name={"description"} label="Description">
                  <Input.TextArea rows={1} />
                </Form.Item>
              </Col>
              <Col xs={24} lg={24} md={24}>
                <Form.List name="dispatchItems">
                  {(fields, { add, remove }) => (
                    <>
                      <table className="sj-table">
                        <thead>
                          <tr>
                            <th>Item Name</th>
                            <th>Requested Quantity</th>
                            <th>Available Quantity</th>
                            <th>Pending Quantity</th>
                            <th>Dispatch Quantity</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {fields.map((field, index) => (
                            <tr key={field.key}>
                              <td>
                                <Form.Item
                                  noStyle
                                  {...field}
                                  label="Item Name"
                                  name={[field.name, "sparePartName"]}
                                  rules={[
                                    {
                                      required: true,
                                    },
                                  ]}
                                >
                                  <Input
                                    style={{
                                      width: "100%",
                                      maxWidth: "250px",
                                      // overflow: "hidden",
                                    }}
                                    controls={false}
                                    readOnly
                                  />
                                </Form.Item>
                              </td>
                              <td>
                                <Form.Item
                                  noStyle
                                  label="Requested Quantity"
                                  name={[field.name, "requestedQuantity"]}
                                  rules={[
                                    {
                                      required: true,
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    style={{
                                      width: "100%",
                                      maxWidth: "250px",
                                      // overflow: "hidden",
                                    }}
                                    controls={false}
                                    onInput={() =>
                                      this.calculateTotal("stockInList", index)
                                    }
                                    readOnly
                                  />
                                </Form.Item>
                              </td>
                              <td>
                                <Form.Item
                                  noStyle
                                  {...field}
                                  label="Available Quantity"
                                  name={[field.name, "availableQuantity"]}
                                  rules={[
                                    {
                                      required: true,
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    style={{
                                      width: "100%",
                                      maxWidth: "250px",
                                      // overflow: "hidden",
                                    }}
                                    readOnly
                                    controls={false}
                                  />
                                </Form.Item>
                              </td>
                              <td>
                                <Form.Item
                                  noStyle
                                  {...field}
                                  label="Pending Quantity"
                                  name={[field.name, "pendingQuantity"]}
                                >
                                  <InputNumber
                                    style={{
                                      width: "100%",
                                      maxWidth: "250px",
                                      // overflow: "hidden",
                                    }}
                                    readOnly
                                  />
                                </Form.Item>
                              </td>
                              <td>
                                <Form.Item
                                  noStyle
                                  {...field}
                                  label="Dispatch Quantity"
                                  name={[field.name, "dispatchedQuantity"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Enter dispatch quantity",
                                    },
                                    {
                                      validator: (rule, value, callback) =>
                                        this.validateDispatchQuantity(
                                          rule,
                                          value,
                                          callback,
                                          index
                                        ),
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    min={1}
                                    // onClick={() => {
                                    //   this.openPopup(
                                    //     index,
                                    //     this.props.form.getFieldValue([
                                    //       "dispatchItems",
                                    //       index,
                                    //       "sparePartId",
                                    //     ]),
                                    //     this.props.form.getFieldValue([
                                    //       "dispatchItems",
                                    //       index,
                                    //       "requestedQuantity",
                                    //     ]),
                                    //     this.props.form.getFieldValue([
                                    //       "dispatchItems",
                                    //       index,
                                    //       "sparePartName",
                                    //     ])
                                    //   );
                                    // }}
                                    readOnly={this.props.form.getFieldValue([
                                      "dispatchItems",
                                      index,
                                      "hasCritical",
                                    ])}
                                    style={{
                                      width: "80%",
                                      maxWidth: "250px",
                                    }}
                                  />
                                </Form.Item>
                                <Button
                                  type="primary"
                                  icon={<ProfileOutlined />}
                                  style={{ marginLeft: "20px" }}
                                  disabled={
                                    !this.props.form.getFieldValue([
                                      "dispatchItems",
                                      index,
                                      "hasCritical",
                                    ])
                                  }
                                  onClick={() => {
                                    this.openPopup(
                                      index,
                                      this.props.form.getFieldValue([
                                        "dispatchItems",
                                        index,
                                        "sparePartId",
                                      ]),
                                      this.props.form.getFieldValue([
                                        "dispatchItems",
                                        index,
                                        "pendingQuantity",
                                      ]),
                                      this.props.form.getFieldValue([
                                        "dispatchItems",
                                        index,
                                        "dispatchItemSubs",
                                      ])
                                    );
                                  }}
                                ></Button>
                                <Form.Item
                                  hidden
                                  {...field}
                                  name={[field.name, "sparePartId"]}
                                >
                                  <Input />
                                </Form.Item>
                              </td>
                              <td>
                                {fields.length > 1 ? (
                                  <CloseOutlined
                                    onClick={() => remove(field.name)}
                                  />
                                ) : null}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </Form.List>
              </Col>
            </Row>
          </Spin>
        </Form>
        {/* <PurchaseHistoryForm
          {...this.state.purchaseModal}
          onClose={this.closePurchaseModal}
        /> */}
        <PurchaseRequestForm
          {...this.state.purchasePopup}
          close={this.closePurchasePopup}
        />
        <SerialNumberPopup
          mode={true}
          openModal={this.state.openModal}
          onCancel={this.onCancel}
          okModalSave={this.okModalSave}
          columns={columns}
          data={tableData}
          sparePartName={this.state.sparePartName}
          uniquePrices={this.state.uniquePrices}
          pendingQuantity={this.state.pendingQuantity}
        />
      </Popups>
    );
  }
}

export default withForm(InventoryRequestForm);
