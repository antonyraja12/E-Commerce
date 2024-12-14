import { Card, Progress } from "antd";
const { Meta } = Card;
function TileCardTwo(props) {
  return (
    <Card bodyStyle={{ padding: "15px 10px" }}>
      <Meta
        description={props.label}
        title={String(props.value)}
        avatar={
          <Progress
            strokeColor={props.color}
            type="dashboard"
            showInfo={false}
            width={75}
            percent={props.percentage}
            strokeWidth={8}
          />
        }
      ></Meta>
    </Card>
  );
}

export default TileCardTwo;
