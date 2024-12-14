import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Select,
  Row,
  Table,
  Spin,
  AutoComplete,
} from "antd";
import List from "../base/list";
import { Link, useParams, useLocation } from "react-router-dom";
import { AssemblyPlanningItemTrackingService } from "../../services/assembly-planning-item-tracking-service";
import { JobOrderDetailService } from "../../services/jobOrderDetailService";
import { filterOption } from "../../utils/helper";
import { SaleOrderService } from "../../services/sale-order-service";
import Page from "../../../../../utils/page/page";

class AssemblyPlanningItemChild extends List {
  service = new AssemblyPlanningItemTrackingService();
  saleOrderService = new SaleOrderService();

  state = {
    isLoading: false,
    dataSource: [],
    itemNameOptions: [],
    itemCodeOptions: [],
    locationOptions: [],
    id: this.props.id,
    SaleOrderFilterList: [],
  };

  jobOrderDetailService = new JobOrderDetailService();
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: 50,
      fixed: this.isMobile ? undefined : "left",
      render: (_, __, index) => index + 1,
    },
    {
      dataIndex: "itemName",
      key: "itemName",
      title: "Item Name",
      fixed: this.isMobile ? undefined : "left",
      width: 100,
    },
    {
      dataIndex: "itemCode",
      key: "itemCode",
      title: "Item Code",
      width: 100,
    },
    {
      dataIndex: "barCode",
      key: "barCode",
      title: "Bar Code",
      width: 100,
    },
    {
      dataIndex: "quantity",
      key: "quantity",
      title: "Quantity",
      width: 60,
      align: "right",
    },
    {
      dataIndex: "location",
      key: "location",
      title: "Location",
      width: 100,
    },
  ];

  componentDidMount() {
    this.fetchData();
    if (!this.props.id) {
      this.setState({ isLoading: true });

      Promise.all([
        this.saleOrderService.list(),
        this.jobOrderDetailService.list(),
      ])
        .then(([saleOrderResponse, jobOrderResponse]) => {
          const saleOrderFilterList = saleOrderResponse.data.map((e) => ({
            label: e.saleOrderNumber,
            value: e.saleOrderNumber,
          }));

          const jobOrderFilterList = jobOrderResponse.data.map((e) => ({
            value: e.jobOrderNumber,
            label: e.jobOrderNumber,
          }));

          this.setState({
            SaleOrderFilterList: saleOrderFilterList,
            jobOrderFilterList: jobOrderFilterList,
          });
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData();
    }
  }

  fetchData() {
    const { id } = this.props;
    if (id) {
      this.service.list({ jobOrderId: id }).then((data) => {
        const { data: items } = data;
        const itemNameOptions = this.getUniqueOptions(items, "itemName");
        const itemCodeOptions = this.getUniqueOptions(items, "itemCode");
        const locationOptions = this.getUniqueOptions(items, "location");

        this.setState({
          dataSource: items,
          itemNameOptions,
          itemCodeOptions,
          locationOptions,
        });
      });
    } else {
      this.service.list().then((data) => {
        const { data: items } = data;
        const itemNameOptions = this.getUniqueOptions(items, "itemName");
        const itemCodeOptions = this.getUniqueOptions(items, "itemCode");
        const locationOptions = this.getUniqueOptions(items, "location");

        this.setState({
          dataSource: items,
          itemNameOptions,
          itemCodeOptions,
          locationOptions,
        });
      });
    }
  }

  getUniqueOptions(items, key) {
    return [...new Set(items.map((item) => item[key]))].map((value) => ({
      value,
      label: value,
    }));
  }

  onSearch = (value) => {
    const processedValue = Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        val === "" ? undefined : val,
      ])
    );
    if (this.props.id) {
      this.list({ ...processedValue, assemblyPlanningDetailId: this.props.id });
    } else {
      this.list(processedValue);
    }
  };

  render() {
    const {
      isLoading,
      dataSource,
      itemNameOptions,
      itemCodeOptions,
      locationOptions,
    } = this.state;

    return (
      <Spin spinning={this.state.isLoading}>
        <Page
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              {this.props.id && (
                <Link to="/digital-job-card/embedd/job-order/job-order-planing">
                  <Button
                    icon={<ArrowLeftOutlined />}
                    style={{
                      backgroundColor: "transparent",
                      color: "black",
                      boxShadow: "none",
                      border: "none",
                      marginRight: "1rem",
                    }}
                  />
                </Link>
              )}
              <span>Track and Trace</span>
            </div>
          }
        >
          <Form layout="vertical" onFinish={this.onSearch}>
            <Row gutter={[10, 10]} align="middle">
              {!this.props.id && (
                <Col xs={24} sm={8} xl={4}>
                  <Form.Item name="saleOrderNumber" style={{ width: "100%" }}>
                    <AutoComplete
                      options={this.state.SaleOrderFilterList}
                      placeholder="Sale Order Id"
                      loading={isLoading}
                      showSearch
                      allowClear
                      filterOption={filterOption}
                    />
                  </Form.Item>
                </Col>
              )}
              {!this.props.id && (
                <Col xs={24} sm={8} xl={4}>
                  <Form.Item name="jobOrderNumber">
                    <AutoComplete
                      options={this.state.jobOrderFilterList}
                      loading={isLoading}
                      placeholder="Job Order No"
                      showSearch
                      allowClear
                      filterOption={filterOption}
                    />
                  </Form.Item>
                </Col>
              )}
              <Col xs={24} sm={this.props.id ? 7 : 8} xl={4}>
                <Form.Item name="itemName">
                  <Select
                    allowClear
                    placeholder="Item Name"
                    options={itemNameOptions}
                    showSearch
                    filterSort={(optionA, optionB) =>
                      optionA.label.localeCompare(optionB.label)
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={this.props.id ? 7 : 8} xl={4}>
                <Form.Item name="itemCode">
                  <Select
                    allowClear
                    placeholder="Item Code"
                    options={itemCodeOptions}
                    showSearch
                    filterSort={(optionA, optionB) =>
                      optionA.label.localeCompare(optionB.label)
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={this.props.id ? 7 : 8} xl={4}>
                <Form.Item name="location">
                  <Select
                    allowClear
                    placeholder="Location"
                    options={locationOptions}
                    showSearch
                    filterSort={(optionA, optionB) =>
                      optionA.label.localeCompare(optionB.label)
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={this.props.id ? 3 : 8} xl={4}>
                <Form.Item>
                  <Button htmlType="submit" type="primary">
                    Go
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <br />
          <Table
            loading={isLoading}
            bordered
            dataSource={dataSource}
            columns={this.columns}
            size="small"
            rowKey="shiftPlanningId"
            scroll={{ x: 700, y: 300 }}
          />
        </Page>
      </Spin>
    );
  }
}

function AssemblyPlanningItem() {
  const { id } = useParams();
  const location = useLocation();

  // Force component remount on route change
  const key = location.pathname + location.search;

  return <AssemblyPlanningItemChild key={key} id={id} />;
}

export default AssemblyPlanningItem;
