import { useEffect, useState } from "react";
import ProductService from "../services/track-and-trace-service/product-service";
import CategoryService from "../services/track-and-trace-service/category-service";
import ModelService from "../services/track-and-trace-service/model-service";
import VariantService from "../services/track-and-trace-service/variant-service";

export const useCategoryModelVariant = () => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [variantOptions, setVariantOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const categoryService = new CategoryService();
    const modelService = new ModelService();
    const variantService = new VariantService();
    Promise.allSettled([
      categoryService.list(),
      modelService.list(),
      variantService.list(),
    ])
      .then((results) => {
        const [categoryResult, modelResult, variantResult] = results;

        if (categoryResult.status === "fulfilled") {
          setCategoryOptions(
            categoryResult?.value?.data?.map((e) => ({
              value: e.categoryId,
              label: `${e.categoryName}`,
            }))
          );
        }

        if (modelResult.status === "fulfilled") {
          setModelOptions(
            modelResult?.value?.data?.map((e) => ({
              value: e.modelId,
              label: `${e.modelName}`,
            }))
          );
        }

        if (variantResult.status === "fulfilled") {
          setVariantOptions(
            variantResult?.value?.data?.map((e) => ({
              value: e.variantId,
              label: `${e.variantName}`,
            }))
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [loading, { categoryOptions, modelOptions, variantOptions }];
};
