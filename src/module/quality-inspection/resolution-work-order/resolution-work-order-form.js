import {
  CheckCircleFilled,
  FileDoneOutlined,
  SafetyCertificateFilled,
  ToolOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Spin, Steps, Tooltip } from "antd";
import { default as moment } from "moment";
import React, { useEffect, useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { dateTimeFormat } from "../../../helpers/url";
import { useAccess } from "../../../hooks/useAccess";
import WorkOrderResolutionService from "../../../services/quality-inspection/workorder-resolution-service";
import Page from "../../../utils/page/page";
import { withAuthorization } from "../../../utils/with-authorization";
import { withRouter } from "../../../utils/with-router";
import ResolutionWorkOrderAssign from "./resolution-work-order-assign";
import ResolutionWorkOrderResolve from "./resolution-work-order-resolve";
import ResolutionWorkOrderVerify from "./resolution-work-order-verify";

const { Step } = Steps;

function ResolutionWorkOrderForm(props) {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [current, setCurrent] = useState(0);
  const [id, setId] = useState();
  const [assignedDate, setAssignedDate] = useState("");
  const [resolveDate, setResolveDate] = useState("");
  const [verifyDate, setVerifyDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [assignedTo, setAsssignedTo] = useState("");
  const [initiatedBy, setInitiatedBy] = useState("");
  const [access, loading] = useAccess();
  const service = new WorkOrderResolutionService();
  useEffect(() => {
    if (params.id) setId(Number(params.id));

    setCurrent(Number(searchParams.get("c")) ?? 0);
  }, [searchParams]);
  useEffect(() => {
    service.retrieve(params.id).then((response) => {
      if (response.data) {
        let status = response.data.status;
        setAssignedDate(response.data?.assignedDate);
        setResolveDate(response.data?.resolveDate);
        setAsssignedTo(response.data?.assignedTo?.userName);
        setInitiatedBy(response.data?.initiatedBy?.userName);
        setVerifyDate(response.date?.verifyDate);
        setEndDate(response.data.endDate);
        if (status == 1) setCurrent(1);
        else if (status == 2) setCurrent(2);
        else if (status == 3) setCurrent(2);
        else if (status == 4) setCurrent(3);
        else if (status == 5) setCurrent(3);
        else setCurrent(0);
      }
    });
  }, [current]);

  const renderContent = () => {
    switch (current) {
      case 0:
        return <ResolutionWorkOrderAssign id={id} next={next} />;
      case 1:
        return <ResolutionWorkOrderResolve id={id} next={next} prev={prev} />;
      case 2:
        return (
          <ResolutionWorkOrderVerify
            key="1R"
            c={current}
            id={id}
            next={next}
            prev={prev}
          />
        );
      case 3:
        return (
          <ResolutionWorkOrderVerify
            key="2R"
            c={current}
            id={id}
            next={next}
            prev={prev}
          />
        );
      default:
        return <ResolutionWorkOrderVerify key="3R" c={4} id={id} />;
    }
  };
  const steps = () => {
    if (current < 4) {
      return (
        <Steps size="small" current={current} labelPlacement="vertical">
          <Step
            title={
              <div>
                <div>Assign</div>
                {assignedDate && <>{dateTimeFormat(assignedDate)}</>}
              </div>
            }
            icon={<FileDoneOutlined />}
            onClick={() => handleStepClick(0)}
          />

          <Step
            title={
              <Tooltip
                placement="top"
                title={
                  <div style={{ color: "black" }}>
                    <div>
                      <strong>Assigned To:</strong> {assignedTo}
                    </div>
                    <div>
                      <strong>Assigned By:</strong> {initiatedBy}
                    </div>
                    <div>
                      <strong>Assigned Time:</strong>{" "}
                      {moment(assignedDate).format("HH:mm")}
                    </div>
                    <div>
                      <strong>Assigned Date:</strong>{" "}
                      {moment(assignedDate).format("DD-MM-YYYY")}
                    </div>
                  </div>
                }
                color="white"
              >
                <div>
                  <div>Resolve</div>
                  {resolveDate && <div>{dateTimeFormat(resolveDate)}</div>}
                </div>
              </Tooltip>
            }
            icon={<ToolOutlined />}
            onClick={() => handleStepClick(1)}
          />

          <Step
            title={
              <Tooltip
                placement="top"
                title={
                  <div style={{ color: "black" }}>
                    <div>
                      <strong>Assigned To:</strong> {assignedTo}
                    </div>
                    <div>
                      <strong>Assigned By:</strong> {initiatedBy}
                    </div>
                    <div>
                      <strong>Resolved Time:</strong>{" "}
                      {moment(resolveDate).format("HH:mm")}
                    </div>
                    <div>
                      <strong>Resolved Date:</strong>{" "}
                      {moment(resolveDate).format("DD-MM-YYYY")}
                    </div>
                  </div>
                }
                color="white"
              >
                <div>
                  <div>Verify</div>
                  {resolveDate && <div>{dateTimeFormat(resolveDate)}</div>}
                </div>
              </Tooltip>
            }
            icon={<SafetyCertificateFilled />}
            onClick={() => handleStepClick(2)}
          />
          <Step
            title={
              <div>
                <div>Close</div>
                {endDate && <div>{dateTimeFormat(endDate)}</div>}
              </div>
            }
            icon={<CheckCircleFilled />}
            onClick={() => handleStepClick(3)}
          />
        </Steps>
      );
    }
  };
  const handleStepClick = (step) => {
    setCurrent(step);
    navigate({
      search: `?${createSearchParams({
        c: step,
      })}`,
    });
  };
  const next = () => {
    if (current < 3) {
      navigate({
        search: `?${createSearchParams({
          c: current + 1,
        })}`,
      });
    } else {
      navigate("..");
    }
  };
  const prev = () => {
    navigate({
      search: `?${createSearchParams({
        c: current - 1,
      })}`,
    });
  };

  const { isLoading } = props;
  if (isLoading) {
    return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
  }

  return (
    <Spin spinning={isLoading}>
      <Page title="Resolution Work Order">
        <Row justify="center" gutter={[10, 10]}>
          <Col sm={18}>
            {steps()}
            <br />
            <Card size="small" bordered={false}>
              {renderContent()}
            </Card>
          </Col>
        </Row>
      </Page>
    </Spin>
  );
}

export default withRouter(withAuthorization(ResolutionWorkOrderForm));