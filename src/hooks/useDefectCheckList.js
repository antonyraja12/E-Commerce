import { useEffect, useState } from "react";
import DefectChecklistService from "../services/track-and-trace-service/defect-checklist-service";

export const useDefectCheckList = () => {
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const service = new DefectChecklistService();
    service
      .list()
      .then(({ data }) => {
        data.sort((a, b) => a.defectSequence - b.defectSequence);
        setData(data);
        // setOptions(data.map((e) => ({ value: e.assetId, label: e.assetName })));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [loading, { data }];
};
