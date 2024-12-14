import {
  Button,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Tag,
  Flex,
  Spin,
  Table,
  Alert,
  Modal,
  Space,
  Card,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useWorkStationInstance } from "../../../hooks/useWorkStationInstance";
import "../work-station-instance/work-station-instance.css";
import WorkStationInstanceHeader from "./work-station-instance-header";
import WorkStationInstanceService from "../../../services/track-and-trace-service/work-station-instance-service";
import { useProductMaster } from "../../../hooks/useProductMaster";
import ReworkCard from "./work-station-rework-card";
import ChangeBom from "./change-bom";

const WorkStationRework = (props) => {
  const [changeBOM, setChangeBOM] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [isProductLoading, productList] = useProductMaster();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { id } = useParams();
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);
  const { data, step, jobOrder, property, connection } = useWorkStationInstance(
    {
      workStationId: id,
      autoRefresh: true,
    }
  );
  const title = "Rework station";

  const columns = [
    {
      dataIndex: "sequenceNumber",
      key: "sequenceNumber",
      title: "Seq.No",
      width: 80,
      // align: "center",
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",

      // align: "center",
    },
    {
      dataIndex: "value",
      key: "value",
      title: "Value",
      width: 200,
      // align: "center",
    },
    {
      dataIndex: "result",
      key: "result",
      title: "Result",
      width: 100,
      // align: "center",
    },
  ];

  useEffect(() => {
    if (property && !form.isFieldsTouched()) {
      // patchForm(property);
    }
  }, [property]);

  useMemo(() => {
    if (property.replacedParts?.length > 0) {
      // form.setFieldValue("assemblyReworkSubs", property.replacedParts);
      setDisabled(false);
    } else {
      setDisabled(false);
      const ar = form.getFieldValue("assemblyReworkSubs");
      const removedParts =
        typeof property?.removedParts == "string"
          ? JSON.parse(property?.removedParts)
          : property?.removedParts;
      if (removedParts?.length != ar?.length) {
        form.setFieldsValue({
          workStationId: id,
          assemblyId: property?.assemblyId,
          assemblyReworkSubs: property?.removedParts
            ? JSON.parse(property?.removedParts)?.map((e) => ({
                productName: e.productName,
                productCode: e.productCode,
                productId: e.productId,
                qrCode: e.qrCode,
                reworkStatus: null,
                remarks: null,
              }))
            : [],
        });
      }
    }
  }, [property]);

  const patchForm = (value) => {
    form.setFieldsValue({
      ...value,
      // assemblyReworkSubs: value?.childPartList.map((item) => ({
      //   ...item,
      //   reworkStatus: "Scrap",
      // })),
    });
  };

  const handleRowSelectionChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  const onFinish = (value) => {
    const service = new WorkStationInstanceService();
    setLoading(true);
    service
      .callService(id, "removeSubmit", {
        value: value.assemblyReworkSubs
          ? value.assemblyReworkSubs?.map((e) => ({
              productId: e.productId,
              qrCode: e.qrCode,
              reworkStatus: e.reworkStatus,
              remarks: e.remarks,
            }))
          : [],
      })
      .then(({ data }) => {})
      .finally(() => {
        setLoading(false);
      });
  };
  const getRowClassName = (record, index) => {
    let str = "";
    if (!record.result) {
      if (index === data?.properties?.currentStep) str = "active";
    }

    if (record.result === "OK") str += " success";
    else if (record.result === "NG") str += " failed";

    return str;
  };

  const parseData = (data) => {
    if (data) {
      return JSON.parse(data);
    }
    return [];
  };

  const onRemoveItem = (value) => {
    const service = new WorkStationInstanceService();
    service
      .callService(id, "removePart", { value })
      .then(({ data }) => {})
      .finally(() => {});
  };

  const modalOpen = useMemo(() => {
    const removedParts = parseData(property.removedParts);
    if (parseData(property.removedParts).length != 0) {
      form.setFieldsValue({
        productName: removedParts[0].productCode,
        productId: removedParts[0].productId,
        qrCode: removedParts[0].qrCode,
      });
      return true;
    }
    return false;
  }, [property]);
  const clearRemoveParts = () => {
    const service = new WorkStationInstanceService();
    service
      .callService(id, "clearRemovePart", {})
      .then(({ data }) => {})
      .finally(() => {});
  };
  const completeService = () => {
    const service = new WorkStationInstanceService();
    service
      .callService(id, "completed", { value: true })
      .then(({ data }) => {})
      .finally(() => {});
  };

  const openChangeBOMPanal = (value) => {};

  return (
    <div style={{ margin: "0 auto 70px", padding: "10px" }}>
      <WorkStationInstanceHeader {...{ data, jobOrder, property }} />
      <Spin spinning={isLoading}>
        <Row gutter={[10, 10]}>
          <Col span={24}>
            <Table
              rowKey="sequenceNumber"
              columns={columns}
              dataSource={step ?? []}
              bordered
              size="small"
              pagination={false}
              rowClassName={getRowClassName}
            />
          </Col>

          <Col span={24}>
            <Row gutter={[10, 10]}>
              {parseData(property?.qcList)
                ?.sort((a, b) => a.defectName?.localeCompare(b.defectName))
                ?.map((e) => (
                  <Col lg={4}>
                    <ReworkCard {...e} />
                  </Col>
                ))}
            </Row>
          </Col>
          <Col lg={12}></Col>
        </Row>
        <Card
          style={{ position: "fixed", bottom: 10, right: 10, zIndex: 99 }}
          size="small"
        >
          <Space>
            <Button
              color="default"
              variant="solid"
              onClick={() => setChangeBOM(true)}
            >
              Change BOM
            </Button>
            <Button type="primary" danger>
              Dismantle
            </Button>

            <Button type="primary" onClick={completeService}>
              Save
            </Button>
          </Space>
        </Card>
        {/* <Col span={24}> */}
        {property?.errorMessage && (
          <Alert
            style={{
              width: "100%",
              position: "fixed",
              bottom: 0,
              zIndex: 98,
            }}
            className="blink-section"
            type="error"
            message={property.errorMessage}
          />
        )}
        <Flex style={{ position: "fixed", bottom: 10, left: 20 }}>
          {connection?.map((e) => (
            <Tag color={e.connected ? "green" : "red"}>{e.device}</Tag>
          ))}
        </Flex>
        {/* </Col> */}
        <Modal
          open={modalOpen}
          title="Remove Item"
          okText="Submit"
          cancelText="Cancel"
          okButtonProps={{
            autoFocus: true,
            htmlType: "submit",
          }}
          onCancel={() => clearRemoveParts()}
          destroyOnClose
          modalRender={(dom) => (
            <Form
              layout="vertical"
              form={form}
              name="form_in_modal"
              // initialValues={}
              clearOnDestroy
              onFinish={(values) => onRemoveItem(values)}
            >
              {dom}
            </Form>
          )}
        >
          <Form.Item hidden name={"productId"}>
            <Input />
          </Form.Item>
          <Form.Item label="Name" name="productName">
            <Input />
          </Form.Item>
          <Form.Item label="Code" name="qrCode">
            <Input />
          </Form.Item>
          <Form.Item
            name="reworkStatus"
            label="Status"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Radio.Group
              // optionType="button"
              size="small"
              // style={{ paddingTop: "10%" }}
            >
              <Radio value={"Reusable"}>Reusable</Radio>
              <Radio value={"Scrap"}>Scrap</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Remark"
            name={"remarks"}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea rows={2} placeholder="Remark" />
          </Form.Item>
        </Modal>
      </Spin>
      <Modal
        width={1100}
        open={changeBOM}
        title="Remove Item"
        okText="Submit"
        cancelText="Cancel"
        footer={null}
        onCancel={() => setChangeBOM(false)}
      >
        <ChangeBom property={property} />
      </Modal>
    </div>
  );
};

export default WorkStationRework;
