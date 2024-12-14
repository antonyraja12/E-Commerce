import {
  Avatar,
  Card,
  Col,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { GiLightningFrequency } from "react-icons/gi";
import { IoSpeedometerOutline, IoTodaySharp } from "react-icons/io5";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { VscCalendar } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import BarChart from "../../component/BarChart";
import RealTimeChart from "../../component/Legend_LiveChart";
import AssetService from "../../services/asset-service";
import EnergyConsumptionDashboardService from "../../services/energy-services/energy-consumption-dashboard-service";
import Page from "../../utils/page/page";
const { Text, Title } = Typography;
const EnergyConsumptionCard = (props) => {
  const { onClick, title, unit, value, bgColor, icon, hoverable } = props;
  return (
    <Card size="small" hoverable={hoverable} onClick={onClick}>
      <Row gutter={[10, 0]} align="middle">
        <Col>
          <Avatar
            shape="square"
            size={40}
            style={{
              backgroundColor: bgColor,
              verticalAlign: "middle",
            }}
            icon={icon}
          />
        </Col>
        <Col>
          <Title level={3} style={{ color: "#2C4A88", marginTop: "8px" }}>
            {value} <Text strong>{unit}</Text>
          </Title>
        </Col>
        <Col span={24}>
          <Text>{title}</Text>
        </Col>
      </Row>
    </Card>
  );
};
const AvgCard = (props) => {
  const { onClick, title, unit, value, bgColor, icon } = props;
  return (
    <div>
      <Row gutter={10} align="middle">
        <Col>
          <Avatar
            shape="square"
            size={40}
            style={{
              backgroundColor: bgColor,
              verticalAlign: "middle",
            }}
            icon={icon}
          />
        </Col>
        <Col>
          <Title level={3} style={{ color: "#2C4A88", marginTop: "8px" }}>
            {value}{" "}
          </Title>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Text>{title}</Text>
        </Col>
      </Row>
    </div>
  );
};
const CarbonEmissionCard = (props) => {
  const { onClick, title, unit, value, bgColor, icon, cardColor } = props;
  return (
    <Card bodyStyle={{ background: cardColor }}>
      <Row gutter={[10, 0]} align="middle">
        <Col>
          <Avatar
            shape="square"
            size={40}
            style={{
              backgroundColor: bgColor,
              verticalAlign: "middle",
            }}
            icon={icon}
          />
        </Col>
        <Col>
          <Title level={3} style={{ color: "#2C4A88", marginTop: "8px" }}>
            {value} <Text strong>{unit}</Text>
          </Title>
        </Col>
        <Col span={24}>
          <Text>{title}</Text>
        </Col>
      </Row>
    </Card>
  );
};
const RealTimeGraph = (props) => {
  const { title, data, color, height } = props;
  return (
    <Card title={title}>
      <RealTimeChart data={data} colors={color} height={height} />
    </Card>
  );
};
const EnergyLiveDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [assetId, setAssetId] = useState(null);
  const aHId = searchParams.get("aHId");
  const assetService = new AssetService();
  assetService.retrieve(searchParams.get("assetId")).then(({ data }) => {
    if (data?.assetCategory == 2) {
      setAssetId(data?.assetId);
    } else {
      assetService.list({ assetCategory: 2 }).then(({ data }) => {
        setAssetId(null);
      });
    }
  });

  const reduxSelectedAssetId = useSelector(
    (state) => state.mainDashboardReducer.selectedAssetId
  );
  const [state, setState] = useState({
    isLoading: false,
    shiftWiseEnergyData: [],
    energyTable: [],
    todaysEnergyConsumption: 0,
    monthsEnergyConsumption: 0,
    cumulativeEnergy: 0,
    overallvalue: [],
    meterReading: 0,
    frequency: 0,
    avgCurrent: 0,
    avgVoltage: 0,
    current: [],
    voltage: [],
    load: [],
    powerFactor: [],
    barData: [],
    openGraphModel: false,
    graphModelTitle: null,
  });

  const service = new EnergyConsumptionDashboardService();

  const search = (data) => {
    service.getEnergyDataShiftWise(data).then(({ data }) => {
      setState((prevState) => ({ ...prevState, shiftWiseEnergyData: data }));
    });

    service.getEnergyData(data).then(({ data }) => {
      setState((prevState) => ({
        ...prevState,
        energyTable: data,
        todaysEnergyConsumption: data[data.length - 1]?.todayConsumption,
        monthsEnergyConsumption: data[data.length - 1]?.monthConsumption,
        cumulativeEnergy: data[data.length - 1]?.cumulativeConsumption,
      }));
    });

    service
      .getLiveMonitoringData(data)
      .then(({ data }) => {
        // console.log(data[data.length - 1], data.length, "data meter reading");
        let obj = {
          values: {
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
          },
        };
        const rows = data ?? [];

        // console.log(rows, "rowssss");
        for (let x of rows) {
          // console.log(x, "sss");
          let ts = new Date(x.timestamp);
          obj.values.c1.push({ x: ts, y: x.A1 });
          obj.values.c2.push({ x: ts, y: x.A2 });
          obj.values.c3.push({ x: ts, y: x.A3 });
          obj.values.v1.push({ x: ts, y: x.V1 });
          obj.values.v2.push({ x: ts, y: x.V2 });
          obj.values.v3.push({ x: ts, y: x.V3 });
          obj.values.l1.push({ x: ts, y: x.L1 });
          obj.values.l2.push({ x: ts, y: x.L2 });
          obj.values.l3.push({ x: ts, y: x.L3 });
          obj.values.pf1.push({ x: ts, y: x.PF1 });
          obj.values.pf2.push({ x: ts, y: x.PF2 });
          obj.values.pf3.push({ x: ts, y: x.PF3 });
        }
        // console.log(obj.values.pf1, "meterread");
        this.setState((state) => ({
          ...state,
          overallvalue: [
            {
              phase: "Phase 1",
              current: data[data.length - 1]?.values?.A1,
              voltage: data[data.length - 1]?.values?.V1,
              load: data[data.length - 1]?.values?.L1,
              powerFactor: data[data.length - 1]?.values?.PF1,
            },

            {
              phase: "Phase 2",
              current: data[data.length - 1]?.values?.A2,
              voltage: data[data.length - 1]?.values?.V2,
              load: data[data.length - 1]?.values?.L2,
              powerFactor: data[data.length - 1]?.values?.PF2,
            },
            {
              phase: "Phase 3",
              current: data[data.length - 1]?.values?.A3,
              voltage: data[data.length - 1]?.values?.V3,
              load: data[data.length - 1]?.values?.L3,
              powerFactor: data[data.length - 1]?.values?.PF3,
            },
          ],
          meterReading: data[data.length - 1]?.values?.METERREADING,
          frequency: data[data.length - 1]?.values?.FREQUENCY,
          avgCurrent:
            (data[data.length - 1]?.values?.A1 +
              data[data.length - 1]?.values?.A2 +
              data[data.length - 1]?.values?.A3) /
            3,
          avgVoltage:
            (data[data.length - 1]?.values?.V1 +
              data[data.length - 1]?.values?.V2 +
              data[data.length - 1]?.values?.V3) /
            3,
          current: [
            {
              name: "Phase 1",
              data: data[data.length - 1]?.values?.A1,
            },
            {
              name: "Phase 2",
              data: data[data.length - 1]?.values?.A2,
            },
            {
              name: "Phase 3",
              data: data[data.length - 1]?.values?.A3,
            },
          ],
          voltage: [
            {
              name: "Phase 1",
              data: data[data.length - 1]?.values?.V1,
            },
            {
              name: "Phase 2",
              data: data[data.length - 1]?.values?.V2,
            },
            {
              name: "Phase 3",
              data: data[data.length - 1]?.values?.V3,
            },
          ],
          load: [
            {
              name: "Phase 1",
              data: data[data.length - 1]?.values?.L1,
            },
            {
              name: "Phase 2",
              data: data[data.length - 1]?.values?.L2,
            },
            {
              name: "Phase 3",
              data: data[data.length - 1]?.values?.L3,
            },
          ],
          powerFactor: [
            {
              name: "Phase 1",
              data: data[data.length - 1]?.values?.PF1,
            },
            {
              name: "Phase 2",
              data: data[data.length - 1]?.values?.PF2,
            },
            {
              name: "Phase 3",
              data: data[data.length - 1]?.values?.PF3,
            },
          ],
        }));
      })
      // .finally(() => {
      //   setInterval(() => {
      //     this.executeSearch(data);
      //   }, 5000);
      // })
      .catch((error) => {
        console.log(error);
      });
    // data = null;
  };
  useEffect(() => {
    if (assetId != null) {
      const startOfDay = dayjs().startOf("day").toISOString();
      const endOfDay = dayjs().endOf("day").toISOString();
      search({
        startDate: startOfDay,
        endDate: endOfDay,
        assetId: assetId,
      });
      const intervalId = setInterval(() => {
        search({
          startDate: startOfDay,
          endDate: endOfDay,
          assetId: assetId,
        });
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [assetId]);
  const column1 = [
    {
      dataIndex: "shiftName",
      key: "shiftName",
      title: "Shift",
      width: 150,
    },
    {
      dataIndex: "shiftConsumption",
      key: "shiftConsumption",
      title: "Today's Consumption",
      align: "right",
      width: 200,
    },
    {
      dataIndex: "cumulativeConsumption",
      key: "cumulativeConsumption",
      align: "right",
      title: "Cumulative Consumption",
    },
  ];

  const column2 = [
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
      align: "right",
      render: (value) => {
        return value;
      },
    },
    {
      dataIndex: "voltage",
      key: "voltage",
      title: "Voltage (V)",
      align: "right",
      render: (value) => {
        return value;
      },
    },
    {
      dataIndex: "load",
      key: "load",
      title: "Load",
      align: "right",
      render: (value) => {
        return value;
      },
    },
    {
      dataIndex: "powerFactor",
      key: "powerFactor",
      title: "Power Factor",
      align: "right",
      render: (value) => {
        return value;
      },
    },
  ];

  const getBarData = (mainData) => {
    setState((prevState) => ({ ...prevState, isLoading: true }));
    service
      .getBarGraphData(mainData)
      .then(({ data }) => {
        if (data.length) {
          setState((prevState) => ({
            ...prevState,
            barData: data?.map((e) => ({
              x: e.x,
              y: e.y,
              z: e.z,
              name: e.name,
            })),
          }));
        }
      })
      .finally(() => {
        setState((prevState) => ({ ...prevState, isLoading: false }));
      });
  };

  const openGraphModel = (mainData) => {
    setState((prevState) => ({
      ...prevState,
      openGraphModel: true,
      graphModelTitle: mainData?.title,
    }));
    getBarData(mainData);
  };

  const closeGraphModel = () => {
    setState((prevState) => ({ ...prevState, openGraphModel: false }));
  };

  const colors = ["#FF2D00", "#ECFF00", "#0042FF"];

  return (
    <Page>
      <Spin spinning={state.isLoading}>
        <Row gutter={[10, 10]} align="top">
          <Col lg={12} md={24} sm={24}>
            <Text strong>Energy Consumption</Text>
            <Row gutter={[10, 10]}>
              {[
                {
                  onClick: () =>
                    openGraphModel({
                      startDate: dayjs().startOf("day").toISOString(),
                      endDate: dayjs().endOf("day").toISOString(),
                      assetId: assetId,
                      title: "Today's Consumption",
                    }),
                  title: "Today's Consumption",
                  unit: "KWh",
                  value: Number(state.todaysEnergyConsumption ?? 0)?.toFixed(2),
                  bgColor: "#FFBA5B",
                  icon: <IoTodaySharp />,
                  hoverable: true,
                },
                {
                  onClick: () =>
                    openGraphModel({
                      startDate: dayjs().startOf("month").toISOString(),
                      endDate: dayjs().endOf("month").toISOString(),
                      assetId: assetId,
                      title: "Month Consumption",
                    }),
                  title: "Month's Consumption",
                  unit: "KWh",
                  value: Number(state.monthsEnergyConsumption ?? 0)?.toFixed(2),
                  bgColor: "#2C4A88",
                  icon: <MdOutlineCalendarMonth />,
                  hoverable: true,
                },
                {
                  onClick: () =>
                    openGraphModel({
                      startDate: dayjs().startOf("day").toISOString(),
                      endDate: dayjs().endOf("day").toISOString(),
                      assetId: assetId,
                      title: "Today's Consumption",
                    }),
                  title: "Cumulative Consumption",
                  unit: "KWh",
                  value: Number(state.cumulativeEnergy ?? 0)?.toFixed(2),
                  bgColor: "#7A71E0",
                  icon: <VscCalendar />,
                  hoverable: false,
                },
              ].map((e) => (
                <Col flex="1 0 206px">
                  <EnergyConsumptionCard
                    onClick={e.onClick}
                    title={e.title}
                    unit={e.unit}
                    value={e.value}
                    bgColor={e.bgColor}
                    icon={e.icon}
                    hoverable={e.hoverable}
                  />
                </Col>
              ))}
            </Row>
          </Col>
          <Col lg={12} md={24} sm={24}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Text strong>Live Monitoring</Text>
            </Space>
            <Card bodyStyle={{ padding: 0 }}>
              <div className="average-container">
                {[
                  {
                    title: "Average Current (A)",
                    value: Number(state.avgCurrent ?? 0)?.toFixed(2),
                    bgColor: "#FFBA5B",
                    icon: <IoTodaySharp />,
                  },
                  {
                    title: "Average Voltage(V)",
                    value: Number(state.avgVoltage ?? 0)?.toFixed(2),
                    bgColor: "#E3FF37",
                    icon: <AiOutlineThunderbolt />,
                  },
                  {
                    title: "Meter Reading",
                    value: Number(state.meterReading ?? 0)?.toFixed(2),
                    bgColor: "#FCA5D9",
                    icon: <IoSpeedometerOutline />,
                  },
                  {
                    title: "Frequency",
                    value: Number(state.frequency ?? 0)?.toFixed(2),
                    bgColor: "#04CCE8",
                    icon: <GiLightningFrequency />,
                  },
                ].map((e) => (
                  <AvgCard
                    // onClick={e.onClick}
                    title={e.title}
                    // unit={e.unit}
                    value={e.value}
                    bgColor={e.bgColor}
                    icon={e.icon}
                  />
                ))}
              </div>
            </Card>
          </Col>
          <Col lg={24}>
            <Text strong>Carbon Emission</Text>
            <Row gutter={[10, 10]}>
              {[
                {
                  title: "Today's Consumption",
                  unit: "kg of CO2",
                  value: Number(
                    state.todaysEnergyConsumption * 0.85 ?? 0
                  )?.toFixed(2),
                  bgColor: "#FFBA5B",
                  cardColor: "#FFF0DB",
                  icon: <IoTodaySharp />,
                },
                {
                  title: "Month's Consumption",
                  unit: "kg of CO2",
                  value: Number(
                    state.monthsEnergyConsumption * 0.85 ?? 0
                  )?.toFixed(2),
                  bgColor: "#CC6Cee",
                  cardColor: "#F1DBFF",
                  icon: <MdOutlineCalendarMonth />,
                },
                {
                  title: "Cumulative Consumption",
                  unit: "kg of CO2",
                  value: Number(state.cumulativeEnergy * 0.85 ?? 0)?.toFixed(2),
                  bgColor: "#7A71E0",
                  cardColor: "#DBE9FF",
                  icon: <VscCalendar />,
                },
              ].map((e) => (
                <Col flex="1 0 206px">
                  <CarbonEmissionCard
                    // onClick={e.onClick}
                    cardColor={e.cardColor}
                    title={e.title}
                    unit={e.unit}
                    value={e.value}
                    bgColor={e.bgColor}
                    icon={e.icon}
                  />
                </Col>
              ))}
            </Row>
          </Col>
          <Col lg={12}>
            <Card bodyStyle={{ padding: 0, height: "190px" }}>
              <Table
                bordered
                columns={column1}
                size="small"
                dataSource={state.shiftWiseEnergyData}
                pagination={false}
                scroll={{ y: 200 }}
              />
            </Card>
          </Col>
          <Col lg={12}>
            <Card bodyStyle={{ padding: 0, height: "190px" }}>
              <Table
                size="small"
                bordered
                columns={column2}
                dataSource={state.overallvalue}
                pagination={false}
                scroll={{ y: 200 }}
              />
            </Card>
          </Col>
          <Col lg={24}>
            <Text strong>Energy Metrics Overview</Text>
            <Row gutter={[10, 10]}>
              {[
                {
                  title: "Current (A)",
                  data: state.current,
                  colors: colors,
                  height: 250,
                },
                {
                  title: "Voltage (V)",
                  data: state.voltage,
                  colors: colors,
                  height: 250,
                },
                {
                  title: "Load (kWh)",
                  data: state.load,
                  colors: colors,
                  height: 250,
                },
                {
                  title: "Power Factor (kW)",
                  data: state.powerFactor,
                  colors: colors,
                  height: 250,
                },
              ].map((e) => (
                <Col lg={12}>
                  <RealTimeGraph
                    // onClick={e.onClick}
                    title={e.title}
                    color={e.colors}
                    data={e.data}
                    height={e.height}
                    // bgColor={e.bgColor}
                    // icon={e.icon}
                  />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Spin>
      <Modal
        open={state.openGraphModel}
        onCancel={closeGraphModel}
        width={700}
        footer={null}
        title={state.graphModelTitle}
      >
        <Card>
          <BarChart series={state.barData} height={200} horizontal={false} />
        </Card>
      </Modal>
    </Page>
  );
};

export default EnergyLiveDashboard;
