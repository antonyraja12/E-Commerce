import React, { Component } from "react";
import Chart from "react-apexcharts";
import {
  PieChart,
  Pie as P,
  Sector,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#775dd0"];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  value,
  x,
  y,
  fill,
  payload,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  // const x = cx + radius * Math.cos(-midAngle * RADIAN);
  // const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y + 10}
      fill={fill}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${value.toFixed(0)}`}
    </text>
  );
};
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={0} textAnchor="middle" fill={fill}>
        {payload.x} - {`(${value})`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};
class Pie2 extends Component {
  state = {
    activeIndex: 0,
    type: "pie",
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
      labels: [],
      legend: {
        show: true,
        position: "bottom",
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
  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart onMouseEnter={this.onPieEnter}>
            <P
              // activeIndex={this.state.activeIndex}
              // activeShape={renderActiveShape}
              data={this.props.series}
              // startAngle={180}
              // endAngle={0}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="y"
              // onMouseEnter={this.onPieEnter}
              // onMouseLeave={() =>
              //   this.setState((state) => ({ ...state, activeIndex: 0 }))
              // }
              label
              // label={renderCustomizedLabel}
              // labelLine={false}
            ></P>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default Pie2;
