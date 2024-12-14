import React, { Component } from "react";
import { Table } from "antd";
import { Link } from "react-router-dom";

class ListView extends Component {
  state = { isLoading: false, rows: [] };

  static getDerivedStateFromProps(props, state) {
    return { ...state, ...props };
  }

  columns = [
    {
      dataIndex: "assetId",
      key: "assetId",
      title: "S.No",
      width: 80,
      align: "left",
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      dataIndex: "assetName",
      key: "assetName",
      title: "Device",
      width: 160,
      align: "left",
      sorter: (a, b) => a.assetName.localeCompare(b.assetName),
      render: (value, record, index) => {
        return (
          <Link to={`./live-dashboard?assetId=${record.assetId}`}>{value}</Link>
        );
      },
    },
    {
      dataIndex: "todayConsumption",
      key: "todayConsumption",
      title: "Today's Energy Consumption (kWh)",
      align: "left",
      sorter: (a, b) => a.todayConsumption - b.todayConsumption,
    },
    {
      dataIndex: "monthConsumption",
      key: "monthConsumption",
      title: "Month Energy Consumption (kWh)",
      align: "left",
      sorter: (a, b) => a.monthConsumption - b.monthConsumption,
    },
    {
      dataIndex: "meterReading",
      key: "meterReading",
      title: "Energy Meter Reading (kWh)",
      align: "left",
      sorter: (a, b) => a.meterReading - b.meterReading,
    },
  ];

  render() {
    return (
      <Table
        rowKey="assetId"
        pagination={false}
        scroll={{ x: 980 }}
        loading={this.state.isLoading}
        dataSource={this.state.rows}
        columns={this.columns}
        size="middle"
      />
    );
  }
}

export default ListView;
