import { SearchOutlined } from "@ant-design/icons";

import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
  TreeSelect,
  Typography,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { GiLightningFrequency } from "react-icons/gi";
import { IoSpeedometerOutline, IoTodaySharp } from "react-icons/io5";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { VscCalendar } from "react-icons/vsc";
import { Link } from "react-router-dom";
import RealTimeChart from "../../../component/Legend_LiveChart";
import ContinentService from "../../../services/continent-service";
import CountryService from "../../../services/country-service";
import EnergyConsumptionDashboardService from "../../../services/energy-services/energy-consumption-dashboard-service";
import Page from "../../../utils/page/page";
import { withAuthorization } from "../../../utils/with-authorization";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";
import FilterFunctions from "../../remote-monitoring/common/filter-functions";
import BarChart from "./EnergyBarChart";
import EnergyDetailDashboardService from "../../../services/energy-services/energy-detail-dashboard-service";
import DynamicDashboardConfigurationService from "../../../services/dynamic-dashboard-configuration-service";
// const style = {
//   formItem: {
//     minWidth: "120px",
//   },
// };
const { Text, Title } = Typography;
const gridStyle = {
  width: "100%",
  textAlign: "center",
};
const { Option } = Select;
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
          <Title level={4} style={{ color: "#2C4A88", marginTop: "8px" }}>
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
class EnergyLiveDashboard extends FilterFunctions {
  state = { isLoading: false, assetId: null };
  service = new EnergyConsumptionDashboardService();
  filterfunctionsservice = new FilterFunctions();
  continentService = new ContinentService();
  countryService = new CountryService();
  dashboardConfig = new DynamicDashboardConfigurationService();
  assetWiseService = new EnergyDetailDashboardService();
  componentDidMount() {
    this.loadAppHierarchy();
    this.loadConfig();
    const assetId = this.props.searchParams.get("assetId");
    if (assetId !== "null" && assetId !== "undefined" && assetId) {
      this.props.form.setFieldsValue({
        startDate: dayjs().startOf("day").toISOString(),
        endDate: dayjs().endOf("day").toISOString(),
      });
    }
  }
  saveTodaysEnergy = (data) => {
    let formData = new FormData();
    for (let x in data) {
      formData.append(x, data[x]);
    }
    this.service.saveTodaysComsumption(formData);
  };
  loadAppHierarchy = () => {
    this.appHierarchyService
      .list()
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          parentTreeList: this.appHierarchyService.convertToSelectTree(data),
        }));

        this.getAssetList(
          this.appHierarchyService.convertToSelectTree(data)[0].value
        );
      })
      .catch((error) => {
        console.error("Failed to load app hierarchy:", error);
      });
  };
  loadConfig = () => {
    this.dashboardConfig
      .list()
      .then(({ data }) => {
        const convertedData = data.reduce((acc, item) => {
          acc[item.dynamicDashboardName] = item.status;
          return acc;
        }, {});
        this.setState((state) => ({
          ...this.state,
          dashboardConfig: convertedData,
        }));
      })
      .catch((error) => {
        console.error("Failed to load dashboard config:", error);
      });
  };
  getAssetList(ahid) {
    this.setState((state) => ({
      ...state,
      isAssetListLoading: true,
      assetList: [],
    }));
    this.assetService
      .list({
        active: true,
        aHId: ahid,
        assetCategory: 2,
      })
      .then((response) => {
        const assetList = response.data?.map((e) => ({
          label: e.assetName,
          value: e.assetId,
        }));

        this.setState({ assetList });

        const assetId = this.props.searchParams.get("assetId");
        if (assetId) {
          const selectedAsset = assetList.find(
            (asset) => asset.value === parseInt(assetId, 10)
          );
          if (selectedAsset) {
            this.props.form.setFieldsValue({ assetId: selectedAsset.value });
          }
        } else {
          this.props.form.setFieldsValue({
            assetId: response.data[0]?.assetId,
          });
        }

        this.props.form.setFieldsValue({ ahid: ahid });
      })
      .finally(() => {
        this.setState({ isAssetListLoading: false });
        setTimeout(() => {
          if (this.props.form.getFieldValue("assetId")) {
            this.props.form?.submit();
          }
        }, 500);
      });
  }

  setAssetId = (assetId) => {
    const assetIdValue = assetId ? assetId.value : assetId;
    this.setState({ assetId: assetIdValue }, () => {
      this.props.form.setFieldsValue({ assetId: assetIdValue });
    });
  };
  handleDateTabsModeChange = (mode) => {
    this.setState({ mode }, () => {
      this.props.form.submit();
    });
  };
  setDatefield = (v) => {
    this.props?.form.setFieldsValue({
      startDate: new Date(v.startDate),
      endDate: new Date(v.endDate),
    });
    this.setState((state) => state);
  };
  // setAssetId = (assetId) => {
  //   this.setState({ assetId: assetId });
  // };
  search = (data) => {
    this.setState((state) => ({
      ...state,
      isLoading: true,
    }));

    let obj = { ...data };
    if (obj.mode === 5) {
      obj.fromDate = moment(data.dateRange[0]).format("YYYY-MM-DD");
      obj.toDate = moment(data.dateRange[1]).format("YYYY-MM-DD");
    }
    delete obj.dateRange;
    this.service.getEnergyDataShiftWise(data).then(({ data }) => {
      this.setState((state) => ({ ...state, shiftWiseEnergyData: data }));
    });
    this.service
      .getEnergyData(data)
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          energyTable: data,
          todaysEnergyConsumption: data[data.length - 1]?.todayConsumption,
          monthsEnergyConsumption: data[data.length - 1]?.monthConsumption,
          cumulativeEnergy: data[data.length - 1]?.cumulativeConsumption,
        }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
      });
    this.service
      .getLiveMonitoringData(data)
      .then(({ data }) => {
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
        const { dashboardConfig } = this.state;
        for (let x of rows) {
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
        const overallvalue = [
          {
            phase: "Phase 1",
            current: data[data.length - 1]?.values?.A1,
            voltage: data[data.length - 1]?.values?.V1,
            load: data[data.length - 1]?.values?.L1,
            powerFactor: data[data.length - 1]?.values?.PF1,
            status: dashboardConfig?.energyPhase1,
          },
          {
            phase: "Phase 2",
            current: data[data.length - 1]?.values?.A2,
            voltage: data[data.length - 1]?.values?.V2,
            load: data[data.length - 1]?.values?.L2,
            powerFactor: data[data.length - 1]?.values?.PF2,
            status: dashboardConfig?.energyPhase2,
          },
          {
            phase: "Phase 3",
            current: data[data.length - 1]?.values?.A3,
            voltage: data[data.length - 1]?.values?.V3,
            load: data[data.length - 1]?.values?.L3,
            powerFactor: data[data.length - 1]?.values?.PF3,
            status: dashboardConfig?.energyPhase3,
          },
        ].filter((entry) => entry.status === true);
        const avgCurrent =
          overallvalue.length > 0
            ? overallvalue.reduce((sum, entry) => {
                if (typeof entry.current === "number") {
                  return sum + entry.current;
                }
                return sum;
              }, 0) / overallvalue.length
            : 0;
        console.log(overallvalue, avgCurrent, "avgCurrent");
        const avgVoltage =
          overallvalue.length > 0
            ? overallvalue.reduce((sum, entry) => {
                if (typeof entry.voltage === "number") {
                  return sum + entry.voltage;
                }
                return sum;
              }, 0) / overallvalue.length
            : 0;
        this.setState((state) => ({
          ...state,
          overallvalue: overallvalue,
          meterReading: data[data.length - 1]?.values?.METERREADING,
          frequency: data[data.length - 1]?.values?.FREQUENCY,
          // avgCurrent:
          //   (data[data.length - 1]?.values?.A1 +
          //     data[data.length - 1]?.values?.A2 +
          //     data[data.length - 1]?.values?.A3) /
          //   3,
          avgCurrent: avgCurrent,
          avgVoltage: avgVoltage,
          // avgVoltage:
          //   (data[data.length - 1]?.values?.V1 +
          //     data[data.length - 1]?.values?.V2 +
          //     data[data.length - 1]?.values?.V3) /
          //   3,
          current: [
            {
              name: "Phase 1",
              data: data[data.length - 1]?.values?.A1,
              status: dashboardConfig?.energyPhase1,
            },
            {
              name: "Phase 2",
              data: data[data.length - 1]?.values?.A2,
              status: dashboardConfig?.energyPhase2,
            },
            {
              name: "Phase 3",
              data: data[data.length - 1]?.values?.A3,
              status: dashboardConfig?.energyPhase3,
            },
          ].filter((entry) => entry.status === true),
          voltage: [
            {
              name: "Phase 1",
              data: data[data.length - 1]?.values?.V1,
              status: dashboardConfig?.energyPhase1,
            },
            {
              name: "Phase 2",
              data: data[data.length - 1]?.values?.V2,
              status: dashboardConfig?.energyPhase2,
            },
            {
              name: "Phase 3",
              data: data[data.length - 1]?.values?.V3,
              status: dashboardConfig?.energyPhase3,
            },
          ].filter((entry) => entry.status === true),
          load: [
            {
              name: "Phase 1",
              data: data[data.length - 1]?.values?.L1,
              status: dashboardConfig?.energyPhase1,
            },
            {
              name: "Phase 2",
              data: data[data.length - 1]?.values?.L2,
              status: dashboardConfig?.energyPhase2,
            },
            {
              name: "Phase 3",
              data: data[data.length - 1]?.values?.L3,
              status: dashboardConfig?.energyPhase3,
            },
          ].filter((entry) => entry.status === true),
          powerFactor: [
            {
              name: "Phase 1",
              data: data[data.length - 1]?.values?.PF1,
              status: dashboardConfig?.energyPhase1,
            },
            {
              name: "Phase 2",
              data: data[data.length - 1]?.values?.PF2,
              status: dashboardConfig?.energyPhase2,
            },
            {
              name: "Phase 3",
              data: data[data.length - 1]?.values?.PF3,
              status: dashboardConfig?.energyPhase3,
            },
          ].filter((entry) => entry.status === true),
        }));
      })
      .catch((error) => {
        console.log(error);
      });

    // data = null;
  };

  column1 = [
    {
      dataIndex: "shiftName",
      key: "shiftName",
      title: "Shift",
      align: "left",
      width: 150,
    },
    {
      dataIndex: "shiftConsumption",
      key: "shiftConsumption",
      title: "Today's Consumption (kWh)",
      align: "left",
      width: 200,
      render: (value) => {
        return value ? value.toFixed(2) : "0";
      },
    },
    {
      dataIndex: "cumulativeConsumption",
      key: "cumulativeConsumption",
      align: "left",
      title: "Cumulative Consumption (kWh)",
      render: (value) => {
        return value ? value.toFixed(2) : "0";
      },
    },
  ];
  column2 = [
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
      align: "left",
      render: (value) => {
        return value ? value.toFixed(2) : "0";
      },
    },
    {
      dataIndex: "voltage",
      key: "voltage",
      title: "Voltage (V)",
      align: "left",
      render: (value) => {
        return value ? value.toFixed(2) : "0";
      },
    },
    {
      dataIndex: "load",
      key: "load",
      title: "Load (kWh) ",
      align: "left",
      render: (value) => {
        return value ? value.toFixed(2) : "0";
      },
    },
    {
      dataIndex: "powerFactor",
      key: "powerFactor",
      title: "Power Factor (kW)",
      align: "left",
      render: (value) => {
        return value ? value.toFixed(2) : "0";
      },
    },
  ];

  getBarData = (mainData) => {
    this.setState((state) => ({
      ...state,
      isLoading: true,
      monthConsumption: mainData?.monthConsumption,
    }));
    this.service
      .getBarGraphData(mainData)
      .then(({ data }) => {
        if (data.length) {
          this.setState((state) => ({
            ...state,
            barData: data?.map((e) => ({
              x: e.x,
              y: e.y,
              z: e.z,
              name: e.name,
            })),
          }));
        } else {
          this.setState((state) => ({
            ...state,
            barData: [],
          }));
        }
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
      });
  };
  openGraphModel = (mainData) => {
    this.setState((state) => ({
      ...state,
      openGraphModel: true,
      graphModelTitle: mainData?.title,
    }));
    this.getBarData(mainData);
  };

  closeGraphModel = () => {
    this.setState((state) => ({ ...state, openGraphModel: false }));
  };
  render() {
    const colors = ["#FF2D00", "#ECFF00", "#0042FF"];
    const { isLoading } = this.props;
    const { dashboardConfig } = this.state;
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }
    let phaseAverage = "";

    if (this.state.overallvalue?.length > 1) phaseAverage = "Average";
    return (
      <Spin spinning={isLoading}>
        <Page
          title="Energy Live Dashboard"
          filter={
            <Form
              size="small"
              onFinish={this.search}
              form={this.props.form}
              // initialValues={{
              //   assetId:
              //     this.props.searchParams.get("assetId") &&
              //     this.props.searchParams.get("assetId"),
              // }}
            >
              <Row gutter={[10, 10]}>
                <Form.Item name="startDate" hidden></Form.Item>
                <Form.Item name="endDate" hidden></Form.Item>
                <Col lg={4}>
                  <Form.Item name="ahid" style={{ minWidth: "150px" }}>
                    <TreeSelect
                      onChange={(v) => this.getAssetList(v)}
                      showSearch
                      loading={this.state.isparentTreeListLoading}
                      placeholder="Site"
                      allowClear
                      treeData={this.state.parentTreeList}
                    ></TreeSelect>
                  </Form.Item>
                </Col>
                <Col lg={4}>
                  <Form.Item name="assetId">
                    <Select
                      showSearch
                      loading={this.state.isAssetListLoading}
                      placeholder="Asset"
                      allowClear
                      options={this.state.assetList}
                      onChange={this.setAssetId}
                      optionLabelProp="label"
                      labelInValue
                    />
                  </Form.Item>
                </Col>

                <Col>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SearchOutlined />}
                    >
                      Go
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          }
        >
          <Spin spinning={false}>
            <Row gutter={[10, 10]} align="top">
              <Col lg={12} md={24} sm={24}>
                <Text strong>Energy Consumption</Text>
                <Row gutter={[10, 10]}>
                  {[
                    {
                      onClick: () =>
                        this.openGraphModel({
                          startDate: dayjs().startOf("day").toISOString(),
                          endDate: dayjs().endOf("day").toISOString(),
                          assetId: this.props.form.getFieldValue("assetId"),
                          title: "Today's Consumption",
                          monthConsumption: false,
                        }),
                      title: "Today's Consumption",
                      unit: "kWh",
                      value: Number(
                        this.state.todaysEnergyConsumption ?? 0
                      )?.toFixed(2),
                      bgColor: "#FFBA5B",
                      icon: <IoTodaySharp />,
                      hoverable: true,
                    },
                    {
                      onClick: () =>
                        this.openGraphModel({
                          startDate: dayjs().startOf("month").toISOString(),
                          endDate: dayjs().endOf("month").toISOString(),
                          assetId: this.props.form.getFieldValue("assetId"),
                          title: "Month Consumption",
                          monthConsumption: true,
                        }),
                      title: "Month's Consumption",
                      unit: "kWh",
                      value: Number(
                        this.state.monthsEnergyConsumption ?? 0
                      )?.toFixed(2),
                      bgColor: "#2C4A88",
                      icon: <MdOutlineCalendarMonth />,
                      hoverable: true,
                    },
                    {
                      onClick: () =>
                        this.openGraphModel({
                          startDate: dayjs().startOf("day").toISOString(),
                          endDate: dayjs().endOf("day").toISOString(),
                          assetId: this.props.form.getFieldValue("assetId"),
                          title: "Today's Consumption",
                        }),
                      title: "Cumulative Consumption",
                      unit: "kWh",
                      value: Number(this.state.cumulativeEnergy ?? 0)?.toFixed(
                        2
                      ),
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
                <Space
                  style={{ width: "100%", justifyContent: "space-between" }}
                >
                  <Text strong>Live Monitoring</Text>
                  <Link
                    to={`../live-dashboard/reports?assetId=${this.props.form.getFieldValue(
                      "assetId"
                    )}`}
                  >
                    Reports
                  </Link>
                </Space>
                <Card bodyStyle={{ padding: 0 }}>
                  <div className="average-container">
                    {[
                      {
                        title: `${phaseAverage} Current (A)`,
                        value: isNaN(Number(this.state.avgCurrent))
                          ? "0.00"
                          : Number(this.state.avgCurrent).toFixed(2),
                        bgColor: "#FFBA5B",
                        icon: <IoTodaySharp />,
                      },
                      {
                        title: `${phaseAverage} Voltage(V)`,
                        value: isNaN(Number(this.state.avgVoltage))
                          ? "0.00"
                          : Number(this.state.avgVoltage).toFixed(2),
                        bgColor: "#E3FF37",
                        icon: <AiOutlineThunderbolt />,
                      },
                      {
                        title: "Meter Reading (kWh)",
                        value: isNaN(Number(this.state.meterReading))
                          ? "0.00"
                          : Number(this.state.meterReading).toFixed(2),
                        bgColor: "#FCA5D9",
                        icon: <IoSpeedometerOutline />,
                      },
                      {
                        title: "Frequency (Hz)",
                        value: isNaN(Number(this.state.frequency))
                          ? "0.00"
                          : Number(this.state.frequency).toFixed(2),
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
              {console.log(dashboardConfig, "dashboardConfig")}
              {dashboardConfig && (
                <>
                  {dashboardConfig?.energyCarbonEmission && (
                    <Col lg={24}>
                      <Text strong>Carbon Emission</Text>
                      <Row gutter={[10, 10]}>
                        {[
                          {
                            title: "Today's Consumption",
                            unit: "kg of CO2",
                            value: isNaN(
                              Number(this.state.todaysEnergyConsumption)
                            )
                              ? "0.00"
                              : (
                                  Number(this.state.todaysEnergyConsumption) *
                                  0.85
                                ).toFixed(2),
                            bgColor: "#FFBA5B",
                            cardColor: "#FFF0DB",
                            icon: <IoTodaySharp />,
                          },
                          {
                            title: "Month's Consumption",
                            unit: "kg of CO2",
                            value: isNaN(
                              Number(this.state.monthsEnergyConsumption)
                            )
                              ? "0.00"
                              : (
                                  Number(this.state.monthsEnergyConsumption) *
                                  0.85
                                ).toFixed(2),

                            bgColor: "#CC6Cee",
                            cardColor: "#F1DBFF",
                            icon: <MdOutlineCalendarMonth />,
                          },
                          {
                            title: "Cumulative Consumption",
                            unit: "kg of CO2",
                            value: isNaN(Number(this.state.cumulativeEnergy))
                              ? "0.00"
                              : (
                                  Number(this.state.cumulativeEnergy) * 0.85
                                ).toFixed(2),

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
                  )}
                  {dashboardConfig?.energyShift && (
                    <Col
                      lg={
                        dashboardConfig?.energyPhase &&
                        this.state.overallvalue?.length > 1
                          ? 12
                          : 24
                      }
                    >
                      <Card bodyStyle={{ padding: 0, height: "190px" }}>
                        <Table
                          bordered
                          columns={this.column1}
                          size="small"
                          dataSource={this.state.shiftWiseEnergyData}
                          pagination={false}
                          scroll={{ y: 200 }}
                        />
                      </Card>
                    </Col>
                  )}
                  {console.log(this.state.overallvalue)}
                  {dashboardConfig?.energyPhase &&
                    this.state.overallvalue?.length > 1 && (
                      <Col lg={dashboardConfig?.energyShift ? 12 : 24}>
                        <Card bodyStyle={{ padding: 0, height: "190px" }}>
                          <Table
                            size="small"
                            bordered
                            columns={this.column2}
                            dataSource={this.state.overallvalue}
                            pagination={false}
                            scroll={{ y: 200 }}
                          />
                        </Card>
                      </Col>
                    )}
                  {(dashboardConfig?.energyCurrent ||
                    dashboardConfig?.energyVoltage ||
                    dashboardConfig?.energyLoad ||
                    dashboardConfig?.energyPowerFactor) && (
                    <Col lg={24}>
                      <Text strong>Energy Metrics Overview</Text>
                      <Row gutter={[10, 10]}>
                        {[
                          {
                            title: "Current (A)",
                            data: this.state.current,
                            colors: colors,
                            height: 250,
                            shouldRender:
                              dashboardConfig?.energyCurrent === true,
                          },
                          {
                            title: "Voltage (V)",
                            data: this.state.voltage,
                            colors: colors,
                            height: 250,
                            shouldRender:
                              dashboardConfig?.energyVoltage === true,
                          },
                          {
                            title: "Load (kWh)",
                            data: this.state.load,
                            colors: colors,
                            height: 250,
                            shouldRender: dashboardConfig?.energyLoad === true,
                          },
                          {
                            title: "Power Factor (kW)",
                            data: this.state.powerFactor,
                            colors: colors,
                            height: 250,
                            shouldRender:
                              dashboardConfig?.energyPowerFactor === true,
                          },
                        ].map(
                          (e) =>
                            e.shouldRender && (
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
                            )
                        )}
                      </Row>
                    </Col>
                  )}
                </>
              )}
            </Row>
          </Spin>
          <Modal
            open={this.state.openGraphModel}
            onCancel={this.closeGraphModel}
            width={700}
            footer={null}
            title={this.state.graphModelTitle}
          >
            <Card>
              <BarChart
                monthConsumption={this.state.monthConsumption}
                series={this.state.barData}
                height={200}
                horizontal={false}
              />
            </Card>
          </Modal>
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(withForm(EnergyLiveDashboard)));
