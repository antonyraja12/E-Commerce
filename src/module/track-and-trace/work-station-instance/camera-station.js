import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Image,
  Row,
  Space,
  Tag,
  Tooltip,
} from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { publicUrl, remoteAsset } from "../../../helpers/url";
import { useWorkStationInstance } from "../../../hooks/useWorkStationInstance";
import WorkStationInstanceService from "../../../services/track-and-trace-service/work-station-instance-service";
import WorkStationInstanceHeader from "./work-station-instance-header";
import "./work-station-instance.css";

import Hls from "hls.js";
const CameraStation = (props) => {
  const [isSaving, setSaving] = useState([false, false]);
  const videoRef = useRef(null);
  const [file, setFile] = useState("/image.jfif");
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
      render: (value, record, index) => {
        return value;
      },
    },
  ];

  useEffect(() => {
    const currentFile = step[property?.currentStep]?.file;

    if (property?.currentStep === 0) {
      setFile("/image.jfif");
    } else if (currentFile && currentFile !== "null") {
      setFile(`${publicUrl}/${currentFile}`);
    } else {
      setFile(" ");
    }
  }, [property, step]);

  const images = useMemo(() => {
    if (property.images)
      return JSON.parse(property.images)?.map((e) => remoteAsset(e));
    return [];
  }, [property]);

  const url = useMemo(() => {
    if (property.streamUrl) return property.streamUrl;
    return "http://192.168.0.51:8081/stream.m3u8";
  }, [property]);
  useEffect(() => {
    if (!url) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        manifestLoadingMaxRetryTimeout: 10000, // Set to 10 seconds or more
      });

      hls.loadSource(url);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("Network error - retrying...");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("Media error - attempting to recover...");
              hls.recoverMediaError();
              break;
            default:
              console.error("Unrecoverable error occurred.");
              hls.destroy();
              break;
          }
        }
      });

      return () => hls.destroy();
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = url;
      videoRef.current.addEventListener("loadedmetadata", () => {
        videoRef.current.play();
      });
    }
  }, [url]);
  const gridStyle = {
    position: "relative",
    // width: "50%",
    textAlign: "center",
    flex: "1 1 50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  };
  const capture = (index) => {
    setSaving((state) => {
      let arr = [...state];
      arr[index] = true;
      return arr;
    });
    const service = new WorkStationInstanceService();
    service
      .callService(id, "captureSnapshot", {
        index: index,
      })

      .finally(() => {
        setSaving((state) => {
          let arr = [...state];
          arr[index] = false;
          return arr;
        });
      });
  };
  const completeService = () => {
    const service = new WorkStationInstanceService();
    service
      .callService(id, "completed", { value: true })
      .then(({ data }) => {})
      .finally(() => {});
  };
  return (
    <div style={{ margin: "auto", padding: 5 }}>
      <Row gutter={[10, 10]}>
        <Col span={24}>
          <WorkStationInstanceHeader {...{ data, jobOrder, property }} />
        </Col>

        <Col sm={24} md={18} lg={18} xl={24}>
          {/* <Card.Grid
            style={{ width: "100%", flex: "1 1 100%", padding: 0 }}
          ></Card.Grid> */}
          <Card>
            <Card.Grid
              style={{
                flex: "1 1 50%",
                padding: 0,
              }}
            >
              <video
                ref={videoRef}
                controls
                autoPlay
                muted
                style={{ width: "100%", minHeight: "50vh", maxHeight: "60vh" }}
              >
                Your browser does not support the video tag.
              </video>
            </Card.Grid>
            <Card.Grid
              style={{
                flex: "1 1 auto",
                padding: 0,
              }}
            >
              <Card
                style={{ height: "100%" }}
                styles={{
                  body: {
                    // flexDirection: "column",
                    height: "100%",
                    // flexWrap: "nowrap",
                  },
                }}
              >
                {isSaving.map((e, i) => (
                  <Card.Grid style={gridStyle} hoverable={false}>
                    {images && images[i] && (
                      <Image
                        src={images[i]}
                        alt="image"
                        preview={false}
                        style={{
                          width: "100%",
                          height: "100px",
                          overflow: "hidden",
                          objectFit: "cover",
                          zIndex: 1,
                          borderRadius: "5px",
                          border: "1px solid #303030",
                        }}
                      />
                    )}

                    <Button
                      style={{
                        position: "absolute",
                        bottom: 10,
                      }}
                      onClick={() => capture(i)}
                      loading={e}
                      disabled={images?.length < i || !property?.buildLabel}
                      type="primary"
                      danger
                    >
                      Capture
                    </Button>
                  </Card.Grid>
                ))}
              </Card>
            </Card.Grid>
          </Card>
          <Descriptions
            bordered
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
              {
                key: "jig",
                label: "Jig Status",
                children: (
                  <Row justify={"space-between"}>
                    <Col>
                      {property?.plcData ? (
                        <Tag color="green">Arrived</Tag>
                      ) : (
                        <Tag color="yellow">Waiting to arrive</Tag>
                      )}
                    </Col>
                    <Col>
                      <Space>
                        <Tooltip
                          placement="left"
                          title="Move without taking photos"
                        >
                          <Button
                            disabled={images?.length >= 1}
                            onClick={completeService}
                          >
                            Bypass
                          </Button>
                        </Tooltip>
                        <Button
                          disabled={!images?.length >= 1}
                          type="primary"
                          onClick={completeService}
                        >
                          Submit
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                ),
              },
            ]}
            layout="horizontal"
            size="small"
          />
        </Col>

        <Col span={24}>
          {property.errorMessage && (
            <Alert
              className="blink-section"
              type="error"
              message={property.errorMessage}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CameraStation;
