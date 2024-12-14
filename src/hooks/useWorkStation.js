import { useEffect, useState } from "react";
import WorkStationService from "../services/track-and-trace-service/work-station-service";

export const useWorkStation = () => {
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const service = new WorkStationService();
    service
      .list()
      .then(({ data }) => {
        data.sort((a, b) => a.seqNo - b.seqNo);
        setData(data);
        setOptions(
          data.map((e) => ({
            value: e.workStationId,
            label: `${e.workStationName}`,
          }))
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [loading, { data, options }];
};
