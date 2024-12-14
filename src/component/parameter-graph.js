import { Select } from "antd";
import React, { Component } from "react";
import TimeSeriesGraph from "../component/TimeSeriesGraph";
import ParameterGraphService from "../services/cbm-report-services";

class ParameterGraph extends Component {
  state = {
    assetId: null,
    value: [],
    isLoading: false,
    height: "200px",
    result: [], // Store processed data for the graph
  };

  service = new ParameterGraphService();

  constructor(props) {
    super(props);
  }

  processData() {
    if (!this.state.response || this.state.response.length === 0) {
      return;
    }

    const { value, response } = this.state;

    const result = value?.map((param) => {
      const data = response?.map((entry) => {
        const val = entry[param];
        return {
          x: entry.timestamp,
          y: typeof val === "boolean" ? (val ? 1 : 0) : val,
        };
      });

      const parameter = this.props.parameters?.find(
        (e) => e.parameterKey?.toLowerCase() === param
      );

      return {
        name: parameter ? parameter.displayName : param,
        data: data,
      };
    });

    this.setState({ result });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.parameters?.length) {
      return { ...state, ...props };
    }
    return { ...state, ...props };
  }

  componentDidMount() {
    if (this.state.parameters?.length > 0) {
      this.setState(
        (state) => ({
          ...state,
          value: [],
        }),
        () => {
          this.processData();
        }
      );
    }
  }

  handleSelect = (value) => {
    this.setState(
      (state) => ({ ...state, value: [value] }),
      () => {
        this.processData();
      }
    );
  };

  render() {
    return (
      <div>
        <Select
          placeholder="Select Parameter...."
          size="small"
          onChange={this.handleSelect}
          style={{ minWidth: "200px" }}
          options={this.props.parameters
            ?.filter((e) => e.dataType === "BOOLEAN" || e.dataType === "NUMBER")
            ?.map((e) => ({
              label: e.displayName,
              value: e.parameterKey,
            }))}
        ></Select>
        <TimeSeriesGraph
          height={this.state.height}
          series={this.state.result}
        />
      </div>
    );
  }
}

export default ParameterGraph;
