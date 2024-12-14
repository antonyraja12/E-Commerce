import React, { useEffect, useState } from "react";
import { withForm } from "../../../utils/with-form";
import Popups from "../../../utils/page/popups";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
} from "antd";
import ProductService from "../../../services/track-and-trace-service/product-service";
import WorkInstructionService from "../../../services/track-and-trace-service/work-instruction-service";
import LineMasterService from "../../../services/track-and-trace-service/line-master-service";
import dayjs from "dayjs";
import TatJobOrderService from "../../../services/track-and-trace-service/job-order-sevice";
import { dateFormat } from "../../../helpers/date-format";
import { useCategoryModelVariant } from "../../../hooks/useCategoryModelVariant";

const JobOrderForm = (props) => {
  const { form, open, mode, title, onClose, disabled } = props;
  const [product, setProduct] = useState([]);

  const [productOptions, setProductOptions] = useState([]);
  const [variantOptions, setVariantOptions] = useState([]);

  const [data, setData] = useState({
    workinstruction: [],
    selectedInstruction: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lineOption, setLineOption] = useState([]);
  const [isProductLoading, options] = useCategoryModelVariant();

  const productService = new ProductService();
  const workInstructionService = new WorkInstructionService();
  const lineService = new LineMasterService();
  const jobOrderService = new TatJobOrderService();

  useEffect(() => {
    fetchProduct();
    fetchWorkInstruction();
    fetchLineOption();
    if (props.id) {
      patchForm(props.id);
    }
  }, [open, props.id]);

  const patchForm = (id) => {
    jobOrderService.retrieve(id).then(({ data }) => {
      preloadVariantOptions(data.modelId);

      preloadProductOptions(data.modelId, data.variantId);

      form.setFieldsValue({
        ...data,
        date: dayjs(data.date),

        productId: data?.productMasters.map((e) => ({
          label: e.productName,
          value: e.productId,
        })),
      });
    });
  };
  const fetchWorkInstruction = () => {
    workInstructionService.list({ status: true }).then(({ data }) => {
      setData((state) => ({
        ...state,
        workinstruction: data,
        selectedInstruction: data.map((e) => ({
          label: e.description,
          value: e.workInstructionId,
        })),
      }));
    });
  };

  const fetchProduct = async () => {
    // setIsLoading(true);
    try {
      const response = await productService.list({ status: true });
      setProduct(response.data);
    } catch (error) {
      message.error("Failed to fetch device");
    } finally {
      //   setIsLoading(false);
    }
  };

  const preloadVariantOptions = (modelId) => {
    const uniqueVariants = new Map();
    product.forEach((e) => {
      if (e.modelId === modelId && !uniqueVariants.has(e.variantId)) {
        uniqueVariants.set(e.variantId, {
          label: e.variant,
          value: e.variantId,
        });
      }
    });

    const filteredVariants = Array.from(uniqueVariants.values());
    setVariantOptions(filteredVariants);
  };

  const preloadProductOptions = (modelId, variantId) => {
    if (modelId && variantId) {
      const filteredProducts = product
        .filter((e) => e.modelId === modelId && e.variantId === variantId)
        .map((e) => ({
          label: e.productName,
          value: e.productId,
        }));

      setProductOptions(filteredProducts);
    } else {
      setProductOptions([]);
    }
  };

  const handleModelChange = (modelId) => {
    preloadVariantOptions(modelId);
    form.setFieldsValue({ variantId: null, productId: null });
  };

  const handleVariantChange = (variantId) => {
    const selectedModelId = form.getFieldValue("modelId");
    form.setFieldsValue({ productId: null });

    preloadProductOptions(selectedModelId, variantId);
  };
  const fetchLineOption = async () => {
    setIsLoading(true);
    try {
      const response = await lineService.list({ active: true });
      setLineOption(
        response.data?.map((e) => ({
          label: e.lineMasterName,
          value: e.lineMasterId,
        }))
      );
    } catch (error) {
      message.error("Failed to fetch line");
    } finally {
      setIsLoading(false);
    }
  };
  const closePopup = () => {
    form.resetFields();
    onClose();
    setProductOptions(null);
    setVariantOptions(null);
  };

  const onFinish = (value) => {
    const response = props.id
      ? jobOrderService.update(value, props.id)
      : jobOrderService.add(value);

    response
      .then((res) => {
        if (res.status == 200) {
          message.success("Saved successfully");
          closePopup();
        }
      })
      .catch((err) => {
        console.log("error", err);
      })
      .finally(() => {});
  };
  return (
    <Popups
      destroyOnClose
      title={title}
      open={open}
      onCancel={closePopup}
      footer={[
        <Row justify="space-between">
          <Col>
            {(mode == "Add" || mode == "Update") && (
              // {mode == "Add" && (
              <Button key="close" onClick={closePopup}>
                Cancel
              </Button>
            )}
          </Col>
          <Col>
            {(mode == "Add" || mode == "Update") && (
              <Button
                key="submit"
                type="primary"
                onClick={form.submit}
                htmlType="submit"
              >
                {mode == "Add" ? "Save" : "Update"}
              </Button>
            )}
          </Col>
        </Row>,
      ]}
    >
      <Form
        labelAlign="left"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        form={form}
        layout="horizontal"
        colon={false}
        onFinish={onFinish}
        className="form-horizontal"
      >
        <Form.Item
          name="modelId"
          label="Model"
          rules={[{ required: true, message: `Please select model` }]}
        >
          <Select
            options={options?.modelOptions}
            // loading={isWsLoading}
            onChange={handleModelChange}
            showSearch
          />
        </Form.Item>
        <Form.Item
          name="variantId"
          label="Variant"
          rules={[{ required: true, message: `Please select variant` }]}
        >
          <Select
            options={variantOptions}
            onChange={handleVariantChange}
            // loading={isWsLoading}
            showSearch
          />
        </Form.Item>
        <Form.Item
          name={"productId"}
          label="Product name"
          rules={[
            {
              required: true,
              message: "Please select product name",
            },
          ]}
        >
          <Select mode="multiple" options={productOptions} showSearch />
        </Form.Item>
        <Form.Item
          name={"vin"}
          label="VIN"
          rules={[
            {
              required: true,
              message: "Please enter VIN ",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="lineId"
          label="Line"
          rules={[
            {
              required: true,
              message: "Please select line",
            },
          ]}
        >
          <Select options={lineOption} showSearch />
        </Form.Item>

        <Form.Item
          label="Quantity"
          name={"quantity"}
          rules={[
            {
              required: true,
              message: "Please enter quantity",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Date"
          name={"date"}
          rules={[
            {
              required: true,
              message: "Please select date",
            },
          ]}
        >
          <DatePicker
            format={dateFormat}
            style={{ width: "100%" }}
            disabledDate={(current) => {
              return current && current < dayjs().add(-1, "days");
            }}
          />
        </Form.Item>
      </Form>
    </Popups>
  );
};
export default withForm(JobOrderForm);
