import React, { Component } from "react";

import ReactApexChart from "react-apexcharts";
class ShiftPlanningProductionChart extends Component {
  state = {
    series: [],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },

      yaxis: {
        // title: {
        //   text: "$ (thousands)",
        // },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        // y: {
        //   formatter: function (val) {
        //     return "$ " + val + " thousands";
        //   },
        // },
      },
    },
  };

  componentDidMount() {
    const { data } = this.props;

    let res = data.reduce((c, e) => {
      if (c[e.componentId] !== undefined) {
        c[e.componentId].targetQuantity += e.quantity;
        c[e.componentId].producedQuantity += e.producedQuantity;
        c[e.componentId].rejectedQuantity += e.rejectedQuantity;
        c[e.componentId].goodQuantity +=
          e.producedQuantity - e.rejectedQuantity;
      } else {
        c[e.componentId] = {
          componentId: e.componentId,
          componentName: e.component?.componentName,
          componentNumber: e.component?.componentNumber,
          targetQuantity: e.quantity,
          producedQuantity: e.producedQuantity,
          rejectedQuantity: e.rejectedQuantity,
          goodQuantity: e.producedQuantity - e.rejectedQuantity,
        };
      }
      return c;
    }, {});
    let resultArray = Object.values(res);

    let series = [
      {
        name: "Target Quantity",
        data: resultArray.map((e) => e.targetQuantity),
      },
      {
        name: "Produced Quantity",
        data: resultArray.map((e) => e.producedQuantity),
      },
      {
        name: "Good Quantity",
        data: resultArray.map((e) => e.goodQuantity),
      },
      {
        name: "Rejected Quantity",
        data: resultArray.map((e) => e.rejectedQuantity),
      },
    ];
    let labels = resultArray.map((e) => e.componentNumber);
    this.setState((state) => ({
      ...state,
      series: series,
      options: { ...state.options, labels: labels },
    }));
  }

  render() {
    const { options, series } = this.state;
    return (
      <div>
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      </div>
    );
  }
}

export default ShiftPlanningProductionChart;
