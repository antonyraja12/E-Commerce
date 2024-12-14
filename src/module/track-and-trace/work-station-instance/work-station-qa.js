import {
  Button,
  Card,
  Alert,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Flex,
  Tag,
  Table,
  Space,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDefectCheckList } from "../../../hooks/useDefectCheckList";
import { useWorkStationInstance } from "../../../hooks/useWorkStationInstance";
import "../work-station-instance/work-station-instance.css";
import WorkStationInstanceHeader from "./work-station-instance-header";
import WorkStationInstanceService from "../../../services/track-and-trace-service/work-station-instance-service";

const WorkStationQA = (props) => {
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const columns = [
    {
      dataIndex: "sequenceNumber",
      key: "sequenceNumber",
      title: "Seq.No",
      width: 80,
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
    },
    {
      dataIndex: "deviceType",
      key: "deviceType",
      title: "Type",
      width: 200,
    },
    {
      dataIndex: "value",
      key: "value",
      title: "Value",
      width: 200,
    },

    {
      dataIndex: "result",
      key: "result",
      title: "Result",
      width: 200,
      align: "center",
      render: (value, record, index) => {
        if (
          property?.currentStep == index &&
          record.deviceType?.toLowerCase() == "visual inspection"
        ) {
          return (
            <Button
              type="primary"
              htmlType="submit"
              size="small"
              onClick={() => form.submit()}
            >
              Save & Continue
            </Button>
          );
        }
        return value;
      },
    },
  ];

  const torqueColumn = [
    {
      dataIndex: "description",
      title: "Seq.No",
      width: 80,
      render: (value, row, index) => {
        return index + 1;
      },
    },
    {
      dataIndex: "description",
      title: "Description",
    },
    {
      dataIndex: "expectedValue",
      title: "Expected",
      width: 100,
    },
    {
      dataIndex: "tolerance",
      title: "Tolerance",
      width: 100,
    },
    {
      dataIndex: "value",
      title: "Value",
      width: 100,
    },
    {
      dataIndex: "result",
      title: "Result",
      width: 80,
    },
  ];

  const { id } = useParams();
  const { data, step, jobOrder, property, connection } = useWorkStationInstance(
    {
      workStationId: id,
      autoRefresh: true,
    }
  );

  useEffect(() => {
    if (data?.properties?.currentStep !== undefined && step?.length > 0) {
      const currentStepIndex = data.properties.currentStep;

      if (step[currentStepIndex]?.deviceType) {
        const typeCheck =
          step[currentStepIndex].deviceType.toLowerCase() ===
            "visual inspection" ||
          step[currentStepIndex].deviceType.toLowerCase() === "torque list";
        setExpandedRowKeys([step[currentStepIndex].sequenceNumber]);
      } else {
        setExpandedRowKeys([]);
      }
    } else {
      setExpandedRowKeys([]);
    }
  }, [data?.properties?.currentStep, step]);

  const getRowClassName = (record, index) => {
    let str = "";
    if (!record.result) {
      if (index === data?.properties?.currentStep) str = "active";
    }

    if (record.result === "OK") str += " success";
    else if (record.result === "NG") str += " failed";
    else if (["BYPASSED", "SKIPPED"].includes(record.result)) str += " bypass";

    return str;
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const torqueList = useMemo(() => {
    if (property?.torqueList) return JSON.parse(property?.torqueList);
    else return [];
  }, [property]);

  const defectList = useMemo(() => {
    if (property?.defectList) {
      const data = JSON.parse(property?.defectList);
      return data?.sort((a, b) => a.defectSequence - b.defectSequence);
    }
    return [];
  }, [property?.defectList]);

  const reworked = useMemo(() => {
    for (let x of defectList) {
      if (x.count > 0) return true;
    }
    return false;
  }, [defectList]);

  const handlePanel = () => {
    const service = new WorkStationInstanceService();
    service.callService(data?.workStationId, "moveEmptyPallet");
  };
  return (
    <div style={{ margin: "0 auto 70px", padding: "10px" }}>
      <WorkStationInstanceHeader {...{ data, jobOrder, property }} />
      <Row gutter={[10, 10]}>
        <Col span={24}>
          <Table
            rowKey="sequenceNumber"
            columns={columns}
            dataSource={step ?? []}
            // bordered
            size="small"
            pagination={false}
            rowClassName={getRowClassName}
            expandable={{
              showExpandColumn: false,
              expandedRowKeys: expandedRowKeys,
              rowExpandable: (record) =>
                record?.deviceType?.toLowerCase() === "visual inspection",
              expandedRowRender: (record) => {
                if (record?.deviceType?.toLowerCase() === "visual inspection") {
                  return <DefectList form={form} data={defectList} />;
                }

                return <></>;
              },
            }}
          />
        </Col>

        <Col lg={12} md={16} sm={24}>
          <Card size="small" title="Torque Data">
            <Table
              columns={torqueColumn}
              dataSource={torqueList}
              bordered
              size="small"
              pagination={false}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
      {property?.errorMessage && (
        <Alert
          style={{ width: "100%", position: "fixed", bottom: 0, zIndex: 998 }}
          className="blink-section"
          type="error"
          message={property.errorMessage}
        />
      )}
      <Flex style={{ position: "fixed", bottom: 10, left: 20, zIndex: 999 }}>
        {connection?.map((e) => (
          <Tag color={e.connected ? "green" : "red"}>{e.device}</Tag>
        ))}
      </Flex>
      {reworked && (
        <div
          style={{
            position: "fixed",
            top: 10,
            right: "50%",
            zIndex: 99,
            transform: "translate(50%, 0px)",
          }}
        >
          <Alert
            showIcon
            message="Reworked Part"
            type="warning"
            // className="blink-section"
          />
        </div>
      )}

      <Card
        style={{ position: "fixed", bottom: 10, right: 10, zIndex: 99 }}
        size="small"
      >
        <Space>
          <Button color="default" variant="solid" onClick={handlePanel}>
            Pallet Release
          </Button>
        </Space>
      </Card>
    </div>
  );
};

function DefectList({ form, data }) {
  const { id } = useParams();
  // const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // let localObj = JSON.parse(localStorage.getItem("defectformTmp"));
    // if (localObj) form.setFieldsValue(localObj);
    // else {
    form.setFieldsValue({
      defects:
        data
          ?.filter((e) => e.defectType == "VISUAL_INSPECTION")
          .map((e) => ({
            defectSequence: e.defectSequence,
            defectName: e.defectName,
            defectId: e.defectId,
            count: e.count,
            status: true,
          })) ?? [],
    });
    // }
  }, [data]);

  const onValuesChange = (changedValues, allValues) => {
    localStorage.setItem("defectformTmp", JSON.stringify(allValues));
  };

  const onFinish = (value) => {
    setLoading(true);
    const service = new WorkStationInstanceService();
    const submittedValue = value?.defects?.filter((e) => !e.status);
    service
      .callService(id, "saveDefects", {
        value: submittedValue?.map((e) => ({
          defectId: e.defectId,
          defectName: e.defectName,
        })),
      })
      .finally(() => {
        localStorage.removeItem("defectformTmp");
        setLoading(false);
      });
  };
  const defectColumn = [
    {
      dataIndex: "defectSequence",
      key: "defectSequence",
      title: "Seq.No",
      width: 80,
      render: (val, _, index) => (
        <Form.Item noStyle name={[_.name, "defectSequence"]}>
          <Input variant="borderless" readOnly />
        </Form.Item>
      ),
      // align: "center",
    },
    {
      dataIndex: "defectName",
      title: "Description",
      render: (val, _, index) => (
        <Form.Item noStyle name={[_.name, "defectName"]}>
          <Input variant="borderless" readOnly />
        </Form.Item>
      ),
    },
    {
      title: "Count",
      dataIndex: "count",
      align: "center",
      width: 80,
      render: (value, _, index) => (
        <Form.Item noStyle name={[_.name, "count"]}>
          <Input variant="borderless" readOnly />
        </Form.Item>
      ),
    },
    {
      title: "Status", // Last column for checkbox
      key: "defectId",
      align: "center",
      width: 80,
      render: (value, _, index) => (
        <>
          <Form.Item noStyle name={[_.name, "defectId"]} hidden>
            <Input />
          </Form.Item>
          <Form.Item noStyle name={[_.name, "status"]}>
            <Radio.Group
              size="small"
              block
              optionType="button"
              buttonStyle="solid"
            >
              <Radio className="ok" value={true}>
                OK
              </Radio>
              <Radio className="ng" value={false}>
                NG
              </Radio>
            </Radio.Group>
          </Form.Item>
        </>
      ),
    },
  ];
  const getRowClassName = (record, index) => {
    let count = form.getFieldValue(["defects", record.name, "count"]);
    if (count > 0) {
      return "failed";
    }
  };
  return (
    <Form form={form} onFinish={onFinish} onValuesChange={onValuesChange}>
      <Form.List name="defects" size="small">
        {(fields, { add, remove }) => (
          <Row gutter={[10, 10]}>
            <Col span={12}>
              <Table
                // loading={defectListLoading}
                size="small"
                bordered
                columns={defectColumn}
                pagination={false}
                dataSource={fields.filter((e, i) => i % 2 == 0)}
                rowClassName={getRowClassName}
              />
            </Col>
            <Col span={12}>
              <Table
                // loading={defectListLoading}
                size="small"
                bordered
                columns={defectColumn}
                pagination={false}
                dataSource={fields.filter((e, i) => i % 2 != 0)}
                rowClassName={getRowClassName}
              />
            </Col>
          </Row>
        )}
      </Form.List>
    </Form>
  );
}

export default WorkStationQA;
