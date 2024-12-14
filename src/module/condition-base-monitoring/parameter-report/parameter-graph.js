import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import AssetService from "../../../services/asset-service";

function ParameterGraph(params) {
  const { assetId, parameterName, fromDate, toDate } = params;
  const [series, setSeries] = useState([]);
  const [data, setData] = useState([]);
  const options = {
    chart: {
      height: 350,
      type: "line",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: [2],
    },

    xaxis: {
      type: "datetime",
    },
  };

  useEffect(() => {
    if (assetId) {
      const service = new AssetService();
      service
        .getTimeSeriesData(assetId, {
          fromDate,
          toDate,
        })
        .then(({ data }) => {
          setData(data?.slice(-2000));
        });
    }
  }, [assetId, fromDate, toDate]);
  useEffect(() => {
    if (parameterName && data) {
      setSeries(() => [
        {
          data: data.map((e) => ({
            x: new Date(e.timestamp).getTime(),
            y: Number(e.values[parameterName] ?? 0),
          })),
        },
      ]);
    }
  }, [parameterName, data]);
  return (
    <>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
    </>
  );
}

export default ParameterGraph;
