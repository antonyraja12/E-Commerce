import React, { useEffect, useState } from "react";
import WorkInstructionTaskService from "../../../services/digital-work-instruction-service/work-instruction-task-service";
import { response } from "msw";
import { Col, Image, Row, Typography } from "antd";
import { publicUrl } from "../../../helpers/url";
import Card from "antd/es/card/Card";

function TaskRendering({ id }) {
  const [task, setTask] = useState([]);

  const service = new WorkInstructionTaskService();

  useEffect(() => {
    getTAsk();
  }, [id]);

  const getTAsk = () => {
    service.retrieve(id).then((response) => {
      setTask(response.data);
    });
  };
  const getMediaType = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    if (
      ["jpg", "jpeg", "png", "gif", "avif", "bmp", "svg", "webp"].includes(
        extension
      )
    ) {
      return "image";
    } else if (["mp4", "webm", "ogg"].includes(extension)) {
      return "video";
    } else {
      // Handle other types or display an error message
      console.error(`Unsupported media type for file: ${url}`);
      return "image";
    }
  };
  const MediaPreview = ({ url }) => {
    const mediaType = getMediaType(url);

    if (mediaType === "image") {
      return (
        <img
          style={{ height: "55vh", width: "100%", borderRadius: "6px" }}
          src={url}
        />
      );
    } else if (mediaType === "video") {
      return (
        <video
          width="100%"
          // height="350"
          controls
          style={{ borderRadius: "6px", height: "55vh" }}
        >
          <source
            src={url}
            type={`video/${url.split(".").pop().toLowerCase()}`}
          />
        </video>
      );
    } else {
      return null;
    }
  };

  // console.log("task", task);
  const taskLabel = () => {
    return task.parentId === null ? "Task" : "Sub-Task";
  };

  return (
    <>
      <Row justify={"space-between"}>
        <Col sm={17}>
          <MediaPreview
            url={`${publicUrl}${task.taskImg}`}
            style={{ width: "100%" }}
          />
        </Col>
        <Col sm={6}>
          <Card style={{ background: "#F1F1F1", height: "55vh" }}>
            <Typography.Title level={5}>{taskLabel()}</Typography.Title>
            <Typography.Text>{task.taskName}</Typography.Text>
            <br />
            <br />
            {task.description && (
              <>
                <Typography.Title level={5}>Description</Typography.Title>
                <Typography.Text>{task.description}</Typography.Text>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
}
export default TaskRendering;
