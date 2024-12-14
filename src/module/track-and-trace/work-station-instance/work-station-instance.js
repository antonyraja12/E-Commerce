import {
  Alert,
  Col,
  Descriptions,
  Image,
  Flex,
  Row,
  Spin,
  Table,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import "./work-station-instance.css";
import { useWorkStationInstance } from "../../../hooks/useWorkStationInstance";
import WorkStationInstanceHeader from "./work-station-instance-header";
import { publicUrl } from "../../../helpers/url";
const WorkStationInstance = (props) => {
  const [file, setFile] = useState("/image.jfif");
  const { id } = useParams();
  const { data, step, jobOrder, property, isLoading, connection } =
    useWorkStationInstance({
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
      width: 80,
      // align: "center",
    },
  ];
  useEffect(() => {
    if (step[property?.currentStep]?.file) {
      setFile(`${publicUrl}/${step[property?.currentStep].file}`);
    }

    const row = document.querySelector(`tr.active`);
    if (row) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [property, step]);
  const getRowClassName = (record, index) => {
    let str = "";
    if (index === data?.properties?.currentStep) str = "active";
    if (record.result === "OK") str += " success";
    else if (record.result === "NG") str += " failed";
    else if (["BYPASSED", "SKIPPED"].includes(record.result)) str += " bypass";

    return str;
  };

  return (
    <div style={{ margin: "0 0 70px", padding: "10px" }}>
      <WorkStationInstanceHeader {...{ data, jobOrder, property }} />
      {/* <Spin spinning={isLoading}> */}
      <Row gutter={[10, 10]}>
        <Col sm={24} md={18} lg={18} xl={18}>
          <Table
            rowKey="sequenceNumber"
            columns={columns}
            dataSource={step ?? []}
            bordered
            size="small"
            pagination={false}
            rowClassName={getRowClassName}
            // className="wi-steps"
          />
        </Col>
        <Col sm={24} md={6} lg={6} xl={6}>
          <div style={{ position: "sticky", top: 0 }}>
            <Flex>
              {connection?.map((e) => (
                <Tag color={e.connected ? "green" : "red"}>{e.device}</Tag>
              ))}
            </Flex>
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
            {file && (
              <Image
                src={file}
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
            )}
          </div>
          {/* </Card> */}
        </Col>
        <Col span={24}>
          {property?.assemblyCompleted && (
            <Alert
              style={{
                width: "100%",
                position: "fixed",
                bottom: 5,
                zIndex: 998,
                background: "#53c41aa7",
              }}
              className="blink-section"
              message={"Move to Next Station"}
            />
          )}
          {property?.errorMessage && (
            <Alert
              style={{
                width: "100%",
                position: "fixed",
                bottom: 0,
                zIndex: 998,
              }}
              className="blink-section"
              type="error"
              message={property.errorMessage}
            />
          )}
        </Col>
      </Row>
      {/* </Spin> */}
    </div>
  );
};

export default WorkStationInstance;
