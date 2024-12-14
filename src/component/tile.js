import { Card, Space, Typography } from "antd";
import React, { Component } from "react";

const { Text } = Typography;
class Tile extends Component {
  state = {};
  render() {
    return (
      <Card>
        <Space
          direction="vertical"
          size="middle"
          style={{
            display: "flex",
          }}
        >
          <Text>Title</Text>
          <Text>Value</Text>
        </Space>
      </Card>
    );
  }
}

export default Tile;
