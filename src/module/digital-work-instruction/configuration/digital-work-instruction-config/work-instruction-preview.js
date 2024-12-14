import { DownOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Collapse,
  Divider,
  Image,
  Row,
  Space,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { publicUrl } from "../../../../helpers/url";
import WorkInstructionTaskService from "../../../../services/digital-work-instruction-service/work-instruction-task-service";
import WorkInstructionService from "../../../../services/digital-work-instruction-service/work-order-details-service";

const PreviewList = (props) => {
  const [workInstructionData, setWorkInstructionData] = useState(null);
  const [workInstructionTaskData, setWorkInstructionTaskData] = useState(null);
  const [wiId, setWiId] = useState();

  const { id } = useParams();

  // console.log("id", props);
  useEffect(() => {
    if (props && props?.id) {
      setWiId(props?.id);
    } else if (id) {
      setWiId(id);
    }
  }, [id, props]);

  const service = new WorkInstructionService();
  const taskService = new WorkInstructionTaskService();

  useEffect(() => {
    if (wiId) {
      service.retrieve(wiId).then((response) => {
        // console.log("res", response);
        setWorkInstructionData(response.data);
        setWorkInstructionTaskData(
          taskService.convertToTree(response.data?.task)
        );
      });
    }
  }, [wiId]);

  const getMediaType = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    if (
      ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "avif"].includes(
        extension
      )
    ) {
      return "image";
    } else if (["mp4", "webm", "ogg"].includes(extension)) {
      return "video";
    } else {
      console.error(`Unsupported media type for file: ${url}`);
      return "image";
    }
  };

  const MediaPreview = ({ url }) => {
    const mediaType = getMediaType(url);

    if (mediaType === "image") {
      return <Image width={100} style={{ height: "30px" }} src={url} />;
    } else if (mediaType === "video") {
      return (
        <video width="100" height="50" controls>
          <source src={url} />
        </video>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      {/* <Card> */}
      <Typography.Title Title level={5} style={{ fontWeight: "400" }}>
        Preview
      </Typography.Title>

      <Divider />

      <div style={{ minHeight: "40vh" }}>
        <Row>
          <Col span={8}>
            <span style={{ color: "#666666" }}>Title</span>
            <Typography.Title level={5} style={{ fontWeight: "500" }}>
              {workInstructionData?.title}
            </Typography.Title>
          </Col>
          <Col span={8}>
            <span style={{ color: "#666666" }}>Description</span>
            <Typography.Title level={5} style={{ fontWeight: "500" }}>
              {workInstructionData?.description}
            </Typography.Title>
          </Col>
          <Col span={8}>
            <span style={{ color: "#666666" }}>Process</span>

            <Typography.Title level={5} style={{ fontWeight: "500" }}>
              {workInstructionData?.process?.processName}
            </Typography.Title>
          </Col>
        </Row>
        <br />

        <Space direction="vertical" style={{ width: "100%" }}>
          {workInstructionTaskData?.map((task, index) => (
            <Collapse
              bordered={false}
              expandIcon={({ isActive }) => (
                <DownOutlined rotate={isActive ? 0 : -90} />
              )}
              style={{
                backgroundColor: "#fff",
                border: "2px solid #E8E8E8",
                padding: "10px",
                // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Collapse.Panel
                key={index}
                header={task.taskName}
                // onClick={(e) => (isCollapsed ? e.stopPropagation() : null)}
                extra={
                  <>
                    <Image.PreviewGroup
                      preview={{
                        onChange: (current, prev) =>
                          console.log(
                            `current index: ${current}, prev index: ${prev}`
                          ),
                      }}
                    >
                      <MediaPreview url={`${publicUrl}${task.taskImg}`} />
                    </Image.PreviewGroup>
                  </>
                }
              >
                <ul>
                  {task?.children?.map((e) => (
                    <li key={e.taskId}>
                      <Row gutter={[10, 10]}>
                        <Col sm={8}>
                          <Typography.Text>{e.taskName}</Typography.Text>
                        </Col>
                        <Col sm={12}>
                          <Typography.Text>{e.description}</Typography.Text>
                        </Col>
                        <Col sm={4}>
                          <Image.PreviewGroup
                            preview={{
                              onChange: (current, prev) =>
                                console.log(
                                  `current index: ${current}, prev index: ${prev}`
                                ),
                            }}
                          >
                            <MediaPreview url={`${publicUrl}${e.taskImg}`} />
                          </Image.PreviewGroup>
                        </Col>
                      </Row>
                      <br />
                    </li>
                  ))}
                </ul>
              </Collapse.Panel>
            </Collapse>
          ))}
        </Space>
      </div>

      <br />
      <Divider />

      <Row justify="end">
        <Space>
          <Col>
            <Col>
              <>
                {
                  <Space>
                    <Button
                      onClick={() => {
                        props.prev();
                      }}
                      disabled={props.mode === "view"}
                      type="default"
                    >
                      Back
                    </Button>
                    <Link to="../">
                      <Button type="primary">Done</Button>
                    </Link>
                  </Space>
                }
              </>
            </Col>
          </Col>
        </Space>
      </Row>
      {/* </Card> */}
    </>
  );
};

export default PreviewList;
