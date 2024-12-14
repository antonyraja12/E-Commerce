import { useEffect, useState } from "react";
import ShiftMasterService from "../services/shift-configuration/shift-master-service";

export const useShift = () => {
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const service = new ShiftMasterService();
    service
      .list()
      .then(({ data }) => {
        data.sort((a, b) => a.shiftName?.localeCompare(b.shiftName));
        setData(data);
        setOptions(
          data.map((e) => ({ value: e.shiftMasterId, label: e.shiftName }))
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [loading, { data, options }];
};
