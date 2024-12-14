import { Avatar, Card, Progress, Typography } from "antd";
import React from "react";
const { Title, Text } = Typography;

class TileCard extends React.Component {
  state = {};
  constructor(props) {
    super(props);
  }
  render() {
    const props = this.props;
    return (
      <Card
        className={this.props.className}
        style={this.props.style}
        hoverable
        onClick={() => props.onCardClick()}
        bodyStyle={{ padding: "20px 10px 10px 10px" }}
      >
        <Card.Meta
          description={props.label}
          title={String(props.value)}
          avatar={
            <Avatar
              style={{
                backgroundColor: props.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              shape="square"
              size={50}
              icon={props.icon}
            />
          }
        ></Card.Meta>
        <Progress
          type="line"
          strokeColor={props.color}
          percent={props.percentage}
          size="small"
          // step={20}
          showInfo={false}
        />
      </Card>
    );
  }
}

export default TileCard;
