import { Card, Col, Row, Spin, Steps, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAccess } from "../../../hooks/useAccess";
import CheckListExecutionService from "../../../services/preventive-maintenance-services/checklist-execution-service";
import Page from "../../../utils/page/page";
import { withAuthorization } from "../../../utils/with-authorization";
import { withRouter } from "../../../utils/with-router";
import ChecklistExecutionForm from "./checklist-execution-form";
import ChecklistExecutionPreview from "./checklist-execution-preview";
import ChecklistExecutionStart from "./checklist-execution-start";
const { Step } = Steps;
function ChecklistExecutionStepper(props) {
  const service = new CheckListExecutionService();
  const params = useParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(null);
  const [access, loading] = useAccess();
  const [isStepLoading, setStepIsLoading] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const renderContent = () => {
    switch (current) {
      case 0:
        return <ChecklistExecutionStart next={next} />;
        break;
      case 1:
        return <ChecklistExecutionForm next={next} prev={prev} />;
        break;
      case 2:
        return <ChecklistExecutionPreview next={next} prev={prev} />;
        break;

      default:
        return <></>;
        break;
    }
  };

  useEffect(() => {
    setStepIsLoading(true);
    service
      .retrieve(params.id)
      .then((response) => {
        if (response.data) {
          let status = response.data.status;
          if (status == "InProgress") setCurrent(1);
          else if (status == "Closed") setCurrent(2);
          else setCurrent(0);
        } else message.error(response.data.message);
      })
      .catch((error) => {
        console.log(message);
      })
      .finally(() => {
        setStepIsLoading(false);
      });
  }, []);

  const { checks, checktypes, isLoading } = props;

  if (isLoading) {
    return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
  }

  return (
    <Spin spinning={isLoading}>
      <Page title="Checklist Execution">
        <br></br>
        <Row justify="center" gutter={[10, 10]}>
          <Col sm={22}>
            <Spin spinning={isStepLoading}>
              <Steps progressDot current={current} labelPlacement="vertical">
                <Step title="Start" />
                <Step title="Execution" />
                <Step title="Preview" />
              </Steps>

              <Card size="small" bordered={false}>
                {renderContent()}
              </Card>
            </Spin>
          </Col>
        </Row>
      </Page>
    </Spin>
  );
}

export default withRouter(withAuthorization(ChecklistExecutionStepper));
