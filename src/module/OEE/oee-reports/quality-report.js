import React, { Component } from "react";
import { Card, message, Tabs } from "antd";
import PageForm from "../../../utils/page/page-form";
import CustomCollapsePanel from "../../../helpers/collapse";
import DateTabs from "../../../helpers/data";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";
import moment from "moment";
import ReactApexChart from "react-apexcharts";
import Chart from "react-apexcharts";

import {
  Select,
  Space,
  Input,
  Checkbox,
  TreeSelect,
  Drawer,
  Button,
  Table,
  DatePicker,
  Col,
  Form,
  Spin,
  Row,
  Radio,
  Typography,
  Badge,
  Carousel,
} from "antd";
import styled from "styled-components";
import AreaChart from "../../../component/AreaChart";
//import FilterFunctions from "../../remote-monitoring/common/filter-functions";
const { Text } = Typography;
const { Option } = Select;
const onSearch = (value) => {};
const CarouselWrapper = styled(Carousel)`
  .slick-dots li button {
    margin-top: 40px;
    width: 13px;
    height: 13px;
    border-radius: 100%;
    background: #fff;
    border: 4px solid #233e7f;
  }
`;

class QualityReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedReason: "",
      selectedCount: 0,
    };
  }

  componentDidMount() {
    const { formattedDefectcatagoryData } = this.props;
    // console.log(this.props.formattedModel, "test you");
    if (
      formattedDefectcatagoryData &&
      formattedDefectcatagoryData.length > 0 &&
      !this.state.selectedReason
    ) {
      const initialReason = formattedDefectcatagoryData[0]?.reason || "";
      this.setState({ selectedReason: initialReason });

      const initialData = formattedDefectcatagoryData.find(
        (item) => item.reason === initialReason
      );

      if (initialData) {
        this.setState({ selectedCount: parseInt(initialData.count) });
      }
    }
  }

  handleReasonChange = (value) => {
    this.setState({ selectedReason: value });

    const selectedData = this.props.formattedDefectcatagoryData.find(
      (item) => item.reason === value
    );

    if (selectedData) {
      this.setState({ selectedCount: parseInt(selectedData.count) });
    }
  };

  render() {
    const {
      formattedQualityCalculationData,
      formattedXAxisDates,
      formattedQualityData,
      formattedDefectcatagoryData,
    } = this.props;
    const { selectedReason, selectedCount } = this.state;

    const formattedData = formattedQualityCalculationData || [];
    const yValue = formattedData.length > 0 ? formattedData[0]?.x || 0 : 0;
    const zValue = formattedData.length > 0 ? formattedData[0]?.y || 0 : 0;

    const chartData = [yValue, zValue];
    const chartOptions = {
      labels: ["Accepted Percentage", "Rejected Percentage"],
      colors: ["rgba(0, 227, 150, 0.85)", "#FF0000"],
      legend: {
        show: true,
      },
    };

    return (
     <>
        <Row gutter={[16, 16]}>
          <Col sm={24} xs={24} md={12} lg={12}>
            <Card size="small" style={{ height: "300px" }} hoverable>
              <div style={{ height: "100%" }}>
                <Typography.Title level={5}>Part Counts</Typography.Title>
                <ReactApexChart
                  options={{
                    chart: {
                      type: "bar",
                      height: 350,
                      stacked: true,
                    },
                    plotOptions: {
                      bar: {
                        horizontal: false,
                        columnWidth: "50%",
                      },
                    },
                    xaxis: {
                      categories: this.props?.formattedXAxisDates,
                      labels: {
                        rotate: -45,
                        trim: true,
                        maxHeight: 50,
                      },
                    },
                    yaxis: {
                      title: {
                        text: "Quality Data",
                      },
                    },
                    annotations: {
                      points: this.props?.assets?.map((data, index) => {
                        const yValue = data.x;
                        const zValue = data.y;
                        const sum = yValue + zValue;
                        return {
                          x: {
                            x: index + 1,
                            offsetX: 0,
                            offsetY: 15,
                          },
                          y: {
                            y: sum,
                            offsetY: -20,
                            label: {
                              text: `Sum: ${sum}`,
                              borderColor: "#000",
                              style: {
                                background: "#fff",
                                fontSize: "12px",
                                color: "#000",
                              },
                            },
                          },
                        };
                      }),
                    },
                    tooltip: {
                      enabled: true,
                      y: {
                        formatter: function (val) {
                          return val + "";
                        },
                      },
                      x: {
                        formatter: function (val) {
                          return val;
                        },
                      },
                    },
                    colors: ["rgba(0, 227, 150, 0.85)", "#FF0000"],
                  }}
                  series={[
                    {
                      name: "Accepted Parts",
                      data: this.props?.assets?.map((data) => data.ap),
                    },
                    {
                      name: "Rejected Parts",
                      data: this.props?.assets?.map((data) => data.rp),
                    },
                  ]}
                  type="bar"
                  height={250}
                />
              </div>
            </Card>
          </Col>
          <Col sm={24} xs={24} md={12} lg={12}>
            <Card size="small" style={{ height: "300px" }} hoverable>
              <Typography.Title level={5}>
                Overall Part Count(%)
              </Typography.Title>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: "400px" }}>
                  <Chart
                    options={{ ...chartOptions }}
                    series={chartData}
                    type="donut"
                    width="420"
                  />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <div style={{ marginBottom: "20px" }} />
        <Row gutter={[16, 16]}>
          <Col sm={24} xs={24} md={12} lg={12}>
            <Card size="small" style={{ height: "300px" }} hoverable>
              <div style={{ height: "100%" }}>
                <Typography.Title level={5}>Defect Category</Typography.Title>
                <ReactApexChart
                  options={{
                    chart: {
                      type: "bar",
                      height: 350,
                    },
                    plotOptions: {
                      bar: {
                        horizontal: false,
                        colors: {
                          ranges: [
                            {
                              from: 0,
                              to: 1000,
                              color: "rgb(255,0,0)", // Red color
                            },
                          ],
                        },
                      },
                    },
                    dataLabels: {
                      enabled: true,
                    },
                    yaxis: {
                      title: {
                        text: "Reason",
                      },
                    },
                    xaxis: {
                      categories: formattedDefectcatagoryData?.map(
                        (item) => item.reason
                      ),
                      labels: {
                        rotate: -45,
                        trim: true,
                        maxHeight: 50,
                      },
                    },
                    tooltip: {
                      enabled: true,
                      y: {
                        formatter: function (val) {
                          return val + "";
                        },
                      },
                      x: {
                        formatter: function (val) {
                          return val + " counts";
                        },
                      },
                    },
                  }}
                  series={[
                    {
                      name: "Part Counts",
                      data: formattedDefectcatagoryData?.map((item) =>
                        parseInt(item.count)
                      ),
                    },
                  ]}
                  type="bar"
                  height={250}
                />
              </div>
            </Card>
          </Col>
          <Col sm={24} xs={24} md={12} lg={12}>
            <Card size="small" style={{ height: "300px" }} hoverable>
              <div style={{ height: "100%" }}>
                <Typography.Title level={5}>Modelwise Report</Typography.Title>
                <ReactApexChart
                  options={{
                    chart: {
                      type: "bar",
                      height: 350,
                      stacked: true,
                    },
                    plotOptions: {
                      bar: {
                        horizontal: false,
                        columnWidth: "50%",
                      },
                    },
                    xaxis: {
                      categories: this.props?.formattedModel?.map(
                        (item) => item.x
                      ),
                      labels: {
                        rotate: -45,
                        trim: true,
                        maxHeight: 50,
                      },
                    },
                    yaxis: {
                      title: {
                        text: "Part Counts",
                      },
                    },
                    tooltip: {
                      enabled: true,
                      y: {
                        formatter: function (val) {
                          return val + "";
                        },
                      },
                      x: {
                        formatter: function (val) {
                          return val;
                        },
                      },
                    },
                    colors: ["rgba(0, 227, 150, 0.85)", "#FF0000"],
                  }}
                  series={[
                    {
                      name: "Part Counts",
                      data: this.props?.formattedModel?.map((item) => item.y),
                    },
                  ]}
                  type="bar"
                  height={250}
                />
              </div>
            </Card>
          </Col>
        </Row>
        </>
    );
  }
}

export default QualityReport;
