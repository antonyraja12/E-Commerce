import { Card, Modal, Typography } from "antd";
import moment from "moment";
import { useContext, useMemo, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import OeeCalculationService from "../../../services/oee-calculation-service";
import DowntimeReasonsSplitForm from "../../OEE/downtime-reason/dowtime-reasons-split-from";
import { OeeDashboardContext } from "../../OEE/oee-dashboard/oee-dashboard-context";
function HotPackDowntimeCard({ startDate, endDate, assetId, shiftName }) {
  const formattedStartDate = moment(startDate).format("DD MMM, hh:mm:ss A");
  const formattedEndDate = moment(endDate).format("DD MMM, hh:mm:ss A");
  const shiftLabel = shiftName === undefined ? "No Shift" : shiftName;
  const ref = useRef(null);
  const { reloadDowntime, setReloadDowntime } = useContext(OeeDashboardContext);
  const [model, setModel] = useState({
    open: false,
    id: null,
    assetId: null,
    startDate: null,
    endDate: null,
  });
  const options = {
    chart: {
      height: 120,
      type: "rangeBar",
      events: {
        click: function (event, chartContext, config) {
          const clickedData = config.config?.series[config.seriesIndex];
          if (clickedData) {
            let { id, status } = clickedData?.data[config.dataPointIndex];
            if (status === false) {
              setModel({
                open: true,
                id: id,
                assetId: null,
                startDate: null,
                endDate: null,
              });
            }
          }
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "100%",
        rangeBarGroupRows: true,
      },
    },

    fill: {
      type: "solid",
    },
    xaxis: {
      type: "datetime",
      labels: {
        formatter: function (val) {
          return moment(val).utcOffset("+05:30").format(" hh:mm:ss A");
        },
      },
    },
    yaxis: {
      show: false,
    },
    legend: {
      position: "top",
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        var a = moment(val[0]).utcOffset("+05:30");
        var b = moment(val[1]).utcOffset("+05:30");
        const differenceInMinutes = Math.round(
          moment.duration(b.diff(a)).asMinutes()
        );
        return `${differenceInMinutes} mins`;
        // return `${a} to ${b}`;
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: true,
        format: "MMM, DD hh:mm:ss A",
        formatter: function (val) {
          return moment(val).utcOffset("+05:30").format("MMM, DD hh:mm:ss A");
        },
      },
    },
    // title: {
    //   text: ` ${moment(startDate).format("DD MMM, hh:mm:ss A")} ,${
    //     shiftName == undefined ? "No Shift" : shiftName
    //   }`,
    //   align: "left",
    //   style: {
    //     fontSize: "10px",
    //     fontWeight: "bold",
    //     color: "#263238",
    //   },
    // },
  };

  const [series, setSeries] = useState([]);

  const list = () => {
    setSeries([]);
    if (assetId && startDate && endDate) {
      const service = new OeeCalculationService();
      service
        .getMachineStatusSummary({
          startDate,
          endDate,
          assetId,
        })
        .then(({ data }) => {
          let reasonArray = Array.from(
            new Set(data?.map((e) => e.downtimeReason))
          );

          let s = reasonArray.map((reason) => {
            let filtered = data.filter((e) => e.downtimeReason === reason);
            let tempData = filtered?.map((e) => ({
              y: [
                new Date(e.start).getTime(),
                e.end ? new Date(e.end).getTime() : new Date().getTime(),
              ],
              x: "Status",
              id: e.machineStatusId,
              status: e.status,
              fillColor: e.color,
            }));
            return {
              name: reason,
              data: tempData,
              color: tempData[0]?.fillColor,
            };
          });

          setSeries(s);
        });
    }
  };

  useMemo(() => {
    list();
  }, [reloadDowntime, startDate, endDate, assetId]);

  const closeModel = (data) => {
    if (data) {
      setReloadDowntime((state) => ++state);
      list();
    }
    setModel(false);
  };
  const save = () => {
    ref.current.submit();
  };

  return (
    <Card size="small">
      <Typography.Title level={5}>Machine Status Overall</Typography.Title>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          fontSize: "10px",
          fontWeight: "bold",
          color: "#263238",
        }}
      >
        <span>
          {" "}
          {shiftLabel},{formattedStartDate}
        </span>

        <span> {formattedEndDate}</span>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="rangeBar"
        height={140}
      />
      <Modal
        open={model.open}
        title="Down Time Reason"
        onCancel={closeModel}
        width={1200}
        onOk={save}
        destroyOnClose
      >
        <DowntimeReasonsSplitForm
          afterSave={(data) => closeModel(data)}
          ref={ref}
          machineStatusId={model.id}
          assetId={assetId}
        />
      </Modal>
    </Card>
  );
}

export default HotPackDowntimeCard;
