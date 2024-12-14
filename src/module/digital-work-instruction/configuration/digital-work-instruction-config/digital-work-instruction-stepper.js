import { Col, Row, Spin, Steps, Typography } from "antd";
import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { useAccess } from "../../../../hooks/useAccess";
import { withAuthorization } from "../../../../utils/with-authorization";
import { withRouter } from "../../../../utils/with-router";
import WorkInstructionDetailsForm from "./work-instruction-details-form";
import PreviewList from "./work-instruction-preview";
import WorkInstructionTaskForm from "./work-instruction-task-form";

function DigitalWorkInstructionStepper(props) {
  // console.log("Received props:", props);
  const { id } = useParams();
  const [current, setCurrent] = useState(0);
  const [access, loading] = useAccess();
  const [wiId, setWiId] = useState(0);
  const { Step } = Steps;

  useEffect(() => {
    if (id) {
      setWiId(id);
    }
  }, [id]);
  const next = (id) => {
    // console.log("id from wi", id);
    setWiId(id);
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const onChange = (value) => {
    // console.log("onChange:", value);
    setCurrent(value);
  };

  const renderContent = () => {
    switch (current) {
      case 0:
        return <WorkInstructionDetailsForm id={wiId} next={next} />;
        break;
      case 1:
        return <WorkInstructionTaskForm id={wiId} next={next} prev={prev} />;
        break;
      case 2:
        return <PreviewList id={wiId} next={next} prev={prev} />;
        break;

      case 3:
        return <PreviewList id={wiId} next={next} prev={prev} />;
        break;
    }
  };

  const { isLoading } = props;
  // console.log("access", access[0].length);
  if (isLoading) {
    return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
  }

  return (
    <Spin spinning={isLoading}>
      <Row
        justify="space-between"
        style={{
          minHeight: "75vh",
          // border: "1px solid black",
          borderRadius: "12px",
        }}
        gutter={[10, 10]}
      >
        {/* <Spin spinning={false}> */}
        <Col
          sm={6}
          style={{
            background: "#233E7F",
            padding: "3%",
            borderRadius: "12px",
          }}
        >
          <Typography.Title
            level={5}
            style={{ color: "#FFFFFF", fontWeight: 600 }}
          >
            Digital Work Instruction
          </Typography.Title>
          <Steps
            style={{
              height: "100%",
              // marginTop: "5%",
              paddingTop: "20%",
            }}
            current={current}
            onChange={onchange}
            direction="vertical"
            labelPlacement="horizontal"
            size="large"
            items={[
              {
                title: <span style={{ color: "#FFFFFF" }}>Basic details</span>,
              },
              {
                title: (
                  <span style={{ color: "#FFFFFF" }}>Add Task/Sub Task</span>
                ),
              },
              {
                title: <span style={{ color: "#FFFFFF" }}>Preview</span>,
              },
            ]}
          ></Steps>
        </Col>
        <Col sm={18} style={{ padding: "5%" }}>
          {renderContent()}
        </Col>
      </Row>
    </Spin>
  );
}
export default withRouter(withAuthorization(DigitalWorkInstructionStepper));
