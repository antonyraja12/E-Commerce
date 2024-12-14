import { Avatar, Card, Col, Progress, Row, Typography } from "antd";
import React from "react";
const { Title, Text } = Typography;

class TileCardOne extends React.Component {
  state = {};
  constructor(props) {
    super(props);
  }
  render() {
    const props = this.props;
    // console.log("this.pe")
    return (
      <Card
        className={this.props.className}
        style={this.props.style}
        hoverable
        onClick={() => props.onCardClick()}
        bodyStyle={{ padding: "10px" }}
      >
        <Row gutter={10} align="middle">
          <Col>
            <Avatar
              style={{
                backgroundColor: props.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              shape="circle"
              size={50}
              icon={props.icon}
            />
          </Col>
          <Col>
            <div>
              <Text type="secondary">{props.label}</Text>
              <Title level={2} style={{ margin: 0 }}>
                {String(props.value)}
              </Title>
            </div>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default TileCardOne;
