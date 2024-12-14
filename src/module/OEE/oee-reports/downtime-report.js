import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import ReactApexChart from "react-apexcharts";
import { Button, Card, Col, Form, Modal, Row, Select, Typography } from "antd";
import DownTimeService from "../../../services/oee/downtime-service";
import DowntimeReasonList from "../downtime-reason/downtime-reason-list";

const { Text } = Typography;
const { Option } = Select;

const DowntimeReport = (props) => {
  console.log("props", props);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [chartKey, setChartKey] = useState(0);
  const [shiftData, setShiftData] = useState(null);
  const [shiftAllocationId, setShiftAllocationId] = useState("");
  const [refreshProps, setRefreshProps] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const downtimeService = new DownTimeService();

  const handleModalOpen = async () => {
    try {
      const response =
        await downtimeService.getShiftAllocationIdForDownTimeHistory(
          shiftAllocationId,
          props.startDate,
          props.endDate
        );
      setShiftData(response.data);
      setOpen(true);
    } catch (error) {
      console.error("Error fetching shift data:", error);
    }
  };

  useEffect(() => {
    if (open) {
      handleModalOpen();
    }
  }, [open]);

  const handleCloseModal = async () => {
    setOpen(false);
    setRefreshProps(true);
    props.handleGoButtonClick();
  };

  const fetchData = async () => {
    try {
      const response = await downtimeService.getDowntimeData(
        props.startDate,
        props.endDate
      );
      setData(response.data.map((e) => ({ date: e.startDate, data: e.y })));
    } catch (error) {
      console.error("Error fetching downtime data:", error);
    }
  };

  useEffect(() => {
    setData(
      props.downtimeReasonsData?.map((e) => ({
        date: e.startDate,
        data: e.y,
      }))
    );
  }, [props.downtimeReasonsData]);

  useEffect(() => {
    if (refreshProps) {
      fetchData();
      setRefreshProps(false);
    }
  }, [refreshProps]);

  useEffect(() => {
    if (!open && refreshProps) {
      fetchData();
      setRefreshProps(false);
    }
  }, [open, refreshProps]);
  const downtimeData = props.formattedDowntimeReasonsData || [];

  const allReasons = Array.from(
    new Set(
      downtimeData.flatMap(
        (entry) => entry.downTimeReasons?.map((reason) => reason.reason) || []
      )
    )
  );

  const chartOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: downtimeData.map((entry) => entry.m || ""), // Ensure entry.m is defined
    },
    legend: {
      position: "top",
    },
    colors: allReasons.map((reason) => {
      const firstEntry = downtimeData.find((entry) =>
        entry.downTimeReasons?.some((r) => r.reason === reason)
      );
      const matchingReason = firstEntry?.downTimeReasons?.find(
        (r) => r.reason === reason
      );
      return matchingReason ? matchingReason.color : "#000000";
    }),
    events: {
      dataPointSelection: async (event, chartContext, config) => {
        if (event.target.classList.contains("apexcharts-bar")) {
          try {
            const clickedIndex = config.dataPointIndex;
            const clickedBarData = downtimeData[clickedIndex];
            if (clickedBarData) {
              const response =
                await downtimeService.getShiftAllocationIdForDownTimeHistory(
                  clickedBarData.shiftAllocationId
                );
              setShiftData(response.data);
              setOpen(true);
            } else {
              console.error(
                "Error: Unable to determine shiftAllocationId for the clicked bar."
              );
            }
          } catch (error) {
            console.error("Error fetching shift data:", error);
          }
        }
      },
    },
  };

  const chartSeries = allReasons.map((reason) => ({
    name: reason,
    shiftAllocationId: shiftAllocationId,
    data: downtimeData.map((entry) => {
      const matchingReason = entry.downTimeReasons.find(
        (r) => r.reason === reason
      );

      return matchingReason ? matchingReason.minutes : 0;
    }),
  }));

  const modifiedData = props.formattedDowntimeOccurenceData?.map((item) => ({
    ...item,
    minutes: parseInt(item.minutes) === 0 ? 0.1 : parseInt(item.minutes),
  }));

  return (
    <>
      {/* <Card style={{ marginTop: "20px" }} hoverable> */}
      <Row gutter={[16, 16]}>
        <Col sm={24} xs={24} md={12} lg={12}>
          <Card size="small" style={{ height: "300px" }} hoverable>
            <div style={{ height: "100%" }}>
              <Typography.Title level={5}>
                Total Runtime/Downtime
              </Typography.Title>
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
                    categories: props?.formattedXAxisDates,
                    labels: {
                      rotate: -45,
                      trim: true,
                      maxHeight: 50,
                    },
                  },
                  yaxis: {
                    title: {
                      text: "minutes",
                    },
                  },
                  annotations: {
                    points: props?.assets?.map((data, index) => {
                      const yValue = data.y;
                      const zValue = data.z;
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
                    name: "Runtime",
                    data: props?.assets?.map((data) => data.rt),
                  },
                  {
                    name: "Downtime",
                    data: props?.assets?.map((data) => data.dt),
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
            <Typography.Title level={5}>Downtime Reasons</Typography.Title>
            <Chart
              key={chartKey}
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height={250}
              onClick={showModal}
            />
            <Modal
              title=""
              top
              open={open}
              onOk={() => setOpen(false)}
              onCancel={() => setOpen(false)}
              width={1000}
              afterClose={handleCloseModal} // Trigger the function when the modal is closed
              destroyOnClose
            >
              <DowntimeReasonList
                ahId={props.ahId}
                assetId={props.assetId}
                startDate={props.startDate}
                endDate={props.endDate}
                shiftName={props.shiftName}
              />
            </Modal>
          </Card>
        </Col>

        <Col sm={24} xs={24} md={12} lg={12}>
          <Card size="small" style={{ height: "300px" }} hoverable>
            <Typography.Title level={5}>Downtime Occurrences</Typography.Title>
            <ReactApexChart
              options={{
                chart: {
                  type: "bar",
                  height: 350,
                },
                legend: {
                  show: false,
                },
                plotOptions: {
                  bar: {
                    horizontal: true,
                    distributed: true,
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                yaxis: {
                  title: {
                    text: "Reason",
                  },
                },
                xaxis: {
                  categories: props.formattedDowntimeOccurenceData?.map(
                    (item) => item.reason
                  ),
                  title: {
                    text: "Count",
                  },
                  show: false,
                },
                tooltip: {
                  enabled: true,
                  x: {
                    formatter: function (val) {
                      return val + " counts";
                    },
                  },
                },
                colors: props.formattedDowntimeOccurenceData?.map(
                  (item) => item.color
                ),
              }}
              series={[
                {
                  name: "Counts",
                  data: props.formattedDowntimeOccurenceData?.map((item) =>
                    parseInt(item.count)
                  ),
                },
              ]}
              type="bar"
              height={250}
            />
          </Card>
        </Col>
        <Col sm={24} xs={24} md={12} lg={12}>
          <Card size="small" style={{ height: "300px" }} hoverable>
            <Typography.Title level={5}>Downtime (minutes)</Typography.Title>
            <ReactApexChart
              options={{
                chart: {
                  type: "pie",
                  height: 350,
                },
                labels: props.formattedDowntimeOccurenceData?.map(
                  (item) => item.reason
                ),
                tooltip: {
                  enabled: true,
                  y: {
                    formatter: function (val) {
                      return val + " minutes";
                    },
                  },
                },
                colors: props.formattedDowntimeOccurenceData?.map(
                  (item) => item.color || "#000000"
                ),
              }}
              series={modifiedData?.map((item) => item.minutes)}
              type="pie"
              height={250}
            />
          </Card>
        </Col>
      </Row>
      {/* </Card> */}
    </>
  );
};

export default DowntimeReport;
