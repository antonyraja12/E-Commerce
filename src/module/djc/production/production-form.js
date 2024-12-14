import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { MaterialService } from "../../../services/djc/material-service";
import { ProductionService } from "../../../services/djc/production-service";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

const ProductionForm = (props) => {
  const { modal, form } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [productOption, setProductOption] = useState([]);
  const [subProductOption, setSubProductOption] = useState([]);
  const service = new ProductionService();
  const materialService = new MaterialService();

  useEffect(() => {
    if (modal.open) {
      fetchProductOption();
    }
  }, [modal.open]);

  useEffect(() => {
    if (modal.id) {
      onRetrieve(modal.id);
    }
  }, [modal.id]);

  const fetchProductOption = async () => {
    setIsLoading(true);
    try {
      const response = await materialService.getProductionProduct();
      setProductOption(
        response.data?.map((e) => ({
          label: e.materialName,
          value: e.materialId,
          type: e.materialType,
        }))
      );
    } catch (error) {
      message.error("Failed to fetch product");
    } finally {
      setIsLoading(false);
    }
  };

  const onRetrieve = async (id) => {
    setIsLoading(true);
    try {
      const response = await service.retrieve(id);
      patchForm(response.data);
    } catch (error) {
      message.error("Failed to fetch production");
    } finally {
      setIsLoading(false);
    }
  };

  const patchForm = (data) => {
    updateSubProduct(data?.finishedProductId);
    const updatedSubs = data.productionMasterSubs.map((item) => {
      const selectedMaterial = subProductOption.find(
        (option) => option.value === item.materialId
      );

      const avatarColor = selectedMaterial
        ? selectedMaterial.type === "Product"
          ? "#f56a00"
          : selectedMaterial.type === "Component"
          ? "#87d068"
          : "#bfbfbd"
        : "#bfbfbd";

      const avatarText = selectedMaterial
        ? selectedMaterial.label.charAt(0)
        : "D";

      return { ...item, avatarColor, avatarText };
    });

    form.setFieldsValue({
      ...data,
      productionMasterSubs: updatedSubs,
    });
  };

  const onFinish = async (value) => {
    let response;
    if (modal.id) {
      response = await service.update(value, modal.id);
    } else {
      response = await service.save(value);
    }
    if (response.status === 200) {
      const action = modal.id ? "updated" : "added";
      message.success(`Production ${action} successfully`);
    } else {
      message.error(`Something went wrong, Try again!`);
    }
    onClose();
  };

  const onClose = () => {
    form.resetFields();
    props.onClose();
  };

  const updateSubProduct = (value) => {
    const filteredOptions = productOption.filter(
      (option) => option.value !== value
    );
    setSubProductOption(filteredOptions);
    form.setFieldsValue({ productionMasterSubs: [] });
  };

  const handleMaterialChange = (value, index) => {
    const selectedMaterial = subProductOption.find(
      (option) => option.value === value
    );

    if (selectedMaterial) {
      const avatarColor = selectedMaterial
        ? selectedMaterial.type === "Product"
          ? "#f56a00"
          : selectedMaterial.type === "Component"
          ? "#87d068"
          : "#bfbfbd"
        : "#bfbfbd";

      const avatarText = selectedMaterial
        ? selectedMaterial.label.charAt(0)
        : "D";

      const updatedSubs = form
        .getFieldValue("productionMasterSubs")
        .map((item, i) =>
          i === index ? { ...item, avatarColor, avatarText } : item
        );

      form.setFieldsValue({ productionMasterSubs: updatedSubs });
    }
  };

  return (
    <Popups
      title={modal.title}
      open={modal.open}
      onCancel={onClose}
      width={800}
      footer={[
        <Row justify="space-between" key="footer">
          <Col>
            {(modal.mode === "Add" || modal.mode === "Update") && (
              <Button key="close" onClick={onClose}>
                Cancel
              </Button>
            )}
          </Col>
          <Col>
            {(modal.mode === "Add" || modal.mode === "Update") && (
              <Button
                key="submit"
                type="primary"
                onClick={() => form.submit()}
                htmlType="submit"
              >
                {modal.mode === "Add" ? "Save" : "Update"}
              </Button>
            )}
          </Col>
        </Row>,
      ]}
    >
      <Spin spinning={isLoading}>
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          labelAlign="left"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ status: true }}
          disabled={modal.disabled}
        >
          <Row gutter={[10, 10]}>
            <Col span={8}>
              <Form.Item
                name="finishedProductName"
                label="Production Name"
                rules={[
                  { required: true, message: "Please enter production name" },
                ]}
              >
                <Input placeholder="Enter production name" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="finishedProductId"
                label="Product"
                rules={[{ required: true, message: "Please select product" }]}
              >
                <Select
                  placeholder="Select product"
                  onChange={updateSubProduct}
                  options={productOption}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Radio.Group>
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>In-Active</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Title level={5} style={{ marginTop: 20 }}>
            BOM
          </Title>

          <Form.List name="productionMasterSubs">
            {(fields, { add, remove }) => (
              <>
                <div style={{ maxHeight: 180, overflowY: "auto" }}>
                  {fields.map(({ key, name, fieldKey, ...restField }) => {
                    // Extract avatar properties from form values
                    const avatarColor =
                      form.getFieldValue([
                        "productionMasterSubs",
                        name,
                        "avatarColor",
                      ]) || "#bfbfbd";
                    const avatarText =
                      form.getFieldValue([
                        "productionMasterSubs",
                        name,
                        "avatarText",
                      ]) || "D";

                    return (
                      <Flex gap="small" horizontal style={{ marginBottom: 8 }}>
                        <Form.Item noStyle>
                          <Avatar
                            shape="square"
                            size={32}
                            style={{
                              backgroundColor: avatarColor,
                            }}
                          >
                            {avatarText}
                          </Avatar>
                        </Form.Item>
                        <Form.Item
                          noStyle
                          {...restField}
                          name={[name, "materialId"]}
                          fieldKey={[fieldKey, "materialId"]}
                          label="Material ID"
                          rules={[
                            { required: true, message: "Missing material" },
                          ]}
                        >
                          <Select
                            placeholder="Select Product"
                            options={subProductOption}
                            onChange={(value) =>
                              handleMaterialChange(value, name)
                            }
                            style={{ width: "30%" }}
                          />
                        </Form.Item>

                        <Form.Item
                          noStyle
                          {...restField}
                          name={[name, "quantity"]}
                          fieldKey={[fieldKey, "quantity"]}
                          label="Quantity"
                          rules={[
                            { required: true, message: "Missing quantity" },
                          ]}
                        >
                          <InputNumber
                            min={1}
                            placeholder="Quantity"
                            style={{ width: "30%" }}
                          />
                        </Form.Item>

                        <Form.Item
                          noStyle
                          {...restField}
                          name={[name, "unit"]}
                          fieldKey={[fieldKey, "unit"]}
                          label="Unit"
                          rules={[{ required: true, message: "Missing unit" }]}
                        >
                          <Input placeholder="Unit" style={{ width: "30%" }} />
                        </Form.Item>

                        <Button
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                          style={{
                            backgroundColor: "rgba(255, 179, 179,0.6)",
                            // color: "#fff",
                          }}
                        />
                      </Flex>
                    );
                  })}
                </div>
                <Row
                  gutter={[10, 10]}
                  justify={"center"}
                  style={{ margin: "10px" }}
                >
                  <Col>
                    <Button type="dashed" onClick={() => add()}>
                      <PlusOutlined /> Add BOM
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Form>
      </Spin>
    </Popups>
  );
};

export default withForm(ProductionForm);
