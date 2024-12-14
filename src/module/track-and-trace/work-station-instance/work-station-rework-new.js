import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Form,
  Input,
  message,
  Radio,
  Row,
  Segmented,
  Select,
  Spin,
  Table,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useWorkStationInstance } from "../../../hooks/useWorkStationInstance";
import "../work-station-instance/work-station-instance.css";
import WorkStationInstanceHeader from "./work-station-instance-header";
import WorkStationInstanceService from "../../../services/track-and-trace-service/work-station-instance-service";
import { useProductMaster } from "../../../hooks/useProductMaster";
import { BsThreeDots } from "react-icons/bs";
import ReworkCard from "./work-station-rework-card";
import { useWatch } from "antd/es/form/Form";

const WorkStationReworkNew = (props) => {
  const [disabled, setDisabled] = useState(false);
  const [isProductLoading, productList] = useProductMaster();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { id } = useParams();
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);
  const [messageShown, setMessageShown] = useState(false);

  const { data, step, jobOrder, property } = useWorkStationInstance({
    workStationId: id,
    autoRefresh: true,
  });
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
  useEffect(() => {
    const checkQcList = () => {
      if (data && data.properties && data.properties.qcList) {
        if (data.properties.qcList.length === 0 && !messageShown) {
          message.error("Seat Has No Rework Points", 10);
          setMessageShown(true);
        }
      } else {
        setMessageShown(false);
      }
    };

    if (data) {
      checkQcList();
    }
  }, [data, messageShown]);
  useMemo(() => {
    if (property.replacedParts?.length > 0) {
      form.setFieldValue("assemblyReworkSubs", property.replacedParts);
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
      if (index === data?.properties?.currentStep) str = "instance-active";
    }

    if (record.result === "OK") str += " success";
    else if (record.result === "NG") str += " failed";

    return str;
  };
  const onCell = () => ({
    style: { verticalAlign: "top" }, // Aligns cell content to the top
  });

  return (
    <div style={{ margin: "auto" }}>
      <Spin spinning={isLoading}>
        <Row gutter={[10, 10]} style={{ marginTop: "5px" }}>
          <Col span={24}>
            <WorkStationInstanceHeader {...{ data, jobOrder, property }} />
          </Col>

          <Col span={24}>
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
                  {data?.properties?.qcList?.map((e) => (
                    <Col lg={4}>
                      <ReworkCard {...e} />
                    </Col>
                  ))}
                </Row>
              </Col>

              <Col span={12}>
                <Form
                  form={form}
                  name="rework_form"
                  onFinish={onFinish}
                  autoComplete="off"
                  disabled={disabled}
                >
                  <Form.Item hidden name={"assemblyId"}>
                    <Input />
                  </Form.Item>
                  <Form.Item hidden name={"workStationId"}>
                    <Input />
                  </Form.Item>

                  <Form.List name="assemblyReworkSubs">
                    {(fields, { add, remove }) => (
                      <Table
                        title={() => (
                          <Typography.Text strong>
                            Assembled Parts
                          </Typography.Text>
                        )}
                        bordered
                        size="small"
                        dataSource={fields}
                        rowKey="key"
                        // rowSelection={{
                        //   type: "checkbox",
                        //   onChange: handleRowSelectionChange,
                        //   selectedRowKeys,
                        // }}
                        pagination={false}
                        // className="wi-steps wi-remove"
                        summary={() => (
                          <Table.Summary fixed={"bottom"}>
                            <Table.Summary.Row>
                              <Table.Summary.Cell
                                align="right"
                                index={0}
                                colSpan={4}
                              >
                                <Button type="primary" danger htmlType="submit">
                                  Pallet Release
                                </Button>
                              </Table.Summary.Cell>
                            </Table.Summary.Row>
                          </Table.Summary>
                        )}
                      >
                        <Table.Column
                          width={100}
                          onCell={onCell}
                          title="Product Code"
                          dataIndex="productCode"
                          key="productCode"
                          render={(text, record, index) => (
                            <>
                              <Form.Item
                                noStyle
                                name={[record.name, "productId"]}
                                key={[record.fieldKey, "productId"]}
                              >
                                <Select
                                  readonly
                                  variant="borderless"
                                  options={productList?.options}
                                />
                              </Form.Item>
                            </>
                          )}
                        />
                        <Table.Column
                          width={150}
                          onCell={onCell}
                          title="QR Code"
                          dataIndex="childPartCode"
                          key="qrCode"
                          render={(text, record, index) => (
                            <>
                              <Form.Item
                                hidden
                                name={[record.name, "qrCode"]}
                                key={[record.fieldKey, "qrCode"]}
                              >
                                <Input />
                              </Form.Item>
                              {form.getFieldValue([
                                "assemblyReworkSubs",
                                record.name,
                                "qrCode",
                              ])}
                            </>
                          )}
                        />
                        <Table.Column
                          width={150}
                          onCell={onCell}
                          title="Rework Status"
                          dataIndex="reworkStatus"
                          key="reworkStatus"
                          align="center"
                          render={(text, record, index) => (
                            <>
                              <Form.Item
                                noStyle
                                name={[record.name, "reworkStatus"]}
                                key={[record.fieldKey, "reworkStatus"]}
                                label="Status"
                                rules={[
                                  {
                                    required: true,
                                  },
                                ]}
                              >
                                <Radio.Group
                                  optionType="button"
                                  size="small"
                                  // style={{ paddingTop: "10%" }}
                                >
                                  <Radio value={"Scrap"}>Scrap</Radio>
                                  <Radio value={"Reuse"}>Reuse</Radio>
                                </Radio.Group>
                              </Form.Item>
                            </>
                          )}
                        />
                        <Table.Column
                          onCell={onCell}
                          title="Remark"
                          dataIndex="remarks"
                          key="remarks"
                          align="center"
                          render={(text, record, index) => (
                            <Form.Item
                              noStyle
                              label="Remark"
                              name={[record.name, "remarks"]}
                              key={[record.fieldKey, "remarks"]}
                              rules={[
                                {
                                  required: true,
                                  // message: "Enter remarks",
                                },
                              ]}
                            >
                              <Input.TextArea rows={2} placeholder="Remark" />
                            </Form.Item>
                          )}
                        />
                      </Table>
                    )}
                  </Form.List>
                </Form>
              </Col>
              <Col span={12}>
                <Table
                  title={() => (
                    <Typography.Text strong>
                      Parts Replaced With{" "}
                    </Typography.Text>
                  )}
                  size="small"
                  columns={[
                    {
                      dataIndex: "productName",
                      title: "Product Name",
                      key: "productName",
                    },
                    {
                      dataIndex: "childPartCode",
                      title: "QR Code",
                      key: "childPartCode",
                    },
                  ]}
                  dataSource={property?.childPartList}
                  pagination={false}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default WorkStationReworkNew;
