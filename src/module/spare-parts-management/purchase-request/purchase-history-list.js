import {
  Avatar,
  Badge,
  Button,
  Col,
  Form,
  Input,
  Result,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { withForm } from "../../../utils/with-form";
import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";
import { GrSystem } from "react-icons/gr";
import dayjs from "dayjs";
import PurchaseHistoryService from "../../../services/inventory-services/purchase-history-service";
import PurchaseHistoryForm from "./purchase-history-form";
import { withRouter } from "../../../utils/with-router";
import { withAuthorization } from "../../../utils/with-authorization";
import moment from "moment";
const { Option } = Select;
const { Text } = Typography;
class PurchaseHistoryList extends PageList {
  service = new PurchaseHistoryService();
  title = "Purchase History";

  onRetrieve(id) {
    this.setState({ ...this.state, isLoading: true });

    Promise.all([this.service.retrieve(id)]).then((response) => {
      this.setState({
        ...this.state,
        data: response[0].data,
        isLoading: false,
      });
    });
  }
  handleChange = (value) => {
    this.setState((state) => ({ ...state, selectedSpare: value }));
    //this.loadSpare(value);
    this.onRetrieve(value);
  };

  onClose = () => {
    this.setState((state) => ({
      ...state,
      popup: {
        open: false,
      },
    }));
    this.list();
  };
  formatDateToUTC = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString();
  };
  formatEndDateToUTC = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    date.setUTCHours(23, 59, 59, 999);
    return date.toISOString();
  };
  componentDidMount() {
    this.list({
      systemUpdate: this.props.searchParams.get("systemGenerated"),
      startDate: this.formatDateToUTC(this.props.searchParams.get("startDate")),
      endDate: this.formatEndDateToUTC(this.props.searchParams.get("endDate")),
    });
    this.props.form.setFieldsValue({
      request: this.props.searchParams.get("systemGenerated")
        ? this.props.searchParams.get("systemGenerated")
          ? 2
          : 1
        : null,
    });
  }
  openOrderPopup = (id, startDate) => {
    this.setState((state) => ({
      ...state,
      popup: {
        open: true,
        mode: "View",
        title: `Purchase Request`,
        id: id,
        disabled: true,
        startDate: startDate,
      },
    }));
  };
  list = (filter) => {
    this.service.list(filter).then((response) => {
      let changes = this.handleData(response.data);
      this.setState((state) => ({
        ...state,
        rows: changes,
        res: changes,
      }));
    });
  };
  splitCamelCase = (str) => {
    return str.replace(/([a-z])([A-Z])/g, "$1 $2");
  };
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 25,
      align: "left",
      render: (value, record, index) => {
        return index + 1;
      },
    },

    {
      dataIndex: "prNo",
      key: "prNo",
      title: "P.R.No",
      width: 120,
      align: "left",
      render: (record, value) => {
        return value?.systemUpdate ? (
          <Space>
            <Text>{record}</Text>
            <Tooltip title="System Generated">
              <Avatar
                style={{ backgroundColor: "green" }}
                size={25}
                icon={<GrSystem />}
              />
            </Tooltip>
          </Space>
        ) : (
          record
        );
      },
    },
    {
      dataIndex: "createdOn",
      key: "createdOn",
      title: "Date",
      width: 120,
      align: "left",
      render: (value) => {
        return dayjs(value).format("DD-MM-YYYY");
      },
      sorter: (a, b) => moment(a.createdOn).unix() - moment(b.createdOn).unix(),
    },
    // {
    //   dataIndex: "purchaseRequestSubList",
    //   key: "purchaseRequestSubList",
    //   title: "Asset Library",
    //   width: 150,
    //   align: "left",
    //   render: (value) => {
    //     return value?.map((e) => e?.sparePart?.assetLibrary.assetLibraryName);
    //   },
    // },
    {
      dataIndex: "purchaseRequestSubList",
      key: "quantity",
      title: "Requested Quantity",
      width: 100,
      align: "center",
      render: (value, record) => {
        let totalQuantity = value?.reduce(
          (accumulator, currentValue) => accumulator + currentValue.quantity,
          0
        );
        return totalQuantity;
      },
    },
    {
      dataIndex: "purchaseRequestStatus",
      key: "purchaseRequestStatus",
      title: "Status",
      width: 100,
      align: "left",
      render: (value) => {
        return value ? this.splitCamelCase(value) : "";
      },
    },
    {
      dataIndex: "purchaseRequestId",
      key: "purchaseRequestId",
      title: "Action",
      width: 160,
      align: "left",
      render: (value, record) => {
        return record.purchaseRequestStatus !== "Received" ? (
          record?.startDate ? (
            <>
              {this.props.access[0]?.includes("view") && (
                <>
                  <Button
                    type="primary"
                    style={{ marginRight: "8px" }}
                    onClick={() =>
                      this.openOrderPopup(value, record?.startDate)
                    }
                  >
                    Stock In
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              {this.props.access[0]?.includes("view") && (
                <>
                  <Button
                    type="primary"
                    style={{ marginRight: "8px" }}
                    onClick={() => this.openOrderPopup(value, null)}
                  >
                    Processing
                  </Button>
                </>
              )}
            </>
          )
        ) : (
          "-"
        );
      },
    },
  ];

  render() {
    const { isLoading, form } = this.props;
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

    // if (!access[0] || access[0].length === 0) {
    //   return (
    //     <Result
    //       status={"403"}
    //       title="403"
    //       subTitle="Sorry You are not authorized to access this page"
    //     />
    //   );
    // }

    return (
      <Spin spinning={isLoading}>
        <Page title={this.title}>
          <Form form={form}>
            <Row gutter={[10, 10]}>
              <Col md={6}>
                <Form.Item>
                  <Input
                    onChange={(v) => this.search(v, "prNo")}
                    placeholder="Search P.R.No"
                  />
                </Form.Item>
              </Col>
              <Col md={6}>
                <Form.Item name="request">
                  <Select
                    allowClear
                    onChange={(value) => this.list({ systemUpdate: value })}
                    placeholder="Select Status"
                  >
                    <Option value={false}>Purchase Request Manual</Option>
                    <Option value={true}>Purchase Request System</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Table
            rowKey="supplierId"
            pagination={{
              showSizeChanger: true,
              size: "default",
            }}
            scroll={{ x: 980 }}
            loading={this.state.isLoading}
            dataSource={this.state.rows}
            columns={this.columns}
            size="small"
            bordered
          />
          <PurchaseHistoryForm {...this.state.popup} close={this.onClose} />
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(withForm(PurchaseHistoryList)));
