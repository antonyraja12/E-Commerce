import {
  CalendarOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Table,
  message,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import React, { createRef, useRef } from "react";
import InventoryConfigurationService from "../../../services/inventory-services/inventory-configuration-service";
import PurchaseHistoryService from "../../../services/inventory-services/purchase-history-service";
import StockJournalService from "../../../services/inventory-services/stock-journal-service";
import Page from "../../../utils/page/page";
import PageForm from "../../../utils/page/page-form";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";
import "./stock-journal.css";
import SerialNumberPopup from "./serial-Number-popup";

const { Option } = Select;
class StockJournalForm extends PageForm {
  constructor(props) {
    super(props);
    this.modal2Ref = React.createRef();
  }
  state = {
    form: {},
    inLength: 0,
    outLength: 0,
    errorMessage: "",
    openModal: false,
    openModal2: false,
    serialNo: [],
    stockInData: [],
    sortedStockInData: [],
    selectedRows: [],
    uniquePrices: [],
    loading: false,
    iconStatus: false,
  };
  modalRef = React.createRef();
  // modal2Ref = React.createRef();
  closePopup = () => {
    this.props.navigate("/spare-parts/stock-journal");
  };
  purchaseHistoryService = new PurchaseHistoryService();
  onSuccess(data) {
    if (data.success) {
      super.onSuccess(data);
      this.closePopup();
    } else {
      this.setState({ errorMessage: data.message });
    }
  }
  onFailure(data) {
    this.setState({ errorMessage: data.message });
  }
  columns = [
    {
      title: "S.No",
      dataIndex: "stockInId",
      key: "sno",
      render: (value, index, record) => {
        return record + 1;
      },
    },
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
      key: "serialNumber",
    },
  ];
  // state = { form: {}, inLength: 0, outLength: 0 };
  service = new StockJournalService();
  InventoryService = new InventoryConfigurationService();
  componentDidMount() {
    this.setState((state) => ({
      ...state,
      title: "Add Stock Journal",
      openModal: false,
      isLoading: false,
      hasCriticalIds: [],
      disabledIndices: [],
    }));
    this.modal2Ref.current?.focus();
    Promise.all([this.InventoryService.list()]).then((response) => {
      this.setState((state) => ({
        ...state,
        spareOptions: response[0].data?.map((e) => ({
          label: e.sparePartName + " / " + e.sparePartNumber,
          value: e.sparePartId,
        })),
      }));
    });

    if (this.props.params.id) {
      this.onRetrieve(this.props.params.id);
      if (this.props.mode === "View") {
        this.service.retrieve(this.props.params.id).then(({ data }) => {
          this.onRefTypeChange(data?.stockType);
        });
        this.setState((state) => ({
          ...state,
          title: "View Stock Journal",
          disabled: true,
        }));
      }
    }

    super.componentDidMount();
    this.props.form.setFieldValue(
      "date",
      dayjs(dayjs().format("DD-MM-YYYY"), "DD-MM-YYYY")
    );

    if (this.props?.location && this.props?.location?.state) {
      this.setState((state) => ({
        ...state,
        isDisable: true,
        isLoading: true,
      }));
      this.onRefTypeChange("Purchase");
      this.props.form.setFieldValue("stockType", "Purchase");
      this.props.form.setFieldValue("prNos", this.props?.location?.state);

      this.fetchPurchaseStock(this.props?.location?.state);
    }
  }
  patchForm(data) {
    if (this.props.form) {
      this.onRefTypeChange(data?.stockType);
      this.props.form.setFieldValue(
        "date",
        dayjs(dayjs().format("DD-MM-YYYY"), "DD-MM-YYYY")
      );
      if (data.stockType === "Purchase") {
        this.setState((state) => ({
          ...state,
          purchaseView: true,
        }));
      } else this.setState((state) => ({ ...state, purchaseView: false }));

      this.props.form.setFieldsValue({
        ...data,
        date: moment(data.date),
        description: data.description,
        refNo: data.refNo,
      });

      this.setState((state) => ({
        ...state,
        inLength: data.stockInList.length,
        outLength: data.stockOutList.length,
        title:
          this.props.mode == "Edit"
            ? "Update Stock Journal"
            : "View Stock Journal",
      }));
      const distinctArray = data?.stockInList.reduce((acc, current) => {
        const x = acc.find((item) => item.masterId === current.masterId);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      let mappedData = [];
      for (let x in distinctArray) {
        if (distinctArray[x]?.masterId == null) {
          mappedData.push(distinctArray[x]);
        } else {
          const filterData = data?.stockInList?.filter(
            (e) => e.masterId === distinctArray[x]?.masterId
          );
          this.setState((state) => ({
            ...state,
            hasCriticalIds: [
              ...state.hasCriticalIds,
              filterData[0]?.sparePartId,
            ],
          }));
          if (!this.state.disabledIndices.includes(x)) {
            this.setState((state) => ({
              disabledIndices: [...state.disabledIndices, parseInt(x)],
            }));
          }
          distinctArray[x].quantity = filterData[0]?.stockInSub?.length;
          distinctArray[x].expiryDate = dayjs(distinctArray[x].expiryDate);
          mappedData.push(distinctArray[x]);
        }
      }
      const fieldsValue = { stockInList: mappedData };

      this.props.form.setFieldsValue(fieldsValue);
    }
  }
  onRefTypeChange = (value) => {
    if (this.props.mode == "Add") {
      if (value == "Purchase") {
        this.purchaseHistoryService
          .list({ status: "Requested" })
          .then(({ data }) => {
            this.setState((state) => ({ ...state, purchaseHistory: data }));
          });
        this.setState((state) => ({ ...state, purchaseView: true }));
      } else this.setState((state) => ({ ...state, purchaseView: false }));
    } else if (this.props.mode == "Edit") {
      if (value == "Purchase") {
        this.purchaseHistoryService.list().then(({ data }) => {
          this.setState((state) => ({ ...state, purchaseHistory: data }));
        });
        this.setState((state) => ({ ...state, purchaseView: false }));
      } else this.setState((state) => ({ ...state, purchaseView: false }));
    } else {
      this.purchaseHistoryService.list().then(({ data }) => {
        this.setState((state) => ({ ...state, purchaseHistory: data }));
      });
      this.setState((state) => ({ ...state, purchaseView: false }));
    }
  };
  disabledDate = (d) => {
    const date = dayjs().set("date", dayjs().get("date") - 7);
    return d && d < date;
  };

  fetchPrice = (mode, index, value) => {
    const form = this.props.form;
    let obj = [...form.getFieldValue(mode)];
    this.InventoryService.retrieve(value).then(({ data }) => {
      if (data?.hasCritical) {
        this.setState((state) => ({
          ...state,
          openModal: mode == "stockInList" ? false : true,
          // openModal2: mode == "stockInList" ? true : false,
          index: index,
          stockMode: mode,
          quantityReadonly: true,
          sparePartId: value,
          expiryDate: true,
          hasCriticalIds: [...state.hasCriticalIds, value],
        }));
        if (data.totalCycleCount) {
          const month = data.maintenancePeriod * data.totalCycleCount;
          obj[index].expiryDate = dayjs().add(month, "month");
          form.setFieldsValue({ [mode]: obj });
          if (!this.state.disabledIndices.includes(index)) {
            this.setState((state) => ({
              disabledIndices: [...state.disabledIndices, index],
            }));
          }
        } else {
          obj[index].expiryDate = null;
          form.setFieldsValue({ [mode]: obj });
          if (this.state.disabledIndices.includes(index)) {
            this.setState((state) => ({
              disabledIndices: state.disabledIndices.filter(
                (idx) => idx !== index
              ),
            }));
          }
        }
        if (mode == "stockOutList") {
          this.service
            .getStockDetails({
              sparePartId: data?.sparePartId,
              availabilityStatus: "Available",
            })
            .then(({ data }) => {
              this.setState((state) => ({
                ...state,
                stockInData: data,
                sortedStockInData: data,
                serialNo: [],
                uniquePrices: [...new Set(data.map((e) => e.price))],
              }));
            });
        }
      }

      this.setState((state) => ({ ...state, quantityReadonly: false }));
      let total =
        Number(obj[index]?.price ?? 0) * Number(obj[index]?.quantity ?? 0);
      obj[index] = { ...obj[index], price: data.price, totalValue: total };
      form.setFieldValue(mode, obj);
    });
  };

  setStockInData = (data) => {
    const mappedData = data.flatMap((e) =>
      e.purchaseRequestSubList
        .filter((v) => !v.purchased && v?.pendingQuantity != 0)
        .map((v) => ({
          sparePartId: v?.sparePartId,
          quantity: v?.pendingQuantity,
          price: v?.sparePart?.price,
          expiryDate: v?.expiryDate,
          totalValue: v?.quantity * v?.sparePart?.price,
        }))
    );

    const fieldsValue = { stockInList: mappedData };

    this.props.form.setFieldsValue(fieldsValue);
  };

  fetchPurchaseStock = (ids) => {
    const id = Array.isArray(ids) ? ids : [ids];
    if (id.length) {
      this.purchaseHistoryService
        .list({ purchaseRequestId: id })
        .then(({ data }) => {
          const criticalIds = data.flatMap((value) =>
            value.purchaseRequestSubList
              .filter((e) => e.sparePart.hasCritical === true)
              .map((e) => e.sparePartId)
          );
          this.setState((state) => ({
            ...state,
            hasCriticalIds: criticalIds,
          }));
          data.forEach((item) => {
            item.purchaseRequestSubList.forEach((subItem, subIndex) => {
              if (subItem.sparePart.hasCritical) {
                const totalCycleCount = subItem.sparePart.totalCycleCount;
                const maintenancePeriod = subItem.sparePart.maintenancePeriod;
                if (totalCycleCount) {
                  const month = maintenancePeriod * totalCycleCount;
                  subItem.expiryDate = dayjs().add(month, "month");
                  this.setState((state) => ({
                    disabledIndices: [...state.disabledIndices, subIndex],
                  }));
                } else {
                  this.setState((state) => ({
                    disabledIndices: state.disabledIndices.filter(
                      (idx) => idx !== subIndex
                    ),
                  }));
                }
              }
            });
          });
          this.setStockInData(data);
        });
    } else {
      this.setStockInData([]);
    }
    this.setState((state) => ({ ...state, isLoading: false }));
  };

  calculateTotal = (mode, index) => {
    const form = this.props.form;
    let obj = [...form.getFieldValue(mode)];

    let total =
      Number(obj[index]?.price ?? 0) * Number(obj[index]?.quantity ?? 0);
    obj[index] = { ...obj[index], totalValue: total };
    form.setFieldValue(mode, obj);
  };
  onFinish1 = (values) => {
    if (!Array.isArray(values.prNos)) {
      values.prNos = [values.prNos];
    }
    const stockInListLength = values.stockInList
      ? values.stockInList.length
      : 0;
    const stockOutListLength = values.stockOutList
      ? values.stockOutList.length
      : 0;

    if (stockInListLength === 0 && stockOutListLength === 0) {
      const errorMessage =
        "Either Stock In or Stock Out must have at least one item.";
      this.setState({ errorMessage });
      message.error(errorMessage);
      return;
    }

    const newData = {
      ...values,
      stockInList: values.stockInList || [],
      stockOutList: values.stockOutList || [],
    };

    this.onFinish(newData);
    // if (values.prNos) {
    //   if (values.stockInList) {
    //     values.prNos?.map((e) =>
    //       this.purchaseHistoryService.updatePurchaseRequestStatus(e, "Closed")
    //     );
    //   }
    // }
  };
  onSelect = (id) => {
    // this.setState({ serialNo: [] });

    this.setState((prevState) => ({
      serialNo: [...prevState.serialNo, { stockInId: id }],
    }));
  };
  onCancel = () => {
    if (this.state.stockMode == "stockOutList") {
      this.setState((state) => ({ ...state, openModal: false }));
    } else {
      this.setState((state) => ({ ...state, openModal2: false }));
    }
  };
  okModalSave = (data) => {
    const serialData = data?.map((e) => ({ serialNumber: e }));
    let quantity = 0;
    const form = this.props.form;
    let obj = [...form.getFieldValue(this.state.stockMode)];
    quantity = serialData.length ? serialData.length : 0;
    this.setState((state) => ({
      ...state,
      iconStatus: true,
      openModal: false,
    }));
    let total = Number(obj[this.state.index]?.price ?? 0) * quantity;
    obj[this.state.index] = {
      ...obj[this.state.index],
      price: Number(obj[this.state.index]?.price ?? 0),
      totalValue: total,
      quantity: quantity,
      criticalStockInMapping: serialData,
    };
    form.setFieldValue(this.state.stockMode, obj);
    // this.modalRef.current.resetFields();
  };

  start = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ setSelectedRowKeys: [], loading: false });
    }, 1000);
  };

  onSelectChange = (selectedRows) => {
    this.setState({ selectedRows });
  };
  onNotificationTypeChange = ({ target }) => {
    if (target.value == "count") {
      this.setState((state) => ({
        ...state,
        expiryDate: false,
        notificationValue: target.value,
      }));
    } else {
      this.setState((state) => ({
        ...state,
        expiryDate: true,
        notificationValue: target.value,
      }));
    }
  };
  getTableData = () => {
    return this.state.sortedStockInData.map((item, index) => ({
      key: index + 1,
      ...item,
    }));
  };

  onSelectPrice = (value) => {
    this.setState({
      sortedStockInData: this.state.stockInData.filter(
        (item) => item.price === value
      ),
    });
  };

  onExpiryModalFinish = () => {
    const data = this.modal2Ref.current?.getFieldsValue();

    const form = this.props.form;
    let quantity = 0;
    let obj = [...form.getFieldValue(this.state.stockMode)];

    this.setState((state) => ({ ...state, openModal2: false }));
    let total = Number(obj[this.state.index]?.price ?? 0) * quantity;
    obj[this.state.index] = {
      ...obj[this.state.index],
      price: Number(obj[this.state.index]?.price ?? 0),
      // totalValue: total,
      // quantity: quantity,
      expiryDate: data.expiryDate ? data.expiryDate : null,
      totalCycleCount: data?.totalCycleCount ? data.totalCycleCount : null,
    };

    form.setFieldValue(this.state.stockMode, obj);
  };
  render() {
    let data = this.state.stockInData.length > 0 ? this.getTableData() : [];
    this.modalRef.current?.setFieldValue("price", this.state.uniquePrices[0]);
    const disablePastDates = (current) => {
      // Disable dates before today
      return current && current < dayjs().startOf("day");
    };
    const rowSelection = {
      onChange: this.onSelectChange,
    };
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
      <Page title={this.state.title}>
        <Form
          name="dynamic_form_nest_item"
          form={this.props.form}
          onFinish={this.onFinish1}
          // onValuesChange={this.handleTotal}
          autoComplete="off"
          size="small"
          layout="vertical"
          disabled={this.state?.disabled}
        >
          <Spin spinning={!!this.state.isLoading}>
            <Row gutter={[10, 10]}>
              <Col md={3} xs={24} sm={24}>
                <Form.Item
                  name="date"
                  label="Date"
                  // style={{ minWidth: "180px" }}
                  rules={[{ required: true, message: "Missing date" }]}
                >
                  <DatePicker
                    format={"DD-MM-YYYY"}
                    // style={{ width: "100%" }}
                    onChange={this.state.onChange}
                    disabledDate={this.disabledDate}
                    defaultValue={dayjs(
                      dayjs().format("DD-MM-YYYY"),
                      "DD-MM-YYYY"
                    )}
                  />
                </Form.Item>
              </Col>
              <Col md={4} xs={24} sm={24}>
                <Form.Item
                  name="refNo"
                  label="Ref No"
                  // style={{ minWidth: "180px" }}
                  rules={[{ required: true, message: "Missing refno" }]}
                >
                  <Input
                    showSearch
                    // style={{ width: "100%" }}
                    placeholder="Ref No"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col md={4} xs={24} sm={24}>
                <Form.Item
                  name="stockType"
                  label="Ref Type"
                  // style={{ minWidth: "180px" }}
                  // rules={[{ required: true, message: "Missing ref type" }]}
                >
                  <Select
                    placeholder="Reference Type"
                    onChange={this.onRefTypeChange}
                    disabled={this.state.isDisable}
                  >
                    <Option value="Sale">Sales</Option>
                    <Option value="Purchase">Purchase </Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col md={4} xs={24} sm={24}>
                <Form.Item
                  label="Purchase Request"
                  name="prNos"
                  // style={{ minWidth: "180px" }}
                >
                  <Select
                    mode="multiple"
                    onChange={this.fetchPurchaseStock}
                    placeholder="Purchase Request"
                    disabled={
                      this.state?.disabled
                        ? this.state?.disabled
                        : !this.state.purchaseView || this.state.isDisable
                    }
                  >
                    {this.state.purchaseHistory?.map((e) => (
                      <Option
                        key={e.purchaseRequestId}
                        value={e.purchaseRequestId}
                      >
                        {e.prNo}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col md={8} xs={24} sm={24}>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true, message: "Missing description" }]}
                >
                  <Input.TextArea
                    rows={1}
                    // style={{ width: "100%" }}
                    placeholder="Description"
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[10, 10]}>
              <Col lg={{ flex: "auto" }}>
                {(this.state.inLength > 0 || this.props.mode !== "View") && (
                  <Card title="Stock In">
                    <Form.List name="stockInList">
                      {(fields, { add, remove }) => (
                        <>
                          <table className="sj-table">
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Rate</th>
                                <th>Total</th>
                                <th>Expiry</th>
                                {/* {this.state?.hasCriticalIds && <th>Expiry</th>} */}
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {fields.map((field, index) => (
                                <tr key={field.key}>
                                  <td style={{ width: "40%" }}>
                                    <Form.Item
                                      hidden
                                      name={[field.name, "masterId"]}
                                    />
                                    {/* <Form.Item
                                      hidden
                                      name={[field.name, "expiryDate"]}
                                    /> */}
                                    <Form.Item
                                      hidden
                                      name={[field.name, "totalCycleCount"]}
                                    />

                                    <Form.Item
                                      noStyle
                                      {...field}
                                      label="Item Name"
                                      name={[field.name, "sparePartId"]}
                                      rules={[{ required: true }]}
                                    >
                                      <Select
                                        disabled={this.state.isDisable}
                                        style={{
                                          width: "100%",
                                          maxWidth: "250px",
                                          // overflow: "hidden",
                                        }}
                                        showSearch
                                        placeholder="Item Name"
                                        optionFilterProp="label"
                                        options={this.state.spareOptions}
                                        onChange={(value) =>
                                          this.fetchPrice(
                                            "stockInList",
                                            index,
                                            value
                                          )
                                        }
                                      />
                                    </Form.Item>
                                  </td>
                                  <td>
                                    <Form.Item
                                      noStyle
                                      label="Quantity"
                                      name={[field.name, "quantity"]}
                                      rules={[{ required: true }]}
                                    >
                                      <InputNumber
                                        // disabled={this.state.isDisable}
                                        controls={false}
                                        placeholder="Quantity"
                                        onInput={() =>
                                          this.calculateTotal(
                                            "stockInList",
                                            index
                                          )
                                        }
                                      />
                                    </Form.Item>
                                  </td>
                                  <td>
                                    <Form.Item
                                      noStyle
                                      label="Price"
                                      {...field}
                                      name={[field.name, "price"]}
                                      rules={[{ required: true }]}
                                    >
                                      <InputNumber
                                        onInput={() =>
                                          this.calculateTotal(
                                            "stockInList",
                                            index
                                          )
                                        }
                                        readOnly
                                        controls={false}
                                        placeholder="Price"
                                      />
                                    </Form.Item>
                                  </td>
                                  <td>
                                    <Form.Item
                                      noStyle
                                      label="Total"
                                      {...field}
                                      name={[field.name, "totalValue"]}
                                    >
                                      <InputNumber
                                        readOnly
                                        placeholder="Total"
                                      />
                                    </Form.Item>
                                  </td>
                                  <td>
                                    {this.state?.hasCriticalIds?.includes(
                                      this.props.form.getFieldValue([
                                        "stockInList",
                                        index,
                                        "sparePartId",
                                      ])
                                    ) && (
                                      // <Button
                                      //   // disabled={!this.state.disabled}
                                      //   onClick={() => {
                                      //     this.setState((state) => ({
                                      //       ...state,
                                      //       openModal2: true,
                                      //       expiryDate: true,
                                      //       stockMode: "stockInList",
                                      //       index: index,
                                      //       iconStatus: true,
                                      //     }));
                                      //   }}
                                      //   icon={<CalendarOutlined />}
                                      // ></Button>
                                      <Form.Item
                                        noStyle
                                        label="Expiry"
                                        {...field}
                                        name={[field.name, "expiryDate"]}
                                        rules={[{ required: true }]}
                                      >
                                        <DatePicker
                                          format={"DD-MM-YYYY"}
                                          style={{ width: "120px" }}
                                          disabled={this.state.disabledIndices.includes(
                                            index
                                          )}
                                          disabledDate={(current) =>
                                            current &&
                                            current < moment().startOf("day")
                                          }
                                        />
                                      </Form.Item>
                                    )}
                                  </td>

                                  <td>
                                    {!this.state.disabled && (
                                      <CloseOutlined
                                        onClick={() => remove(field.name)}
                                      />
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {!this.state.disabled && (
                            // <tfoot style={{ width: "100%" }}>
                            //   <tr>
                            //     <td>
                            <Row
                              gutter={[10, 10]}
                              justify={"center"}
                              style={{ margin: "10px" }}
                            >
                              <Col>
                                <Button
                                  // style={{ marginLeft: "250px" }}
                                  type="dashed"
                                  onClick={() => add()}
                                  disabled={this.state.isDisable}
                                >
                                  <PlusOutlined /> Stock In
                                </Button>
                              </Col>
                            </Row>
                            //     </td>
                            //   </tr>
                            // </tfoot>
                          )}
                        </>
                      )}
                    </Form.List>
                  </Card>
                )}
              </Col>
              <Col lg={{ flex: "auto" }}>
                {(this.state.outLength > 0 || this.props.mode !== "View") && (
                  <Card title="Stock Out">
                    <Form.List name="stockOutList">
                      {(fields, { add, remove }) => (
                        <>
                          <table className="sj-table">
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Rate</th>
                                <th>Total</th>
                                <th></th>
                              </tr>
                            </thead>

                            <tbody>
                              {fields.map((field, index) => (
                                <tr key={field.key} align="start">
                                  <td style={{ width: "40%" }}>
                                    <Form.Item
                                      hidden
                                      name={[
                                        field.name,
                                        "criticalStockInMapping",
                                      ]}
                                    />
                                    <Form.Item
                                      noStyle
                                      {...field}
                                      label="Item Name"
                                      name={[field.name, "sparePartId"]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Missing item name",
                                        },
                                      ]}
                                    >
                                      <Select
                                        style={{
                                          width: "100%",
                                          maxWidth: "250px",
                                          // overflow: "hidden",
                                        }}
                                        showSearch
                                        placeholder="Item Name"
                                        optionFilterProp="label"
                                        options={this.state.spareOptions}
                                        onChange={(value) =>
                                          this.fetchPrice(
                                            "stockOutList",
                                            index,
                                            value
                                          )
                                        }
                                      />
                                    </Form.Item>
                                  </td>
                                  <td>
                                    <Form.Item
                                      noStyle
                                      label="Quantity"
                                      name={[field.name, "quantity"]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Missing quantity",
                                        },
                                      ]}
                                    >
                                      <InputNumber
                                        onInput={() =>
                                          this.calculateTotal(
                                            "stockOutList",
                                            index
                                          )
                                        }
                                        controls={false}
                                        placeholder="Quantity"
                                        onClick={() =>
                                          this.fetchPrice(
                                            "stockOutList",
                                            index,
                                            this.props.form.getFieldValue(
                                              "stockOutList"
                                            )[index]?.sparePartId
                                          )
                                        }
                                        readOnly={
                                          this.props.form.getFieldValue(
                                            "stockOutList"
                                          )[index]?.sparePartId ==
                                          this.state.sparePartId
                                            ? true
                                            : false
                                        }
                                      />
                                    </Form.Item>
                                  </td>
                                  <td>
                                    <Form.Item
                                      noStyle
                                      label="Price"
                                      {...field}
                                      name={[field.name, "price"]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Missing price",
                                        },
                                      ]}
                                    >
                                      <InputNumber
                                        onInput={() =>
                                          this.calculateTotal(
                                            "stockOutList",
                                            index
                                          )
                                        }
                                        controls={false}
                                        readOnly
                                        placeholder="Price"
                                      />
                                    </Form.Item>
                                  </td>
                                  <td>
                                    <Form.Item
                                      noStyle
                                      label="Total"
                                      {...field}
                                      name={[field.name, "totalValue"]}
                                    >
                                      <InputNumber
                                        readOnly
                                        placeholder="Total"
                                      />
                                    </Form.Item>
                                  </td>
                                  <td align="center">
                                    {!this.state.disabled && (
                                      <CloseOutlined
                                        onClick={() => remove(field.name)}
                                      />
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {!this.state.disabled && (
                            <Row
                              gutter={[10, 10]}
                              justify={"center"}
                              style={{ margin: "10px" }}
                            >
                              <Col>
                                <Button
                                  // style={{ marginLeft: "250px" }}
                                  type="dashed"
                                  onClick={() => add()}
                                >
                                  <PlusOutlined /> Stock Out
                                </Button>
                              </Col>
                            </Row>
                          )}
                        </>
                      )}
                    </Form.List>
                  </Card>
                )}
              </Col>
              {!this.state.disabled && (
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Col>
              )}
            </Row>
            <Modal
              destroyOnClose
              centered
              title="Select Expiry Type"
              open={this.state.openModal2}
              width={450}
              onCancel={this.onCancel}
              footer={[
                <Row justify={"space-between"}>
                  <Button onClick={this.onCancel}>Cancel</Button>
                  <Button
                    onClick={this.onExpiryModalFinish}
                    type="primary"
                    htmlType="submit"
                  >
                    Save
                  </Button>
                </Row>,
              ]}
            >
              <Form ref={this.modal2Ref} onFinish={this.onExpiryModalFinish}>
                <Form.Item
                  label="Notification Type"
                  // name={"notificationType"}
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
                        <DatePicker
                          style={{ width: "100%" }}
                          disabledDate={disablePastDates}
                        />
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
              </Form>
            </Modal>
            <SerialNumberPopup
              onSelectPrice={this.onSelectPrice}
              openModal={this.state.openModal}
              onCancel={this.onCancel}
              okModalSave={this.okModalSave}
              rowSelection={rowSelection}
              columns={columns}
              data={data}
              onSelect={this.onSelect}
              uniquePrices={this.state.uniquePrices}
            />
          </Spin>
        </Form>
      </Page>
    );
  }
}

export default withForm(withRouter(StockJournalForm));
