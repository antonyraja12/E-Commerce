import { PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Tooltip,
  Typography,
  message,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import WorkInstructionPauseReasonService from "../../../services/digital-work-instruction-service/execution-reason-service";

const StopwatchTimer = ({
  onStart,
  onPause,
  onNext,
  resetTimerRef,
  lastButtonLabel,
  logId,
  onFinish,
  startButtonDisabled,
  resumeTime, // Add this prop
}) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timerStatus, setTimerStatus] = useState("Start");
  const [showResumeConfirmation, setShowResumeConfirmation] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reasonId, setReasonId] = useState();
  const [form] = Form.useForm();
  const timerRef = useRef();

  const reasonService = new WorkInstructionPauseReasonService();

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 10);
    } else {
      clearInterval(timerRef.current);
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [isRunning, resumeTime]);

  const handleCancelResumeConfirmation = () => {
    setShowResumeConfirmation(false);
  };
  const handleResumeConfirmation = () => {
    setShowResumeConfirmation(false);
    setIsRunning(true);
    setTimerStatus("running");
    const timeStamp = new Date();
    const endTime = timeStamp.toISOString();
    reasonService.ResumeHit(reasonId, endTime);

    if (onStart) {
      onStart();
    }
  };
  // console.log("pause", onModalResult);
  const toggleTimer = () => {
    setIsModalOpen(true);
  };
  useEffect(() => {
    resetTimerRef.current = resetTimer;
  }, [resetTimerRef]);

  const resetTimer = () => {
    setTime(0);

    setIsRunning(false);
    setTimerStatus("Start");
  };
  const handleNext = () => {
    setIsRunning(true);
    setTimerStatus("running");

    if (onStart) {
      onStart();
    }
    if (onNext) {
      // console.log("hiii");
      onNext();
    }
  };
  const handleStart = () => {
    setIsRunning(true);
    setTimerStatus("running");
    if (resumeTime) {
      setTime(resumeTime * 100);
    }

    if (onStart) {
      onStart();
    }
  };
  const handleFinish = () => {
    if (onNext) {
      // console.log("hiii");
      onNext();
    }
    message.success("Task Completed Successfully");
    onFinish(formatTime);
    // setDisable(true);
    resetTimer();
  };

  const buttonLabel = () => {
    switch (timerStatus) {
      case "Start":
        return (
          <Button
            onClick={handleStart}
            style={{
              background: "#fff",
              marginBottom: "10px",
            }}
            disabled={startButtonDisabled}
          >
            {" "}
            Start
          </Button>
        );
      case "running":
        return lastButtonLabel == "Finish" ? (
          <Button onClick={handleFinish}>{lastButtonLabel}</Button>
        ) : (
          <Button onClick={handleNext}>{lastButtonLabel}</Button>
        );

      default:
        return "";
    }
  };

  const button = () => {
    return isRunning ? (
      <Tooltip title="Pause">
        <Button
          onClick={toggleTimer}
          icon={<PauseCircleOutlined style={{ color: "#233E7F" }} />}
        ></Button>
      </Tooltip>
    ) : (
      <Tooltip title="Resume">
        <Button
          onClick={() => {
            setShowResumeConfirmation(true);
          }}
          icon={<PlayCircleOutlined style={{ color: "#233E7F" }} />}
        ></Button>
      </Tooltip>
    );
  };

  // console.log("res", resumeTime);
  const formatTime = () => {
    // const time = resumeTime * 100; // assuming time is in milliseconds

    // const milliseconds = `00${time % 100}`.slice(-2);
    const seconds = `0${Math.floor((time / 100) % 60)}`.slice(-2);
    const minutes = `0${Math.floor((time / 6000) % 60)}`.slice(-2);
    const hours = `0${Math.floor(time / 360000)}`.slice(-2);

    return `${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = (value) => {
    let formdata = new FormData();
    for (let x in value) {
      formdata.append(x, value[x]);
    }
    formdata.append("executionLogId", logId);

    reasonService.add(formdata).then((response) => {
      // console.log("res", response.data.data.pauseReasonId);
      setReasonId(response.data.data.pauseReasonId);
    });

    setIsModalOpen(false);
    form.resetFields();
    if (isRunning) {
      if (onPause) {
        onPause();
      }
      setTimerStatus("paused");
      setIsRunning(false);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);

    // setModalResult(false);
  };

  return (
    <Row style={{ paddingTop: "5%", paddingLeft: "4%" }}>
      <Col sm={14} md={14} lg={14}>
        <Typography.Title level={2} style={{ color: "#FFFFFF" }}>
          {formatTime()}
        </Typography.Title>
      </Col>
      <Col
        sm={8}
        style={{
          textAlign: "right",
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "1%",
        }}
      >
        {(timerStatus === "paused" || timerStatus === "running") && (
          <div style={{ marginRight: "5%" }}> {button()}</div>
        )}

        {buttonLabel()}
        <Modal
          title="Resume Confirmation"
          visible={showResumeConfirmation}
          onOk={handleResumeConfirmation}
          onCancel={handleCancelResumeConfirmation}
        >
          <p>Are you sure you want to resume the Work Instruction?</p>
        </Modal>
        <Modal
          title="Reason"
          visible={isModalOpen}
          onCancel={handleCancel}
          onOk={handleSubmit}
          footer=" "
        >
          <Form form={form} name="Reason From" onFinish={handleSubmit}>
            <Form.Item
              name="reason"
              rules={[
                {
                  required: true,
                  message: "Please provide a reason for taking a break",
                },
              ]}
            >
              <Input.TextArea
                style={{ width: "100%", height: "120px", fontSize: "14px" }}
                placeholder="Enter the reason for Break "
              />
            </Form.Item>
            <Row justify={"end"}>
              <Col>
                <Space>
                  {/* <Button key="cancel" onClick={handleCancel}>
                      Cancel
                    </Button> */}

                  <Button
                    key="submit"
                    type="primary"
                    htmlType="submit"
                    // onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Col>
    </Row>
  );
};

export default StopwatchTimer;
