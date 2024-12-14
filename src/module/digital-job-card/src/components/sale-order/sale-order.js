import {
  DeleteOutlined,
  EditOutlined,
  FolderOpenOutlined,
  PlusOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { DateFormat } from "../../utils/helper";
import List from "../base/list";
import SaleOrderForm from "./sale-order-form";
import { SaleOrderService } from "../../services/sale-order-service";
import { ProductService } from "../../services/product-services";
import Page from "../../../../../utils/page/page";
const { RangePicker } = DatePicker;
const disabledDate = (current) => {
  return current && current > dayjs().endOf("day");
};
class SaleOrder extends List {
  service = new SaleOrderService();
  productService = new ProductService();
  isMobile = window.innerWidth <= 768;
  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
  }
  componentDidMount() {
    super.componentDidMount();
    this.fetchProduct();
  }
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: "70px",
      fixed: this.isMobile ? undefined : "left",
    },
    {
      dataIndex: "orderDate",
      key: "orderDate",
      title: "Date",
      width: "100px",
      fixed: "left",
      render: (value) => {
        return DateFormat(value);
      },
    },
    {
      dataIndex: "productName",
      key: "productName",
      title: "Detail",
      fixed: "left",
      render: (value, row, index) => {
        return (
          <>
            <Space
              style={{ width: "100%", justifyContent: "space-between" }}
              split={<Divider type="vertical" />}
            >
              <Typography.Text type="success">
                # {row.saleOrderNumber}
              </Typography.Text>
              <Tag> {row.soStatus}</Tag>
            </Space>

            <br />
            <Typography.Text strong>{value}</Typography.Text>
            <br />

            <Typography.Text type="secondary" italic>
              Buyer : {row.buyerName}
            </Typography.Text>
          </>
        );
      },
    },
    {
      key: "qty",
      title: "Quantity",

      align: "center",
      children: [
        {
          dataIndex: "orderQuantity",
          key: "orderQuantity",
          title: "Ordered",
          width: "75px",
          align: "right",
        },
        {
          dataIndex: "pendingQuantity",
          key: "pendingQuantity",
          title: "Pending",
          width: "75px",
          align: "right",
        },
        {
          dataIndex: "finishedQuantity",
          key: "finishedQuantity",
          title: "Finished",
          width: "75px",
          align: "right",
        },
      ],
    },

    {
      key: "Price",
      title: "Price",
      align: "center",
      children: [
        {
          dataIndex: "unitPrice",
          key: "unitPrice",
          title: "Unit",
          width: "100px",
          align: "right",
        },
        {
          dataIndex: "extPrice",
          key: "extPrice",
          title: "Extended",
          width: "100px",
          align: "right",
        },
      ],
    },

    // {
    //   dataIndex: "action",
    //   key: "action",
    //   title: "Modify",
    //   width: "100px",
    // },

    {
      dataIndex: "saleOrderId",
      key: "saleOrderId",
      title: "Action",
      width: "100px",
      align: "center",
      fixed: this.isMobile ? undefined : "right",
      render: (value) => {
        return (
          <Space>
            {/* <Link to={`./detail/${value}`}>
              <Tooltip title="View">
                <Button type="text" icon={<FolderOpenOutlined />} />
              </Tooltip>
            </Link> */}
            <Tooltip title="Edit">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => this.edit(value)}
              />
            </Tooltip>
            <Popconfirm
              title="Confirm to delete"
              description="Are you sure to delete this entry?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => {
                this.delete(value);
                this.setState({ ...this.state, popupMode: "Edit" });
              }}
            >
              <Tooltip title="Delete">
                <Button type="text" icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  fetchProduct() {
    this.productService
      .list()
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          productOption: data.map((e) => ({
            label: e.productName,
            value: e.productId,
          })),
        }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isProductOptionLoading: false }));
      });
  }
  patchForm(data) {
    let form = this.getFormInstance();
    form.setFieldsValue({
      ...data,
      orderDate: dayjs(data.orderDate),
      // productName: data.productMaster.productName,
    });
  }
  onSearch(value) {
    let data = value;
    if (value?.orderDate) {
      data.fromDate = value.orderDate[0].startOf("D")?.toISOString();
      data.toDate = value.orderDate[1].endOf("D")?.toISOString();
      data.orderDate = [];
    }
    this.list(data);
  }
  render() {
    const { isLoading, dataSource, popup, isSaving, productOption } =
      this.state;
    return (
      <Page
        title="Sale Order"
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
          <Col sm={20}>
            <Form
              // onValuesChange={this.onValuesChange}
              ref={this.formRef}
              layout="vertical"
              onFinish={this.onSearch}
            >
              <Row gutter={[10, 10]} align="middle">
                <Col sm={4}>
                  <Form.Item name="saleOrderNumber">
                    <Input placeholder="SO.NO" allowClear />
                  </Form.Item>
                </Col>
                <Col sm={4}>
                  <Form.Item name="productId">
                    <Select
                      options={productOption}
                      placeholder="Product Name"
                      allowClear
                    />
                  </Form.Item>
                </Col>
                <Col sm={6}>
                  <Form.Item name="orderDate">
                    <RangePicker disabledDate={disabledDate} allowClear />
                  </Form.Item>
                </Col>
                <Col sm={4}>
                  <Form.Item name="buyerName">
                    <Input placeholder="Buyer Name" allowClear />
                  </Form.Item>
                </Col>
                <Col sm={4}>
                  <Form.Item name="soStatus">
                    <Select
                      options={[
                        {
                          label: "Open",
                          value: "Open",
                        },
                        {
                          label: "InProgress",
                          value: "InProgress",
                        },
                        {
                          label: "Closed",
                          value: "Closed",
                        },
                      ]}
                      placeholder="SO Status"
                      allowClear
                    />
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
        </Row>
        <br />
        <Table
          loading={isLoading}
          bordered
          dataSource={dataSource}
          columns={this.columns}
          size="small"
          rowKey="shiftPlanningId"
          scroll={{
            x: 1000,
            y: 350,
          }}
        />

        <Modal
          maskClosable={false}
          confirmLoading={isSaving}
          onOk={this.submitForm}
          onCancel={this.closePopup}
          open={popup.open}
          title={popup.title}
          destroyOnClose
        >
          <SaleOrderForm ref={this.ref} submit={this.submit} id={popup.id} />
        </Modal>
      </Page>
    );
  }
}

export default SaleOrder;
