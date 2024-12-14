import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { DateFormat, TimeFormat } from "../../utils/helper";
import List from "../base/list";
import { JobOrderService } from "../../services/job-order-service";
import JobOrderForm from "./job-order-form";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { MdOutlineDatasetLinked } from "react-icons/md";
import Page from "../../../../../utils/page/page";

const { RangePicker } = DatePicker;

const disabledDate = (current) => {
  return current && current > dayjs().endOf("day");
};

class JobOrder extends List {
  service = new JobOrderService();

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      dataSource: [],
      popup: { open: false, title: "", mode: "" },
      isSaving: false,
      productOption: [],
      sourceDataForFilters: [],
    };
    this.onSearch = this.onSearch.bind(this);
  }

  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: "40px",
    },
    {
      dataIndex: "saleOrderNumber",
      key: "saleOrderNumber",
      title: "Sale Order",
      width: "60px",
      align: "right",
    },
    {
      dataIndex: "jobOrderNumber",
      key: "jobOrderNumber",
      title: "Job Order",
      width: "60px",
      align: "right",
    },
    {
      dataIndex: "productMaster",
      key: "productMaster",
      title: "Details",
      fixed: "left",
      width: "200px",
      render: (value, row) => {
        return (
          <>
            <Typography.Text strong>{row.productName}</Typography.Text>
            <Space style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 5,
                }}
              >
                <Typography.Text type="secondary" style={{ fontSize: "0.9em" }}>
                  {DateFormat(row.startTime)}
                </Typography.Text>
                <Typography.Text
                  style={{ fontSize: "0.8em", lineHeight: 0 }}
                  type="secondary"
                >
                  {TimeFormat(row.startTime)}
                </Typography.Text>
              </div>
              <Typography.Text type="secondary">-</Typography.Text>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 5,
                }}
              >
                <Typography.Text type="secondary" style={{ fontSize: "0.9em" }}>
                  {DateFormat(row.endTime)}
                </Typography.Text>
                <Typography.Text
                  style={{ fontSize: "0.8em", lineHeight: 0 }}
                  type="secondary"
                >
                  {TimeFormat(row.endTime)}
                </Typography.Text>
              </div>
            </Space>
          </>
        );
      },
    },
    {
      key: "Quantity",
      title: "Quantity",
      align: "center",
      children: [
        {
          dataIndex: "orderQuantity",
          key: "orderQuantity",
          title: "Ordered",
          width: "60px",
          align: "right",
        },
        {
          dataIndex: "acceptedQuantity",
          key: "acceptedQuantity",
          title: "Accepted",
          width: "60px",
          align: "right",
        },
        {
          dataIndex: "rejectedQuantity",
          key: "rejectedQuantity",
          title: "Rejected",
          width: "60px",
          align: "right",
        },
        {
          dataIndex: "producedQuantity",
          key: "producedQuantity",
          title: "Produced",
          width: "60px",
          align: "right",
        },
      ],
    },
    {
      dataIndex: "jobOrderId",
      key: "jobOrderId",
      title: "Action",
      align: "center",
      fixed: "right",
      width: "90px",
      render: (value) => {
        return (
          <Space>
            <Link
              to={`/digital-job-card/embedd/job-order/assembly-planning-item/${value}`}
            >
              <Tooltip title="Track">
                <Button type="text">
                  <MdOutlineDatasetLinked fontSize={"20px"} />
                </Button>
              </Tooltip>
            </Link>
            <Popconfirm
              title="Confirm to delete"
              okText="Yes"
              cancelText="No"
              onConfirm={() => {
                this.delete(value);
                this.setState({ popupMode: "Edit" });
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

  patchForm(data) {
    let form = this.getFormInstance();
    form.setFieldsValue({
      ...data,
      productName: data.productMaster.productName,
    });
  }

  setTableData = (data) => {
    this.setState({ tableData: data });
  };

  componentDidMount() {
    super.componentDidMount();
    this.service.list().then((data) => {
      this.setState({ sourceDataForFilters: data.data });
    });
  }

  onSearch(value) {
    let data = value;
    if (value.orderDate) {
      data.fromDate = value.orderDate[0].startOf("D")?.toISOString();
      data.toDate = value.orderDate[1].endOf("D")?.toISOString();
      data.orderDate = [];
    }
    this.setState({ isLoading: true });
    this.service
      .list(data)
      .then(({ data }) => {
        this.setState({ dataSource: this.handleData(data) });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    const { isLoading, dataSource, popup, isSaving, sourceDataForFilters } =
      this.state;

    return (
      <Page
        title="Job Order"
        action={
          <Button type="primary" icon={<PlusOutlined />} onClick={this.add}>
            Add
          </Button>
        }
      >
        <Form
          ref={this.formRef}
          layout="vertical"
          onValuesChange={this.onSearch}
        >
          <Row gutter={[10, 10]} align="middle">
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="saleOrderNumber">
                <AutoComplete
                  allowClear
                  placeholder="Sale Order No"
                  style={{ width: "100%" }}
                  options={sourceDataForFilters
                    .map((e) => ({
                      value: e.saleOrderNumber,
                      label: e.saleOrderNumber,
                    }))
                    .filter(
                      (obj, index, self) =>
                        index === self.findIndex((o) => o.value === obj.value)
                    )}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  showSearch
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item name="jobOrderNumber">
                <AutoComplete
                  allowClear
                  placeholder="Job Order No"
                  style={{ width: "100%" }}
                  options={sourceDataForFilters
                    .map((e) => ({
                      value: e.jobOrderNumber,
                      label: e.jobOrderNumber,
                    }))
                    .filter(
                      (obj, index, self) =>
                        index === self.findIndex((o) => o.value === obj.value)
                    )}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8}>
              <Form.Item name="orderDate">
                <RangePicker
                  disabledDate={disabledDate}
                  allowClear
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          loading={isLoading}
          bordered
          dataSource={dataSource}
          columns={this.columns}
          size="small"
          rowKey="shiftPlanningId"
          scroll={{ x: 1000, y: 350 }}
        />

        <Modal
          maskClosable={false}
          confirmLoading={isSaving}
          onCancel={this.closePopup}
          open={popup.open}
          title={popup.title}
          destroyOnClose
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
          <JobOrderForm
            ref={this.ref}
            submit={this.submit}
            id={popup.id}
            orderDetails={this.state?.orderDetails}
            mode={popup.mode}
          />
        </Modal>
      </Page>
    );
  }
}

export default JobOrder;
