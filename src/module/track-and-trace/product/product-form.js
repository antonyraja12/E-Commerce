import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import ProductService from "../../../services/track-and-trace-service/product-service";
import { useCategoryModelVariant } from "../../../hooks/useCategoryModelVariant";

const ProductForm = (props) => {
  const [form] = Form.useForm();
  const type = Form.useWatch("type", form);
  const { open, mode, title, onClose, disabled } = props;

  const [product, setProduct] = useState([]);

  const [imageList, setImageList] = useState([]);
  const [isProductLoading, data] = useCategoryModelVariant();

  const productService = new ProductService();
  useEffect(() => {
    if (open) fetchProduct();
    if (props.id) {
      patchForm(props.id);
    }
  }, [open, props.id]);

  const patchForm = (id) => {
    productService.retrieve(id).then(({ data }) => {
      form.setFieldsValue({
        ...data,
      });
    });
  };

  const fetchProduct = async () => {
    try {
      const response = await productService.list({
        status: true,
        type: "CHILD",
      });
      setProduct(
        response.data?.map((e) => ({
          label: e.code,
          value: e.code,
        }))
      );
    } catch (error) {
      message.error("Failed to fetch product");
    }
  };
  const closePopup = () => {
    setImageList([]);
    onClose();
  };

  const onFinish = (values) => {
    const response = props.id
      ? productService.update(values, props.id)
      : productService.add(values);

    response
      .then((res) => {
        if (res.status == 200) {
          message.success("Saved successfully");
          closePopup();
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  return (
    <Modal
      title={title}
      okText={mode === "Add" ? "Save" : "Update"}
      footer={
        mode === "View"
          ? false
          : [
              <Button key="cancel" onClick={closePopup}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" htmlType="submit">
                {mode === "Add" ? "Save" : "Update"}
              </Button>,
            ]
      }
      cancelText="Cancel"
      okButtonProps={{
        htmlType: "submit",
      }}
      open={open}
      width={780}
      destroyOnClose
      onCancel={closePopup}
      modalRender={(dom) => (
        <Form
          labelAlign="left"
          layout="horizontal"
          form={form}
          name="form_in_modal"
          disabled={disabled}
          clearOnDestroy
          onFinish={onFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            type: "CHILD",
            status: true,
          }}
        >
          {dom}
        </Form>
      )}
    >
      <Form.Item
        name="productName"
        label="Product Name"
        rules={[{ required: true, message: `Please enter product name` }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Type"
        name="type"
        rules={[{ required: true, message: `Please select type` }]}
      >
        <Radio.Group
          buttonStyle="solid"
          optionType="button"
          options={[
            { label: "PARENT", value: "PARENT" },
            { label: "CHILD", value: "CHILD" },
          ]}
        />
      </Form.Item>
      <Form.Item
        name="code"
        label="Code"
        wrapperCol={{ span: 10 }}
        rules={[{ required: true, message: `Please enter code` }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: `Please select status` }]}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      {type === "PARENT" && (
        <>
          <Divider />

          <Row gutter={[10, 10]}>
            <Col lg={12}>
              <Form.Item
                name="modelId"
                label="Model"
                rules={[{ required: true, message: `Please select model` }]}
              >
                <Select
                  options={data?.modelOptions}
                  // loading={isWsLoading}
                  showSearch
                />
              </Form.Item>
              <Form.Item
                name="variantId"
                label="Variant"
                rules={[{ required: true, message: `Please select variant` }]}
              >
                <Select
                  options={data?.variantOptions}
                  // loading={isWsLoading}
                  showSearch
                />
              </Form.Item>
              <Form.Item
                name="categoryId"
                label="Category"
                rules={[{ required: true, message: `Please enter category` }]}
              >
                <Select
                  options={data?.categoryOptions}
                  // loading={isWsLoading}
                  showSearch
                />
              </Form.Item>
              <Form.Item
                name="cycleTime"
                label="Cycle Time"
                // rules={[{ required: true, message: `Please enter cycle time` }]}
              >
                <InputNumber min={1} />
              </Form.Item>
            </Col>
            <Col lg={12}>
              <>
                <Form.List name="productChildMapping">
                  {(fields, { add, remove }) => (
                    <Table
                      size="small"
                      bordered
                      summary={() => (
                        <Table.Summary.Row>
                          <Table.Summary.Cell colSpan={3} align="center">
                            <Button
                              type="dashed"
                              onClick={() => add({ quantity: 1 })}
                              icon={<PlusOutlined />}
                            >
                              Add
                            </Button>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      )}
                      pagination={false}
                      dataSource={fields}
                      columns={[
                        {
                          title: "Part Code",
                          dataIndex: "code",
                          render: (val, _, index) => (
                            <Form.Item
                              noStyle
                              name={[_.name, "code"]}
                              label="Product Code"
                              rules={[
                                {
                                  required: true,
                                  message: "Please select a product",
                                },
                              ]}
                            >
                              <AutoComplete
                                options={product.map((item) => ({
                                  value: item.value,
                                }))}
                                style={{ width: "100%" }}
                                filterOption={(inputValue, option) =>
                                  option.value
                                    ?.toLowerCase()
                                    .includes(inputValue.toLowerCase())
                                }
                              />
                            </Form.Item>
                          ),
                        },
                        {
                          width: 50,
                          title: "Quantity",
                          dataIndex: "quantity",
                          render: (val, _, index) => (
                            <Form.Item
                              noStyle
                              label="Quantity"
                              name={[_.name, "quantity"]}
                              rules={[
                                {
                                  required: true,
                                  min: 1,
                                  type: "number",
                                },
                              ]}
                            >
                              <InputNumber min={1} style={{ width: "100%" }} />
                            </Form.Item>
                          ),
                        },
                        {
                          width: 50,
                          title: "",
                          dataIndex: "code",
                          render: (val, _, index) => (
                            <Button
                              icon={<CloseOutlined />}
                              onClick={() => remove(_.name)}
                              type="text"
                              danger
                            />
                          ),
                        },
                      ]}
                    />
                  )}
                </Form.List>
              </>
            </Col>
          </Row>
        </>
      )}
    </Modal>
  );
};
export default ProductForm;
