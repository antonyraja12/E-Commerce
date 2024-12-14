import { Card, Col, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import WorkStationInstanceService from "../../../services/track-and-trace-service/work-station-instance-service";
import { useNavigate, useOutletContext } from "react-router-dom";
const { Text, Title } = Typography;
function AndonCard(props) {
  const [height, setHeight] = useState("100px");
  const navigate = useNavigate();
  const [colorData, setColorData] = useState([]);
  const workStationInstanceService = new WorkStationInstanceService();
  const { isFullscreen } = useOutletContext();
  const colors = [
    {
      name: "Pallet Release",
      background: "#53c41aa7",
      color: "#FFF",
      prop: "palletRelease",
    },
    {
      name: "Material Call",
      background: "#ffc107b0",
      color: "#233E7F",
      prop: "materialCall",
    },
    {
      name: "Work Delay",
      background: "#ff4d50bb",
      color: "#FFF",
      prop: "workDelay",
    },
    {
      name: "Maintenance Call",
      background: "#1890ffad",
      color: "#FFF",
      prop: "maintenanceCall",
    },
    {
      name: "Quality Call",
      background: "#F2F2F2",
      color: "#233E7F",
      prop: "qualityCall",
    },
  ];
  useEffect(() => {
    if (props.height) setHeight(props.height);
  }, [props]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await workStationInstanceService.retrieve(
          props.workStationId
        );
        setColorData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 2000);

    return () => clearInterval(intervalId);
  }, [props.workStationId]);

  const getFirstActiveColor = (data) => {
    if (!data || !data.properties) {
      return null;
    }
    return colors.find((color) => data.properties[color.prop]);
  };

  const activeColor = getFirstActiveColor(colorData);
  const handleNavigate = () => {
    if (!isFullscreen) {
      navigate(`/tat/operator/station/${props.workStationId}`);
    }
  };
  return (
    <Card
      bordered={false}
      className="andon-card"
      size="small"
      style={{
        backgroundColor: activeColor ? activeColor?.background : "gray",
        // height: height,
      }}
      // styles={{
      //   body: {
      //     padding: 20,
      //   },
      // }}
      onClick={props?.onClick ? props?.onClick : handleNavigate}
    >
      <Title
        level={props.level ? props.level : 4}
        style={{
          color: activeColor ? activeColor?.color : "#FFF",
          margin: 0,
        }}
      >
        {props?.name}
      </Title>
    </Card>
  );
}

export default AndonCard;
