import { useEffect, useState } from "react";
import ProductService from "../services/track-and-trace-service/product-service";

export const useProductMaster = () => {
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [parentOptions, setParentOptions] = useState([]);
  const [childOptions, setChildOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const service = new ProductService();
    service
      .list(true)
      .then(({ data }) => {
        data.sort((a, b) => a.productName?.localeCompare(b.productName));
        setData(data);
        setOptions(
          data.map((e) => ({
            value: e.productId,
            label: `${e.code} - (${e.productName})`,
          }))
        );

        setParentOptions(
          data
            .filter((e) => e.type == "PARENT" && e.status)
            ?.map((e) => ({
              value: e.productId,
              label: `${e.code} - (${e.productName})`,
            }))
        );
        setChildOptions(
          data
            .filter((e) => e.type != "PARENT" && e.status)
            ?.map((e) => ({
              value: e.productId,
              label: `${e.code} - (${e.productName})`,
            }))
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [loading, { data, options, parentOptions, childOptions }];
};
