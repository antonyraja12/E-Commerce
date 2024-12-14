import { BsSpeedometer } from "react-icons/bs";
import { GiLightningFrequency } from "react-icons/gi";
import { SlEnergy } from "react-icons/sl";
import { TfiBolt } from "react-icons/tfi";

import { SearchOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Row,
  Select,
  Spin,
  Table,
  TreeSelect,
  Typography,
} from "antd";
import EnergyLiveMonitoringService from "../../../services/energy-live-service";
import Page from "../../../utils/page/page";
import { withForm } from "../../../utils/with-form";
import FilterFunctions from "../../remote-monitoring/common/filter-functions";
// import HorizontalGauge from 'react-horizontal-gauge';
// import AssetService from "../../../services/asset-service";
import dayjs from "dayjs";
import TimeSeriesGraph from "../../../component/TimeSeriesGraph";
import { withRouter } from "../../../utils/with-router";
const { Text, Title } = Typography;
const chartStyle = {
  height: 250,
};

const style = {
  formItem: {
    minWidth: "120px",
  },
};

class LiveMonitoring extends FilterFunctions {
  state = { value: [], isLoading: false };
  service = new EnergyLiveMonitoringService();
  filterfunctionsservice = new FilterFunctions();
  componentDidMount() {
    let assetId = this.props.searchParams.get("assetId");
    if (assetId != "null" && assetId != "undefined") {
      // console.log("assetId", assetId);
      setTimeout(() => {
        this.props.form?.setFieldValue("assetId", Number(assetId));
        this.props.form?.submit();
      }, 500);
    }
    this.loadAppHierarchy();
    this.getAssetList();
    this.props.form.setFieldsValue({
      startDate: dayjs().startOf("day").toISOString(),
      endDate: dayjs().endOf("day").toISOString(),
    });
  }
  loadAppHierarchy = () => {
    this.appHierarchyService
      .list()
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          parentTreeList: this.appHierarchyService.convertToSelectTree(data),
        }));
      })
      .catch((error) => {
        console.error("Failed to load app hierarchy:", error);
      });
  };
  getAssetList(ahid) {
    this.setState((state, props) => ({
      ...state,
      isAssetListLoading: true,
      assetList: [],
    }));
    this.assetService
      .list({
        active: true,
        published: true,
        ahid: ahid,
        assetCategory: 2,
      })
      .then((response) => {
        this.setState((state, props) => ({
          ...state,
          assetList: response.data?.map((e) => ({
            label: e.assetName,
            value: e.assetId,
          })),
        }));
      })
      .finally(() => {
        this.setState((state, props) => ({
          ...state,
          isAssetListLoading: false,
        }));
      });
  }

  executeSearch = (data) => {
    this.service
      .getLiveMonitoringData(data)
      .then(({ data }) => {
        let obj = {
          c1: [],
          c2: [],
          c3: [],
          v1: [],
          v2: [],
          v3: [],
          l1: [],
          l2: [],
          l3: [],
          pf1: [],
          pf2: [],
          pf3: [],
        };
        for (let x of data?.rows) {
          let ts = new Date(x.timestamp);
          obj.c1.push({ x: ts, y: x.A1 });
          obj.c2.push({ x: ts, y: x.A2 });
          obj.c3.push({ x: ts, y: x.A3 });
          obj.v1.push({ x: ts, y: x.V1 });
          obj.v2.push({ x: ts, y: x.V2 });
          obj.v3.push({ x: ts, y: x.V3 });
          obj.l1.push({ x: ts, y: x.L1 });
          obj.l2.push({ x: ts, y: x.L2 });
          obj.l3.push({ x: ts, y: x.L3 });
          obj.pf1.push({ x: ts, y: x.PF1 });
          obj.pf2.push({ x: ts, y: x.PF2 });
          obj.pf3.push({ x: ts, y: x.PF3 });
        }
        // console.log("obj", obj.c1);
        this.setState((state) => ({
          ...state,
          overallvalue: [
            {
              phase: "Phase 1",
              current: data?.rows[data?.rows.length - 1]?.A1,
              voltage: data?.rows[data?.rows.length - 1]?.V1,
              load: data?.rows[data?.rows.length - 1]?.L1,
              powerFactor: data?.rows[data?.rows.length - 1]?.PF1,
            },

            {
              phase: "Phase 2",
              current: data?.rows[data?.rows.length - 1]?.A2,
              voltage: data?.rows[data?.rows.length - 1]?.V2,
              load: data?.rows[data?.rows.length - 1]?.L2,
              powerFactor: data?.rows[data?.rows.length - 1]?.PF2,
            },
            {
              phase: "Phase 3",
              current: data?.rows[data?.rows.length - 1]?.A3,
              voltage: data?.rows[data?.rows.length - 1]?.V3,
              load: data?.rows[data?.rows.length - 1]?.L3,
              powerFactor: data?.rows[data?.rows.length - 1]?.PF3,
            },
          ],
          meterReading: data?.rows[data?.rows.length - 1]?.METERREADING,
          frequency: data?.rows[data?.rows.length - 1]?.FREQUENCY,
          avgCurrent:
            (data?.rows[data?.rows.length - 1]?.A1 +
              data?.rows[data?.rows.length - 1]?.A2 +
              data?.rows[data?.rows.length - 1]?.A3) /
            3,
          avgVoltage:
            (data?.rows[data?.rows.length - 1]?.V1 +
              data?.rows[data?.rows.length - 1]?.V2 +
              data?.rows[data?.rows.length - 1]?.V3) /
            3,
          current: [
            {
              name: "Phase 1",
              data: obj.c1,
            },
            {
              name: "Phase 2",
              data: obj.c2,
            },
            {
              name: "Phase 3",
              data: obj.c3,
            },
          ],
          voltage: [
            {
              name: "Phase 1",
              data: obj.v1,
            },
            {
              name: "Phase 2",
              data: obj.v2,
            },
            {
              name: "Phase 3",
              data: obj.v3,
            },
          ],
          load: [
            {
              name: "Phase 1",
              data: obj.l1,
            },
            {
              name: "Phase 2",
              data: obj.l2,
            },
            {
              name: "Phase 3",
              data: obj.l3,
            },
          ],
          powerFactor: [
            {
              name: "Phase 1",
              data: obj.pf1,
            },
            {
              name: "Phase 2",
              data: obj.pf2,
            },
            {
              name: "Phase 3",
              data: obj.pf3,
            },
          ],
        }));
      })
      .catch((error) => {
        console.log(error);
        // setTimeout(executeSearch, intervalMilliseconds);
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
      });
  };

  search = (data) => {
    this.setState((state) => ({ ...state, isLoading: true }));
    const intervalMilliseconds = 1000;
    setInterval(() => {
      this.executeSearch(data);
    }, 1000);
    // setInterval(this.executeSearch(data), intervalMilliseconds);
    // executeSearch();
  };

  columns = [
    {
      dataIndex: "phase",
      key: "phase",
      title: "Phase",
      align: "left",
      render: (value) => {
        return value;
      },
    },
    {
      dataIndex: "current",
      key: "current",
      title: "Current (A)",
      align: "center",
      render: (value) => {
        return value;
      },
    },
    {
      dataIndex: "voltage",
      key: "voltage",
      title: "Voltage (V)",
      align: "center",
      render: (value) => {
        return value;
      },
    },
    {
      dataIndex: "load",
      key: "load",
      title: "Load",
      align: "center",
      render: (value) => {
        return value;
      },
    },
    {
      dataIndex: "powerFactor",
      key: "powerFactor",
      title: "Power Factor",
      align: "center",
      render: (value) => {
        return value;
      },
    },
  ];

  render() {
    return (
      <Page
        title="Live Monitoring"
        filter={
          <Form
            size="small"
            onFinish={this.search}
            form={this.props.form}
            layout="inline"
            // initialValues={{ mode: 1 }}
          >
            <Form.Item name="startDate" hidden></Form.Item>
            <Form.Item name="endDate" hidden></Form.Item>
            <Form.Item name="ahid" style={{ minWidth: "200px" }}>
              <TreeSelect
                onChange={(v) => this.getAssetList(v)}
                showSearch
                loading={this.state.isparentTreeListLoading}
                placeholder="Site"
                allowClear
                treeData={this.state.parentTreeList}
              ></TreeSelect>
            </Form.Item>
            <Form.Item name="assetId" style={{ minWidth: "200px" }}>
              <Select
                showSearch
                loading={this.state.isAssetListLoading}
                placeholder="Asset"
                allowClear
                options={this.state.assetList}
              ></Select>
            </Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Go
            </Button>
          </Form>
        }
      >
        <Spin spinning={this.state.isLoading}>
          <Row gutter={[10, 10]}>
            <Col sm={12}>
              <Row gutter={[10, 10]}>
                <Col sm={12}>
                  <Card>
                    <Card.Meta
                      avatar={
                        <Avatar
                          shape="square"
                          size={70}
                          style={{
                            backgroundColor: "#f56a00",
                            verticalAlign: "middle",
                          }}
                          icon={<TfiBolt />}
                        />
                      }
                      title={
                        <Title level={2} style={{ marginBottom: 0 }}>
                          {Number(this.state.avgCurrent ?? 0)?.toFixed(2)}
                        </Title>
                      }
                      description="Average Current"
                    ></Card.Meta>
                  </Card>
                </Col>
                <Col sm={12}>
                  <Card>
                    <Card.Meta
                      avatar={
                        <Avatar
                          shape="square"
                          size={70}
                          style={{
                            backgroundColor: "#7265e6",
                            verticalAlign: "middle",
                          }}
                          icon={<SlEnergy />}
                        />
                      }
                      title={
                        <Title level={2} style={{ marginBottom: 0 }}>
                          {Number(this.state.avgVoltage ?? 0)?.toFixed(2)}
                        </Title>
                      }
                      description="Average Voltage"
                    ></Card.Meta>
                  </Card>
                </Col>
                <Col sm={12}>
                  <Card>
                    <Card.Meta
                      avatar={
                        <Avatar
                          shape="square"
                          size={70}
                          style={{
                            backgroundColor: "#ffbf00",
                            verticalAlign: "middle",
                          }}
                          icon={<BsSpeedometer />}
                        />
                      }
                      title={
                        <Title level={2} style={{ marginBottom: 0 }}>
                          {Number(this.state.meterReading ?? 0)?.toFixed(2)}
                        </Title>
                      }
                      description="Meter Reading"
                    ></Card.Meta>
                  </Card>
                </Col>
                <Col sm={12}>
                  <Card>
                    <Card.Meta
                      avatar={
                        <Avatar
                          shape="square"
                          size={70}
                          style={{
                            backgroundColor: "#00a2ae",
                            verticalAlign: "middle",
                          }}
                          icon={<GiLightningFrequency />}
                        />
                      }
                      title={
                        <Title level={2} style={{ marginBottom: 0 }}>
                          {Number(this.state.frequency ?? 0)?.toFixed(2)}
                        </Title>
                      }
                      description="Frequency"
                    ></Card.Meta>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col sm={12}>
              <Card
                style={{ height: "235px", overflow: "hidden" }}
                bodyStyle={{ padding: "0" }}
              >
                <Table
                  rowKey="assetId"
                  dataSource={this.state.overallvalue}
                  columns={this.columns}
                  size="large"
                  pagination={false}
                />
              </Card>
            </Col>
            <Col sm={12}>
              <Card title="Current (A)">
                <TimeSeriesGraph
                  hideLabel={true}
                  height={250}
                  series={this.state.current}
                />
              </Card>
            </Col>
            <Col sm={12}>
              <Card title="Voltage (V)">
                <TimeSeriesGraph
                  hideLabel={true}
                  height={250}
                  series={this.state.voltage}
                />
              </Card>
            </Col>
            <Col sm={12}>
              <Card title="Load (kWH)">
                <TimeSeriesGraph
                  hideLabel={true}
                  height={250}
                  series={this.state.load}
                />
              </Card>
            </Col>
            <Col sm={12}>
              <Card title="Power Factor (kW)">
                <TimeSeriesGraph
                  hideLabel={true}
                  height={250}
                  series={this.state.powerFactor}
                />
              </Card>
            </Col>
          </Row>
        </Spin>
      </Page>
    );
  }
}

export default withRouter(withForm(LiveMonitoring));
