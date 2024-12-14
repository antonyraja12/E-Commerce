import {
  Button,
  Card,
  Col,
  Collapse,
  Descriptions,
  Divider,
  Flex,
  Form,
  Input,
  Row,
  Table,
  Tabs,
  Timeline,
  Typography,
} from "antd";
import React, { useMemo, useState } from "react";
import { dateTimeFormat } from "../../../helpers/url";
import TatReportService from "../../../services/track-and-trace-service/tat-report-service";
import dayjs from "dayjs";
import "./traceability.css";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import { FileDownload } from "./pdf-generator-new";
import { downloadPdf } from "./pdf-generator";

const Traceability = (props) => {
  const [form] = Form.useForm();
  const date = new Date();
  const [data, setData] = useState(null);
  const [childPartTrack, setChildPartTrack] = useState(null);
  const [pdfButton, setPdfButton] = useState(false);

  const [loading, setLoading] = useState(false);

  const getData = (value) => {
    setLoading(true);
    const service = new TatReportService();
    Promise.all([
      service.traceability(value),
      service.getChildPartTracking(value),
    ])
      .then(([res1, res2]) => {
        setData(res1.data);
        setChildPartTrack(res2.data);
        setPdfButton(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const calcCycleTime = (start, end, unit = "s") => {
    let endTime = end ? dayjs(end) : dayjs();
    let startTime = dayjs(start);
    const difference = endTime.diff(startTime, unit);
    return Math.max(difference, 0);
  };

  const modelDetail = useMemo(() => {
    if (data) {
      return [
        {
          key: "productCode",
          label: "Product Code",
          children: data.productCode,
        },
        {
          key: "model",
          label: "Model",
          children: data.model,
        },
        {
          key: "variant",
          label: "Variant",
          children: data.variant,
        },
        {
          key: "category",
          label: "Seat Type",
          children: data.category,
        },
        {
          key: "buildLabel",
          label: "Build Label",
          children: data.buildLabel,
        },
        {
          key: "start",
          label: "Start Date",
          children: dateTimeFormat(data.start),
        },
        {
          key: "end",
          label: "End Date",
          children: dateTimeFormat(data.end),
        },
        {
          key: "cyc",
          label: "Cycle time ",
          children: calcCycleTime(data.start, data.end, "m") + "m",
        },
      ];
    }
    return [];
  }, [data]);

  const column = [
    {
      dataIndex: "sequenceNumber",
      title: "Seq.No.",
      width: 80,
      render: (value) => {
        return value;
      },
    },
    {
      dataIndex: "description",
      title: "Description",
    },
    {
      width: 150,
      dataIndex: "value",
      title: "Expected Value",
    },
    {
      width: 150,
      dataIndex: "value",
      title: "Value",
    },
    {
      width: 100,
      dataIndex: "result",
      title: "Result",
      align: "center",
    },
  ];
  const qualityColumn = [
    {
      dataIndex: "defectName",
      title: "Defect Name",
    },
    // {
    //   dataIndex: "cycleNumber",
    //   title: "Cycle Number",
    // },
    {
      dataIndex: "qualityResult",
      title: "Result",
      render: (value) => {
        return "NG";
      },
    },
  ];

  const qualityResultColumn = [
    {
      dataIndex: "assemblyQuality",
      title: "Defect Name",
      render: (value) => {
        return value?.defectName;
      },
    },
    {
      dataIndex: "defectStatus",
      title: "Result",
    },
  ];
  const reworkColumn = [
    {
      dataIndex: "qrCode",
      title: "QR.Code",
    },
    {
      dataIndex: "reworkStatus",
      title: "Rework Status",
    },
    {
      dataIndex: "remarks",
      title: "Remarks",
    },
  ];

  const childPartColumns = [
    {
      key: "sno",
      title: "S.No.",
      render: (val, row, index) => {
        return index + 1;
      },
    },
    // {
    //   dataIndex: "productName",
    //   title: "Name",
    // },
    // {
    //   dataIndex: "productCode",
    //   title: "Code",
    // },
    {
      dataIndex: "childPartCode",
      title: "Qr Code",
    },
  ];

  const pdfDownload = () => {
    downloadPdf({
      title: "Traceability Report",
      data: data,
      childPartData: childPartTrack,
    });
  };

  const ProductPage = () => {
    return (
      <>
        <Row gutter={[10, 10]}>
          <Col span={24}>
            <Form
              size="large"
              colon={false}
              layout="vertical"
              onFinish={getData}
              form={form}
            >
              <Row gutter={[10, 10]} justify="center">
                <Col span={8}>
                  <Form.Item
                    label="Enter Code"
                    name="code"
                    noStyle
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input.Search
                      loading={loading}
                      style={{ width: "100%" }}
                      onSearch={() => {
                        form.submit();
                      }}
                      placeholder="Enter Build Label"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={24}>
            <Descriptions
              size="small"
              colon={false}
              layout="horizontal"
              items={modelDetail}
              column={4}
              bordered
            />
          </Col>
          {/* <Col span={24}>
            <Typography.Title level={5}>Summary</Typography.Title>
            <Table
              size="small"
              bordered
              rowKey="assemblyDetailId"
              dataSource={data?.assemblyDetailSubs ?? []}
              columns={dataColumn}
              pagination={false}
              expandable={{
                // defaultExpandAllRows: true,
                expandedRowRender: (record) => (
                  <Row>
                    <Col sm={24} md={12} lg={12} xl={12}>
                      <Card
                        title="Steps"
                        size="small"
                        styles={{ body: { padding: 5 } }}
                      >
                        <Table
                          size="small"
                          bordered
                          dataSource={record?.assemblyDetailSubs}
                          pagination={false}
                          columns={column}
                        />
                      </Card>
                    </Col>
                    {record?.assemblyQualitySubs.length > 0 && (
                      <Col sm={24} md={12} lg={12} xl={12}>
                        <Card
                          title="Defects"
                          size="small"
                          styles={{ body: { padding: 5 } }}
                        >
                          <Table
                            size="small"
                            bordered
                            dataSource={record?.assemblyQualitySubs}
                            pagination={false}
                            columns={qualityColumn}
                          />
                        </Card>
                      </Col>
                    )}
                    {record?.assemblyReworkSubs.length > 0 && (
                      <Col sm={24} md={12} lg={12} xl={12}>
                        <Card
                          title="Rework"
                          size="small"
                          styles={{ body: { padding: 5 } }}
                        >
                          <Table
                            size="small"
                            bordered
                            dataSource={record?.assemblyReworkSubs}
                            pagination={false}
                            columns={reworkColumn}
                          />
                        </Card>
                      </Col>
                    )}
                  </Row>
                ),
              }}
            />
          </Col> */}
          <Col sm={24} md={8} lg={8} xl={8}>
            <Divider orientation="left" type="horizontal">
              Child Part
            </Divider>

            <Table
              size="small"
              bordered
              dataSource={data?.childParts}
              pagination={false}
              columns={childPartColumns}
            />
          </Col>
          <Col sm={24} md={16} lg={16} xl={16}>
            <Divider orientation="left" type="horizontal">
              Summary
            </Divider>

            <Timeline
              // className="custom-timeline"
              mode="left"
              items={data?.assemblyDetails
                ?.sort((a, b) => new Date(a.start) - new Date(b.start))
                ?.map((e) => ({
                  children: (
                    <Collapse size="small" bordered={false}>
                      <Collapse.Panel
                        showArrow
                        collapsible={true}
                        header={
                          <>
                            <Flex gap={10} align="baseline">
                              <Typography.Title level={5}>
                                {e.workStationName}
                              </Typography.Title>
                              <Typography.Text type="secondary">
                                {e.wsType ?? "Buffer"}
                              </Typography.Text>
                            </Flex>
                            <Row gutter={10}>
                              <Col span={24}>
                                <Descriptions
                                  size="small"
                                  colon={false}
                                  layout="vertical"
                                  column={4}
                                >
                                  {/* <Descriptions.Item label="Station">
                                  <Flex gap={10} align="baseline">
                                    <Typography.Title level={5}>
                                      {e.workStationName}
                                    </Typography.Title>
                                    <Typography.Text type="secondary">
                                      {e.wsType ?? "Buffer"}
                                    </Typography.Text>
                                  </Flex>
                                </Descriptions.Item> */}
                                  <Descriptions.Item label="Got in time">
                                    {dayjs(e.start).format(
                                      "DD-MM-YYYY hh:mm A"
                                    )}
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Released time">
                                    {e.end
                                      ? dayjs(e.end).format(
                                          "DD-MM-YYYY hh:mm A"
                                        )
                                      : dayjs().format("DD-MM-YYYY hh:mm A")}
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Operator">
                                    {e.operatorName ?? "Unknown"}
                                  </Descriptions.Item>

                                  <Descriptions.Item label="Cycle time (s)">
                                    {calcCycleTime(e.start, e.end)}
                                  </Descriptions.Item>
                                </Descriptions>
                              </Col>
                            </Row>
                          </>
                        }
                      >
                        <Row gutter={[10, 10]}>
                          <Col span={24}>
                            <Card
                              title="Steps"
                              size="small"
                              bordered={false}
                              styles={{ body: { padding: 5 } }}
                            >
                              <Table
                                size="small"
                                bordere
                                dataSource={e?.assemblyDetailSubs?.sort(
                                  (a, b) =>
                                    Number(a.sequenceNumber) -
                                    Number(b.sequenceNumber)
                                )}
                                pagination={false}
                                columns={column}
                              />
                            </Card>
                          </Col>
                          {e?.assemblyQualitySubs.length > 0 && (
                            <Col span={24}>
                              <Card
                                bordered={false}
                                title="Defects"
                                size="small"
                                styles={{ body: { padding: 5 } }}
                              >
                                <Table
                                  size="small"
                                  bordered
                                  dataSource={e?.assemblyQualitySubs}
                                  pagination={false}
                                  columns={qualityColumn}
                                />
                              </Card>
                            </Col>
                          )}
                          {e?.assemblyQualityResult.length > 0 && (
                            <Col span={24}>
                              <Card
                                bordered={false}
                                title="Defects"
                                size="small"
                                styles={{ body: { padding: 5 } }}
                              >
                                <Table
                                  size="small"
                                  bordered
                                  dataSource={e?.assemblyQualityResult}
                                  pagination={false}
                                  columns={qualityResultColumn}
                                />
                              </Card>
                            </Col>
                          )}
                          {e?.assemblyReworkSubs.length > 0 && (
                            <Col span={24}>
                              <Card
                                title="Rework"
                                size="small"
                                styles={{ body: { padding: 5 } }}
                                bordered={false}
                              >
                                <Table
                                  size="small"
                                  bordered
                                  dataSource={e?.assemblyReworkSubs}
                                  pagination={false}
                                  columns={reworkColumn}
                                />
                              </Card>
                            </Col>
                          )}
                        </Row>
                      </Collapse.Panel>
                    </Collapse>
                  ),
                }))}
            />
          </Col>
        </Row>
      </>
    );
  };
  const items = [
    {
      key: "1",
      label: "Product",
      children: <ProductPage />,
    },
  ];

  return (
    <Card
    //title={"Traceability"}
    >
      <Tabs
        tabBarExtraContent={
          <Button
            icon={<DownloadOutlined />}
            disabled={!pdfButton}
            onClick={pdfDownload}
          >
            Download
          </Button>
        }
        defaultActiveKey="1"
        items={items}
      />
    </Card>
  );
};
export default Traceability;
