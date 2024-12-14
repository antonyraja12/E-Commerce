import { Avatar, Card, Popover, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { publicUrl } from "../../../helpers/url";
const { Text, Title } = Typography;

const textLayout = {
  vertical: {
    title: {
      textAnchor: "start",
      x: 40,
    },
    attributes: {},
    attribute: {
      x: 40,
      dy: "1.2em",
    },
  },
  horizontal: {
    title: {
      textAnchor: "start",
      x: -40,
      y: 40,
    },
    attributes: {
      x: 0,
      y: 80,
    },
    attribute: {
      x: 0,
      dy: "1.2em",
    },
  },
};

const getData = (d) => {
  return d;
};
function PureSvgNodeElement(props) {
  const { nodeDatum, orientation, toggleNode, onNodeClick, r3Data } = props;
  const content = (
    <Card title={"Energy Meter Details"} bordered={false} size="small">
      <table cellPadding={3} width="100%">
        <tr>
          <td width="40%">
            <Text>Asset Name</Text>
          </td>
          <td>:</td>
          <td>
            <Text strong>
              <Link to={`./live-dashboard?assetId=${nodeDatum.assetId}`}>
                {nodeDatum.assetName}
              </Link>
            </Text>
          </td>
        </tr>
        <tr>
          <td>
            <Text>Meter Reading</Text>
          </td>
          <td>:</td>
          <td>
            <Text strong>{nodeDatum.meterReading}</Text>
          </td>
        </tr>
        <tr valign="top">
          <td>Today's Consumption</td>
          <td>:</td>
          <td>
            <div>
              <Text strong>{nodeDatum.todayConsumption}</Text>
            </div>
          </td>
        </tr>
      </table>
    </Card>
  );
  const getImageUrl = (url) => {
    const urll = `${publicUrl}/${url}`;
    return urll;
  };
  return (
    // console.log("Test", nodeDatum),
    <>
      {/* <Card> */}
      <circle r={20} onClick={toggleNode}></circle>
      {/* </Card> */}
      <foreignObject
        x={-20}
        y={-20}
        width={40}
        height={40}
        onClick={toggleNode}
      >
        <Popover trigger={"hover"} content={content}>
          <Avatar
            src={
              nodeDatum?.assetImagePath
                ? getImageUrl(nodeDatum?.assetImagePath)
                : null
            }
            size={40}
          />
        </Popover>
      </foreignObject>
      <g className="rd3t-label">
        <text
          className="rd3t-label__title"
          {...textLayout[orientation].title}
          onClick={onNodeClick}
        >
          {nodeDatum.name}
          {/* {nodeDatum.meterReading} */}
        </text>
        {/* Add the following text element below nodeDatum.name */}
        <text
          className="rd3t-label__attributes"
          {...textLayout[orientation].attributes}
        >
          {nodeDatum.attributes &&
            Object.entries(nodeDatum.attributes).map(
              ([labelKey, labelValue], i) => (
                <tspan
                  key={`${labelKey}-${i}`}
                  {...textLayout[orientation].attribute}
                >
                  {labelKey}: {labelValue}
                </tspan>
              )
            )}
        </text>
      </g>
    </>
  );
}

export default PureSvgNodeElement;
