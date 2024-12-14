import { useEffect, useState } from "react";
import DeviceTypeService from "../services/track-and-trace-service/device-type-service";

export const useDeviceType = () => {
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const service = new DeviceTypeService();
    service
      .list()
      .then(({ data }) => {
        data.sort((a, b) => a.deviceTypeName?.localeCompare(b.deviceTypeName));
        setData(data);
        setOptions(
          data
            ?.filter((e) => e.status)
            ?.map((e) => ({
              value: e.deviceTypeName,
              label: `${e.deviceTypeName}`,
            }))
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [loading, { data, options }];
};
