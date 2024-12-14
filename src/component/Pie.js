import React, { Component } from "react";
import Chart from "react-apexcharts";

class Pie extends Component {
  state = {
    type: "donut",
    series: [],
    options: {
      stroke: {
        show: true,
        width: 1,
        // colors: ["transparent"],
      },
      dataLabels: {
        enabled: true,
      },
      // fill: {
      //   type: "gradient",
      // },
      labels: [],
      legend: {
        show: true,
        // position: "bottom",
      },
    },
  };
  static getDerivedStateFromProps(props, state) {
    return {
      type: props.type ? props.type : state.type,
      series: props.series?.map((e) => e.y),
      options: {
        ...state.options,
        labels: props.series?.map((e) => e.x),
      },
    };
  }

  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Chart
        width={"100%"}
        height={230}
        options={this.state.options}
        series={this.state.series}
        type={this.state.type}
      />
    );
  }
}

export default Pie;
