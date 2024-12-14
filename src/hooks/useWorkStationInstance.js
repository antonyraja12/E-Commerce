import { useEffect, useMemo, useState } from "react";
import WorkStationInstanceService from "../services/track-and-trace-service/work-station-instance-service";

export const useWorkStationInstance = (porps) => {
  const [data, setData] = useState([]);
  const [jobOrder, setJobOrder] = useState(null);
  const [property, setProperty] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { workStationId, autoRefresh, autoRefreshRate } = porps;

  const [stationData, setStationData] = useState({
    currentStep: 0,
    step: [],
    jobOrder: {},
    property: {},
    connection: [],
  });

  const [prevHash, setPrevHash] = useState("");
  useEffect(() => {
    if (workStationId) {
      if (autoRefresh) {
        let interval = setInterval(
          async () => {
            await onRetrieve(workStationId);
          },
          autoRefreshRate ? autoRefreshRate : 1000
        );
        return () => {
          clearInterval(interval);
        };
      } else {
        onRetrieve(workStationId).then(() => {});
      }
    }
  }, [workStationId]);

  const hashData = async (data) => {
    const encoder = new TextEncoder();
    const dataString = JSON.stringify(data);
    const dataBuffer = encoder.encode(dataString);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  };

  const onRetrieve = async (id) => {
    setIsLoading(true);
    const service = new WorkStationInstanceService();
    const { data } = await service.retrieve(id);

    // const newHash = await hashData({
    //   jobOrder: jobOrder,
    //   step: data?.properties?.steps ? JSON.parse(data?.properties?.steps) : [],
    //   currentStep: data?.properties?.currentStep,
    //   property: data?.properties,
    // });
    // console.log(newHash);

    // if (newHash != prevHash) {
    setData(data);
    // setPrevHash(newHash);
    handleChange(data);
    // }

    setIsLoading(false);
  };

  const handleChange = (data) => {
    let jobOrder;

    if (
      data?.properties?.jobOrder &&
      typeof data?.properties?.jobOrder == "object"
    )
      jobOrder = data?.properties?.jobOrder;
    else jobOrder = JSON.parse(data?.properties?.jobOrder);

    let connection = [];
    for (let key in data?.connections) {
      connection.push({
        device: key.toUpperCase(),
        connected: data.connections[key].connected,
      });
    }

    setStationData({
      jobOrder: jobOrder,
      step: data?.properties?.steps ? JSON.parse(data?.properties?.steps) : [],
      currentStep: data?.properties?.currentStep,
      property: data?.properties,
      connection: connection,
    });
  };

  return { isLoading, data, ...stationData };
};
