import { Card, Col, Avatar, Row, Spin, Space, Tooltip } from "antd";
import { withForm } from "../../../utils/with-form";
import { Link } from "react-router-dom";
import { Component } from "react";
import { Divider, Typography } from "antd";
import { remoteAsset } from "../../../helpers/url";
import EnergyLiveMonitoringService from "../../../services/energy-live-service";
import EnergyDashboradDetailService from "../../../services/energy-services/energy-detail-dashboard-service";
import MiniChart from "../../../component/MiniChart";
const { Text, Title } = Typography;
const { Meta } = Card;
class CardView extends Component {
  state = { isLoading: false, rows: [], series: [] };
  state = {
    isLoading: false,
    rows: [],
    data: {},
  };
  service = new EnergyLiveMonitoringService();
  energyService = new EnergyDashboradDetailService();
  static getDerivedStateFromProps(props, state) {
    return { ...state, ...props };
  }

  render() {
    const { isLoading, rows, data } = this.state;
    const sortedRows = rows.sort((a, b) =>
      a.assetName.localeCompare(b.assetName)
    );

    return (
      <Spin spinning={isLoading}>
        <Row gutter={[16, 16]}>
          {sortedRows.map((e) => (
            <Col key={e.assetId} lg={8} sm={24} md={12}>
              <Link to={`./live-dashboard?assetId=${e.assetId}`}>
                <Card
                  hoverable
                  title={
                    <Space>
                      <Avatar shape="square" src={remoteAsset(e.imageUrl)} />
                      <Text strong>{e.assetName}</Text>
                    </Space>
                  }
                >
                  <Row gutter={[10, 10]}>
                    <Col span={24}>
                      <div>
                        <Text>Today's Consumption</Text>
                        <Title
                          level={3}
                          style={{ color: "#2C4A88", margin: 0 }}
                        >
                          {Number(e.todayConsumption ?? 0)?.toFixed(2)}{" "}
                          <Text strong>kWh</Text>
                        </Title>
                      </div>
                      <div style={{ marginTop: "1em" }}>
                        <Text>Month's Consumption</Text>
                        <Title
                          level={3}
                          style={{ color: "#2C4A88", margin: 0 }}
                        >
                          {Number(e.monthConsumption ?? 0)?.toFixed(2)}{" "}
                          <Text strong>kWh</Text>
                        </Title>
                      </div>
                      <div style={{ marginTop: "1em" }}>
                        <Text>Meter Reading</Text>
                        <Title
                          level={3}
                          style={{ color: "#2C4A88", margin: 0 }}
                        >
                          {Number(e.meterReading ?? 0)?.toFixed(2)}{" "}
                          <Text strong>kWh</Text>
                        </Title>
                      </div>
                      <Divider style={{ margin: "20px 0" }} />
                      <MiniChart height={58} width={150} assetId={e.assetId} />
                      <Divider style={{ margin: 2 }} />
                    </Col>
                  </Row>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Spin>
    );
  }
}

export default withForm(CardView);
