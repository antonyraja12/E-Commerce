import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Spin,
  Typography,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import AssetService from "../../../services/asset-service";
import { MaterialService } from "../../../services/djc/material-service";
import { OperatorService } from "../../../services/djc/operator-service";
import { RoutingService } from "../../../services/djc/routing-service";
import Page from "../../../utils/page/page";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";

const { Title } = Typography;

const RoutingForm = (props) => {
  const { modal, form } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [productOption, setProductOption] = useState([]);
  const [materialOption, setMaterialOption] = useState([]);
  const [assetOption, setAssetOption] = useState([]);
  const [operatorOption, setOperatorOption] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const service = new RoutingService();
  const materialService = new MaterialService();
  const assetService = new AssetService();
  const operatorService = new OperatorService();

  useEffect(() => {
    fetchAllOptions();
  }, []);

  useEffect(() => {
    if (props.params?.id) {
      onRetrieve(props.params?.id);
    }
  }, [props.params?.id]);

  const fetchAllOptions = () => {
    setIsLoading(true);
    const productPromise = materialService.getProductionProduct({
      status: true,
    });
    const materialPromise = materialService.list({
      materialType: "Material",
      status: true,
    });
    const assetPromise = assetService.list({ status: true });
    const operatorPromise = operatorService.list({ status: true });

    Promise.all([
      productPromise,
      materialPromise,
      assetPromise,
      operatorPromise,
    ])
      .then(
        ([
          productResponse,
          materialResponse,
          assetResponse,
          operatorResponse,
        ]) => {
          setProductOption(
            productResponse.data?.map((e) => ({
              label: e.materialName,
              value: e.materialId,
              type: e.materialType,
            }))
          );
          setMaterialOption(
            materialResponse.data?.map((e) => ({
              label: e.materialName,
              value: e.materialId,
              type: e.materialType,
            }))
          );
          setAssetOption(
            assetResponse.data?.map((e) => ({
              label: e.assetName,
              value: e.assetId,
            }))
          );
          setOperatorOption(
            operatorResponse.data?.map((e) => ({
              label: e.operatorName,
              value: e.operatorId,
            }))
          );
        }
      )
      .catch((error) => {
        message.error("Failed to fetch data");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onRetrieve = async (id) => {
    setIsLoading(true);
    try {
      const response = await service.retrieve(id);
      patchForm(response.data);
    } catch (error) {
      message.error("Failed to fetch routing");
    } finally {
      setIsLoading(false);
    }
  };

  const patchForm = (data) => {
    form.setFieldsValue({ ...data });
  };

  const onFinish = async (value) => {
    let response;
    value = { ...value, finishedProductName: selectedProduct };
    if (props.params?.id) {
      response = await service.update(value, props.params?.id);
    } else {
      response = await service.save(value);
    }
    if (response.status === 200) {
      const action = props.params?.id ? "updated" : "added";
      message.success(`Routing ${action} successfully`);
    } else {
      message.error(`Something went wrong, Try again!`);
    }
    props.navigate("/djc/routing");
  };

  const handleSelectChange = (value) => {
    const selectedProduct = productOption.find(
      (product) => product.value === value
    );
    if (selectedProduct) {
      setSelectedProduct(selectedProduct.label);
    }
  };

  const handleAddRouting = (add) => {
    const routings = form.getFieldValue("routings") || [];
    const newSequenceNumber = routings.length ? routings.length + 1 : 1;
    add({ sequenceNumber: newSequenceNumber });
  };

  const handleRemoveRouting = (remove, index) => {
    remove(index);
    const routings = form.getFieldValue("routings") || [];
    const updatedRoutings = routings.map((item, idx) => ({
      ...item,
      sequenceNumber: idx + 1,
    }));
    form.setFieldsValue({ routings: updatedRoutings });
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const routings = form.getFieldValue("routings") || [];
    const [movedItem] = routings.splice(source.index, 1);
    routings.splice(destination.index, 0, movedItem);
    form.setFieldsValue({
      routings: routings.map((item, idx) => ({
        ...item,
        sequenceNumber: idx + 1,
      })),
    });
  };

  return (
    <Page title={`${props.mode} Routing`}>
      <Spin spinning={isLoading}>
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          labelAlign="left"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ status: true }}
          disabled={props.mode === "View"}
        >
          <Row gutter={[10, 10]}>
            <Col span={12}>
              <Row gutter={[10, 10]}>
                <Col span={12}>
                  <Form.Item
                    name="routingName"
                    label="Routing Name"
                    rules={[
                      { required: true, message: "Please enter routing name" },
                    ]}
                  >
                    <Input placeholder="Enter routing name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="finishedProductId"
                    label="Product"
                    rules={[
                      { required: true, message: "Please select product" },
                    ]}
                  >
                    <Select
                      placeholder="Select product"
                      options={productOption}
                      onChange={handleSelectChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                      { required: true, message: "Please enter description" },
                    ]}
                  >
                    <Input.TextArea placeholder="Enter description" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="status"
                    label="Status"
                    rules={[
                      { required: true, message: "Please select status" },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value={true}>Active</Radio>
                      <Radio value={false}>In-Active</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row gutter={[10, 10]}>
                <Col span={24}>
                  <Title level={5} style={{ marginTop: 10 }}>
                    Raw Material
                  </Title>
                </Col>
                <Col span={24}>
                  <Form.List name="rawMaterials">
                    {(fields, { add, remove }) => (
                      <>
                        <div style={{ maxHeight: 160, overflowY: "auto" }}>
                          {fields.map(
                            ({ key, name, fieldKey, ...restField }) => (
                              <Flex
                                gap="small"
                                horizontal
                                style={{ marginBottom: 8 }}
                                key={key}
                              >
                                <Form.Item
                                  noStyle
                                  {...restField}
                                  name={[name, "materialId"]}
                                  fieldKey={[fieldKey, "materialId"]}
                                  label="Material"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing material",
                                    },
                                  ]}
                                >
                                  <Select
                                    placeholder="Select Material"
                                    options={materialOption}
                                    style={{ width: "30%" }}
                                  />
                                </Form.Item>
                                <Form.Item
                                  noStyle
                                  {...restField}
                                  name={[name, "description"]}
                                  fieldKey={[fieldKey, "description"]}
                                  label="Description"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing description",
                                    },
                                  ]}
                                >
                                  <Input
                                    placeholder="Description"
                                    style={{ width: "30%" }}
                                  />
                                </Form.Item>
                                <Form.Item
                                  noStyle
                                  {...restField}
                                  name={[name, "uom"]}
                                  fieldKey={[fieldKey, "uom"]}
                                  label="UOM"
                                  rules={[
                                    { required: true, message: "Missing uom" },
                                  ]}
                                >
                                  <Input
                                    placeholder="UOM"
                                    style={{ width: "20%" }}
                                  />
                                </Form.Item>
                                <Form.Item
                                  noStyle
                                  {...restField}
                                  name={[name, "quantity"]}
                                  fieldKey={[fieldKey, "quantity"]}
                                  label="Quantity"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing quantity",
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    min={1}
                                    placeholder="Quantity"
                                    style={{ width: "20%" }}
                                  />
                                </Form.Item>
                                <Button
                                  icon={<DeleteOutlined />}
                                  onClick={() => remove(name)}
                                  style={{
                                    backgroundColor: "rgba(255, 179, 179,0.6)",
                                  }}
                                />
                              </Flex>
                            )
                          )}
                        </div>
                        <Row
                          gutter={[10, 10]}
                          justify={"center"}
                          style={{ margin: "10px" }}
                        >
                          <Col>
                            <Button type="dashed" onClick={() => add()}>
                              <PlusOutlined /> Add Raw Material
                            </Button>
                          </Col>
                        </Row>
                      </>
                    )}
                  </Form.List>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Title level={5} style={{ marginTop: 10 }}>
                Routing
              </Title>
            </Col>
            <Col span={24}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="routings">
                  {(provided) => (
                    // <div
                    //   ref={provided.innerRef}
                    //   {...provided.droppableProps}
                    //   style={
                    //     {
                    //       // maxHeight: 160,
                    //       //  overflowY: "auto"
                    //     }
                    //   }
                    // >
                    <Form.List name="routings">
                      {(fields, { add, remove }) => (
                        <>
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                              maxHeight: 160,
                              overflowY: "auto",
                            }}
                          >
                            {fields.map(
                              (
                                { key, name, fieldKey, ...restField },
                                index
                              ) => (
                                <Draggable
                                  key={key}
                                  draggableId={String(index)}
                                  index={index}
                                >
                                  {(provided) => (
                                    <Flex
                                      gap="small"
                                      horizontal={true}
                                      className="flex-routing"
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <Form.Item
                                        noStyle
                                        {...restField}
                                        name={[name, "sequenceNumber"]}
                                        fieldKey={[fieldKey, "sequenceNumber"]}
                                        label="SqNo"
                                        rules={[
                                          {
                                            required: true,
                                            message: "Missing sequence number",
                                          },
                                        ]}
                                      >
                                        <Input
                                          placeholder="SqNo"
                                          style={{ width: "10%" }}
                                          disabled
                                        />
                                      </Form.Item>
                                      <Form.Item
                                        noStyle
                                        {...restField}
                                        name={[name, "description"]}
                                        fieldKey={[fieldKey, "description"]}
                                        label="Description"
                                        rules={[
                                          {
                                            required: true,
                                            message: "Missing description",
                                          },
                                        ]}
                                      >
                                        <Input
                                          placeholder="Description"
                                          style={{ width: "20%" }}
                                        />
                                      </Form.Item>
                                      <Form.Item
                                        noStyle
                                        {...restField}
                                        name={[name, "assetId"]}
                                        fieldKey={[fieldKey, "assetId"]}
                                        label="Asset ID"
                                        rules={[
                                          {
                                            required: true,
                                            message: "Missing asset",
                                          },
                                        ]}
                                      >
                                        <Select
                                          placeholder="Select Asset"
                                          options={assetOption}
                                          style={{ width: "20%" }}
                                        />
                                      </Form.Item>
                                      <Form.Item
                                        noStyle
                                        {...restField}
                                        name={[name, "operatorId"]}
                                        fieldKey={[fieldKey, "operatorId"]}
                                        label="Operator ID"
                                        rules={[
                                          {
                                            required: true,
                                            message: "Missing operator",
                                          },
                                        ]}
                                      >
                                        <Select
                                          placeholder="Select Operator"
                                          options={operatorOption}
                                          style={{ width: "20%" }}
                                        />
                                      </Form.Item>
                                      <Form.Item
                                        noStyle
                                        {...restField}
                                        name={[name, "machineTime"]}
                                        fieldKey={[fieldKey, "machineTime"]}
                                        label="Machine Time"
                                        rules={[
                                          {
                                            required: true,
                                            message: "Missing machine time",
                                          },
                                        ]}
                                      >
                                        <InputNumber
                                          min={1}
                                          placeholder="Machine Time"
                                          style={{ width: "15%" }}
                                        />
                                      </Form.Item>
                                      <Form.Item
                                        noStyle
                                        {...restField}
                                        name={[name, "labourTime"]}
                                        fieldKey={[fieldKey, "labourTime"]}
                                        label="Labour Time"
                                        rules={[
                                          {
                                            required: true,
                                            message: "Missing labour time",
                                          },
                                        ]}
                                      >
                                        <InputNumber
                                          min={1}
                                          placeholder="Labour Time"
                                          style={{ width: "15%" }}
                                        />
                                      </Form.Item>
                                      <Button
                                        icon={<DeleteOutlined />}
                                        onClick={() =>
                                          handleRemoveRouting(remove, name)
                                        }
                                        style={{
                                          backgroundColor:
                                            "rgba(255, 179, 179,0.6)",
                                        }}
                                      />
                                    </Flex>
                                  )}
                                </Draggable>
                              )
                            )}
                          </div>
                          {provided.placeholder}
                          <Row
                            gutter={[10, 10]}
                            justify={"center"}
                            style={{ margin: "10px" }}
                          >
                            <Col>
                              <Button
                                type="dashed"
                                onClick={() => handleAddRouting(add)}
                              >
                                <PlusOutlined /> Add Routing
                              </Button>
                            </Col>
                          </Row>
                        </>
                      )}
                    </Form.List>
                    // </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Col>
          </Row>
          <Row justify="space-between" key="footer">
            <Col>
              <Button
                key="close"
                disabled={false}
                onClick={() => props.navigate("/djc/routing")}
              >
                {props.mode === "Add" || props.mode === "Update"
                  ? "Cancel"
                  : "Back"}
              </Button>
            </Col>
            <Col>
              {(props.mode === "Add" || props.mode === "Update") && (
                <Button key="submit" type="primary" htmlType="submit">
                  {props.mode === "Add" ? "Save" : "Update"}
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      </Spin>
    </Page>
  );
};

export default withForm(withRouter(RoutingForm));
