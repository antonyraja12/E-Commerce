import {
  Col,
  Descriptions,
  Image,
  Alert,
  Row,
  Spin,
  Steps,
  Table,
  Flex,
  message,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";

import { useParams } from "react-router-dom";
import "./work-station-instance.css";
import { useWorkStationInstance } from "../../../hooks/useWorkStationInstance";
import WorkStationInstanceHeader from "./work-station-instance-header";
const WorkStationInstance2 = (props) => {
  const { id } = useParams();
  const { data, step, jobOrder, property, isLoading } = useWorkStationInstance({
    workStationId: id,
    autoRefresh: true,
  });

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
      dataIndex: "deviceType",
      title: "Type",
      width: 200,
    },
    {
      dataIndex: "value",
      key: "value",
      title: "Value",
      width: 250,
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
  const getRowClassName = (record, index) => {
    let current = step[property?.currentStep];
    let str = "";
    //  if (!record.result) {
    if (record.sequenceNumber === current.sequenceNumber)
      return (str = "active");
    //  }

    if (record.result === "OK") str += " success";
    else if (record.result === "NG") str += " failed";

    return str;
  };

  const stepNumber = useMemo(() => {
    let seqNo = new Set(step.map((e) => parseInt(e.sequenceNumber)));
    return Array.from(seqNo).map((e) => {
      let current = step[property?.currentStep];

      let className = "";
      if (e < current.sequenceNumber) className = "success";
      else if (current.sequenceNumber >= e && current.sequenceNumber < e + 1) {
        className = "active";
      } else className = "";
      return {
        step: e,
        className: className,
      };
    });
  }, [step, property?.currentStep]);

  const activeSteps = useMemo(() => {
    let current = step[property?.currentStep];
    let stepNum = parseInt(current?.sequenceNumber);
    return step.filter(
      (e) => e.sequenceNumber >= stepNum && e.sequenceNumber < stepNum + 1
    );
  }, [step, property?.currentStep]);

  useEffect(() => {
    // message.open({
    //   duration: 0,
    //   // message: "Error Occured",
    //   // placement: "top",
    //   content: "Error occured on scanning data",
    // });
    // notification.error({
    //   closeIcon: true,
    //   duration: 2000,
    //   message: "Error Occured",
    //   placement: "top",
    //   description: "Error occured on scanning data",
    // });
  }, []);
  return (
    <div style={{ margin: "auto", padding: 5 }}>
      <Spin spinning={isLoading}>
        <Row gutter={[10, 10]}>
          <Col span={24}>
            <WorkStationInstanceHeader {...{ data, jobOrder, property }} />
          </Col>

          <Col sm={24} md={18} lg={18} xl={18}>
            <Flex align="center" gap={10} style={{ width: "100%" }}>
              <div className="steps">
                {stepNumber.map((e) => (
                  <div className={`step ${e.className}`}>{e.step}</div>
                ))}
              </div>
              <div style={{ flex: "1 1 auto" }}>
                <Table
                  rowKey="sequenceNumber"
                  columns={columns}
                  dataSource={activeSteps ?? []}
                  bordered
                  // size="small"
                  pagination={false}
                  rowClassName={getRowClassName}
                  // className="wi-steps"
                />
              </div>
            </Flex>
          </Col>
          <Col sm={24} md={6} lg={6} xl={6}>
            <Descriptions
              items={[
                {
                  key: "vin",
                  label: "VIN.No",
                  children: jobOrder?.vin ?? "TNXXAAXXXX",
                },
                {
                  key: "blable",
                  label: "B.label",
                  children: property?.buildLabel,
                },
              ]}
              layout="horizontal"
              size="small"
              bordered
              // colon={false}
              column={1}
            />
            {/* <Card className="work-instance"> */}
            <Image
              src="/image.jfif"
              alt="instance image"
              preview={false}
              style={{
                overflow: "hidden",
                objectFit: "contain",
                zIndex: 1,
                borderRadius: "5px",
                border: "1px solid #303030",
                width: "100%",
              }}
            />
            {/* </Card> */}
          </Col>
          <Col span={24}>
            <Alert
              className="blink-section"
              type="error"
              message="Part already fitted"
            />
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default WorkStationInstance2;
