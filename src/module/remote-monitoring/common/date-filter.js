import { DatePicker, Form, Select, Col } from "antd";
import React, { Component } from "react";
import { withForm } from "../../../utils/with-form";
const { RangePicker } = DatePicker;
const { Option } = Select;
class DateFilter extends Component {
  state = {
    open: false,
  };

  setOpen = (value) => {
    this.setState((state) => ({ ...state, open: value }));
  };
  handleChange = (value) => {
    switch (value) {
      case 2:
      // this.props.form;
    }
    if (value === 5) {
      this.setOpen(true);
    } else this.setOpen(false);
    this.setState({ dateRange: null });
  };
  handleRangeChange = (dates) => {
    this.setState({ dateRange: dates });
  };
  componentDidMount() {}
  render() {
    const option = [
      // {label:"Today",value:1},
      { label: "Current Week", value: 2 },
      { label: "Current Month", value: 3 },
      { label: "Current Year", value: 4 },
      // { label: "Custom", value: 5 },
    ];
    const dateRangeText = this.state.dateRange
      ? `${this.state.dateRange[0].format(
          "DD-MM-YYYY"
        )} to ${this.state.dateRange[1].format("DD-MM-YYYY")}`
      : "";
    return (
      <div style={{ position: "relative" }}>
        <Form.Item name="mode">
          <Select
            options={option}
            placeholder={"Mode"}
            // onChange={this.handleChange}
            onSelect={this.handleChange}
            style={{ minWidth: "120px" }}
          />
        </Form.Item>
        <Form.Item name="dateRange" style={{ position: "absolute" }}>
          <RangePicker
            format="DD-MM-YYYY"
            style={{ visibility: "hidden", width: 0 }}
            onOpenChange={(open) => this.setOpen(open)}
            open={this.state.open}
            onChange={this.handleRangeChange}
          />
        </Form.Item>

        <Col>{dateRangeText}</Col>
      </div>
    );
  }
}

export default withForm(DateFilter);
