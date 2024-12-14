import { useEffect, useMemo, useState } from "react";
import ModelWisePartCountService from "../../../services/oee/modelwise-partcount-service";
import { Card, Typography } from "antd";
import ReactApexChart from "react-apexcharts";

function ModelwisePartCount({ assetId, startDate, endDate }) {
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const options = {
    chart: {
      height: 250,
      type: "bar",
    },
    stroke: {
      show: true,
      colors: ["#e91e63"],
      width: [3],
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        horizontal: true,
        distributed: false,
      },
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: labels,
    },
    colors: ["#e91e639c"],
  };

  const [series, setSeries] = useState([]);
  useMemo(() => {
    setSeries([{ name: "Part count", data: [] }]);
    setLabels([]);
    if (assetId && startDate && endDate) {
      const service = new ModelWisePartCountService();
      service
        .getModelWisePartCount({ assetId, startDate, endDate })
        .then(({ data }) => {
          setSeries([
            { name: "Part count", data: data?.map((e) => e.totalPartProduced) },
          ]);
          setLabels(data?.map((e) => e.modelName));
        });
    }
  }, [assetId, startDate, endDate]);

  return (
    <Card size="small" loading={loading}>
      <Typography.Title level={5}>Modelwise Part Count</Typography.Title>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={250}
      />
    </Card>
  );
}

export default ModelwisePartCount;
