import { useEffect, useState } from "react";
import AssetService from "../services/asset-service";

export const useAsset = () => {
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const service = new AssetService();
    service
      .list()
      .then(({ data }) => {
        data.sort((a, b) => a.assetName?.localeCompare(b.assetName));
        setData(data);
        setOptions(data.map((e) => ({ value: e.assetId, label: e.assetName })));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [loading, { data, options }];
};
