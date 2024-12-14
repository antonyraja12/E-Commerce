import {
  LeftOutlined,
  PauseOutlined,
  PlayCircleTwoTone,
  RightOutlined,
  SearchOutlined,
  SettingFilled,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Pagination,
  Result,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Steps,
  Timeline,
  Typography,
  Upload,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import WorkInstructionService from "../../../services/digital-work-instruction-service/work-order-details-service";
import WorkInstructionTaskService from "../../../services/digital-work-instruction-service/work-instruction-task-service";
import TaskRendering from "./TaskRendering";
import StopwatchTimer from "./stopWatchTimer";
import WorkInstructionExeccutoinService from "../../../services/digital-work-instruction-service/work-instruction-execution-service";
import WorkInstructionPauseReasonService from "../../../services/digital-work-instruction-service/execution-reason-service";
import ExecutionLogService from "../../../services/digital-work-instruction-service/execution-log-service";
import { withRouter } from "../../../utils/with-router";
import { withForm } from "../../../utils/with-form";
import { withAuthorization } from "../../../utils/with-authorization";
import { useAccess } from "../../../hooks/useAccess";

function DigitalInstructionExecution(props) {
  const { Step } = Steps;
  const { id } = useParams();
  const [wiData, setWiData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [wiId, setWiId] = useState();
  const [process, setProcess] = useState([]);
  const [executionId, setExecutionId] = useState();
  const [disable, setDisable] = useState(false); // or initialize it with the appropriate value
  const [logId, setLogId] = useState();
  const [access, loading] = useAccess();
  const [duration, setDuration] = useState();
  const scrollContainerRef = useRef(null);
  const resetTimerRef = useRef(null);

  const service = new WorkInstructionService();
  const executionService = new WorkInstructionExeccutoinService();

  const logService = new ExecutionLogService();
  const fetchWiData = () => {
    service.list().then((response) => {
      setWiData(response.data);
    });
  };
  useEffect(() => {
    fetchWiData();
    if (wiData.length > 0) {
      formSubmit({ workInstructionId: wiData[0].workInstructionId });
    }
    if (id) {
      ResumeWork();
    }
  }, []);

  const ResumeWork = () => {
    executionService
      .retrieve(id)
      .then((response) => {
        setDuration(response.data.duration);
        setWiId(response.data.workInstructionId);
        setTaskData(response.data.workInstruction.task);
        setCurrentStep(response.data.executionLogs.length - 1);
        setExecutionId(
          response.data.executionLogs[0]?.workInstructionExecutionId
        );
        // setLogId(response.data.executionLogs.map((e)=>(e.executionLogId)));
        response.data.executionLogs.forEach((log) => {
          if (log.endDate === null) {
            setLogId(log.executionLogId);
          }
        });
      })
      .catch((e) => {
        console.log("err", e);
      });
  };

  const formSubmit = (val) => {
    service.retrieve(val.workInstructionId).then((response) => {
      setTaskData(response.data.task);
      setWiId(val.workInstructionId);
      setCurrentStep(0);
      handleResetTimer();
      setExecutionId(null);
      setDisable(false);
      setDuration(0);
      // setProcess(response.data.process);
    });
  };
  const handleWorkCompletion = (value) => {
    setCurrentStep(0);
    setDisable(true);
    setDuration(0);
  };

  const handleStepChange = (current) => {
    setCurrentStep(current);

    const activeTaskId = arrangedData?.[current]?.taskId;
    renderContent(activeTaskId);
  };

  const handleNext = () => {
    const currentTime = new Date();
    const endTime = currentTime.toISOString();

    if (currentStep < taskData.length - 1) {
      const newCurrentStep = currentStep + 1;
      setCurrentStep(newCurrentStep);
      const activeTaskId = arrangedData[currentStep + 1]?.taskId;
      renderContent(activeTaskId);
    }
    logService.TaskEndTime(logId, endTime).then((response) => {
      if (currentStep < taskData.length - 1) {
        logService
          .save({
            workInstructionExecutionId: executionId,

            taskId: arrangedData[currentStep + 1]?.taskId,
          })
          .then((response) => {
            setLogId(response?.data?.data?.executionLogId);
          })
          .catch((logError) => {
            console.log(logError);
          });
      } else {
        executionService.HandleTime(executionId, endTime);
      }

      console.log(response).catch((e) => {
        console.log(e, "error");
      });
    });
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 100; // Adjust the scroll distance as needed
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 100; // Adjust the scroll distance as needed
    }
  };
  const renderContent = (task) => {
    const taskId = task.taskId;

    switch (currentStep) {
      case 0:
        return <TaskRendering id={taskId} />;

      default:
        return <TaskRendering id={taskId} />;
    }
  };

  const arrangeTasks = (tasks) => {
    // Group tasks by parentId
    const organizedTasks = {};
    tasks.forEach((task) => {
      const parentId = task.parentId;
      if (!organizedTasks[parentId]) {
        organizedTasks[parentId] = [];
      }
      organizedTasks[parentId].push(task);
    });

    // Arrange tasks recursively
    const arrangedTasks = [];
    const arrange = (task, prefix) => {
      arrangedTasks.push({
        ...task,
        title: prefix,
      });
      const childTasks = organizedTasks[task.taskId];
      if (childTasks) {
        childTasks.sort((a, b) => a.level - b.level);
        childTasks.forEach((child, index) => {
          const childPrefix =
            prefix === "" ? `${index + 1}` : `${prefix}.${index + 1}`;
          arrange(child, childPrefix);
        });
      }
    };
    const mainTasks = organizedTasks[null] || [];
    mainTasks.sort((a, b) => a.level - b.level);
    mainTasks.forEach((mainTask, index) => {
      const mainPrefix = `${index + 1}`;
      arrange(mainTask, mainPrefix);
    });

    return arrangedTasks;
  };

  const handleResetTimer = () => {
    if (resetTimerRef.current) {
      resetTimerRef.current();
    }
  };

  const arrangedData = arrangeTasks(taskData);

  const handleStart = () => {
    const activeTaskId = arrangedData?.[0];
    renderContent(activeTaskId);

    if (!executionId) {
      executionService
        .add({ workInstructionId: wiId, status: "InProgress" })
        .then((response) => {
          setExecutionId(response.data.data.workInstructionExecutionId);
          logService
            .save({
              workInstructionExecutionId:
                response.data.data.workInstructionExecutionId,
              status: "InProgress",

              taskId: arrangedData[currentStep]?.taskId,
            })
            .then((response) => {
              setLogId(response?.data?.data?.executionLogId);
            })
            .catch((logError) => {
              console.log(logError);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const isLastStep = currentStep === arrangedData.length - 1;
  const buttonLabel = isLastStep ? "Finish" : "Next";

  const handlePause = (pausedTime) => {
    // console.log("Timer paused", pausedTime);
  };
  const onChange = (id) => {
    const foundObject = wiData?.find((obj) => obj.workInstructionId === id);
    if (foundObject) {
      // Assuming you want to set the found object to the state
      const processArr = [];
      processArr.push(foundObject.process);

      setProcess(processArr);
    }
  };

  const { isLoading } = props;

  if (isLoading) {
    return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
  }

  // if (!access[0] || access[0].length === 0) {
  //   return (
  //     <Result
  //       status={"403"}
  //       title="403"
  //       subTitle="Sorry You are not authorized to access this page"
  //     />
  //   );
  // }

  return (
    <Spin spinning={isLoading}>
      <Card>
        <Typography.Title level={5}>Digital Work Instruction</Typography.Title>

        <Row>
          <Col sm={12}>
            <Form onFinish={formSubmit} layout="inline" name="">
              <Form.Item name="workInstructionId" style={{ width: "40%" }}>
                <Select
                  placeholder="Work Instruction"
                  showSearch
                  optionFilterProp="children"
                  onChange={onChange}
                >
                  {wiData.map((e) => (
                    <>
                      {
                        <Select.Option value={e.workInstructionId}>
                          {e.title}
                        </Select.Option>
                      }
                    </>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="process" style={{ width: "40%" }}>
                <Select placeholder="Process">
                  {process.map((e) => (
                    <>
                      {
                        <Select.Option value={e?.processId}>
                          {e?.processName}
                        </Select.Option>
                      }
                    </>
                  ))}
                </Select>
              </Form.Item>

              <Button type="primary" htmlType="submit">
                Go
              </Button>
            </Form>
          </Col>
        </Row>
        <br />

        {wiId && (
          <>
            <Row justify="space-between">
              <Col sm={17}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "start",
                  }}
                >
                  <Button
                    type="text"
                    icon={<LeftOutlined />}
                    onClick={scrollLeft}
                  />
                  <div
                    ref={scrollContainerRef}
                    style={{
                      overflowX: "auto",
                      overflowX: "hidden",
                      overflowY: "hidden",
                      whiteSpace: "nowrap",
                      paddingTop: "10px",
                    }}
                  >
                    <Steps
                      current={currentStep}
                      onChange={handleStepChange}
                      direction="horizontal"
                      progressDot
                      size="small"
                    >
                      {arrangedData?.map((task, index) => (
                        <Step key={task.taskId} title={task.title} disabled />
                      ))}
                    </Steps>
                  </div>

                  <Button
                    type="text"
                    onClick={scrollRight}
                    icon={<RightOutlined />}
                  />
                </div>
              </Col>
              <Col span={6}>
                <div
                  style={{
                    border: "1px solid black",
                    // padding: " 5px 0 0 6px",
                    borderRadius: "8px",
                    background: "#233E7F",
                  }}
                >
                  <StopwatchTimer
                    onStart={handleStart}
                    onPause={handlePause}
                    onNext={handleNext}
                    resetTimerRef={resetTimerRef}
                    lastButtonLabel={buttonLabel}
                    logId={logId}
                    onFinish={(val) => handleWorkCompletion(val)}
                    startButtonDisabled={disable}
                    resumeTime={duration}
                  />
                </div>
              </Col>
            </Row>
            <br />
            <Row justify={"space-between"}>
              <Col sm={24}>
                {arrangedData?.[currentStep] &&
                  renderContent(arrangedData[currentStep])}
              </Col>
            </Row>
          </>
        )}
      </Card>
    </Spin>
  );
}
export default withForm(
  withRouter(withAuthorization(DigitalInstructionExecution))
);
