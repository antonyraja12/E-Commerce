import { useEffect, useMemo, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import WorkStationService from "../../../services/track-and-trace-service/work-station-service";
import WorkStationInstance from "./work-station-instance";
import WorkStationQA from "./work-station-qa";
import WorkStationRework from "./work-station-rework";

import CameraStation from "./camera-station";

function Operator() {
  const { title, setTitle } = useOutletContext();

  const { id } = useParams();
  const [component, setComponent] = useState(<></>);
  useEffect(() => {
    const service = new WorkStationService();
    service.retrieve(id).then(({ data }) => {
      setTitle(`${data.workStationName} : ${data.displayName}`);
      if (data.type == "MES") setComponent(<WorkStationInstance />);
      else if (data.type == "QA") setComponent(<WorkStationQA />);
      else if (data.type == "Rework") setComponent(<WorkStationRework />);
      else if (data.type == "Camera") setComponent(<CameraStation />);
      else setComponent(<WorkStationInstance />);
    });
  }, [id]);

  return component;
}

export default Operator;
