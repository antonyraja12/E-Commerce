import { Button, Card, Col, Divider, Form, Row, Tag, message } from "antd";
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import UploadDownloadService from "../../../../services/upload-download-service";
import { useEffect } from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const service = new UploadDownloadService();

function DragDropList(props) {
  const navigate = useNavigate();
  const {
    labelData,
    dropDownData,
    closePopup,
    modeName,
    id,
    handleCurrentDecrease,
    handleCurrentIncrease,
  } = props;
  const [sourceData, setSource] = useState([]);
  const [destinationData, setDestination] = useState([]);
  const labelDataFunc = () => {
    service.template(modeName).then((response) => {});
  };
  useEffect(() => {
    labelDataFunc();
    let sd = dropDownData.sort((a, b) => a.value - b.value).map((e) => e.label);
    setSource(sd);

    let dd = labelData.map((e) => ({
      key: e.key,
      label: e.label,
      index: e.index,
    }));
    setDestination(dd);
    // console.log(dd);
  }, []);

  const uploadPreviewData = () => {
    const jsonStr = destinationData?.map((e) => ({
      key: e.key,
      index: e.index.toString(),
      label: e.label,
    }));
    service.uploadDataPreview(id, jsonStr, modeName).then((response) => {
      handleCurrentIncrease(response.data?.data, jsonStr);
    });
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (
      source.droppableId == "source" &&
      destination.droppableId == "destination"
    ) {
      let i = destination.index;
      let dest = destinationData;
      // console.log("b", dest[i].index);
      dest[i].index = source.index;
      // console.log("a", dest[i].index);
      setDestination(dest);
    }
    // console.log(source, destination);
  };

  const removeBinding = (index) => {
    let dest = destinationData;
    dest[index].index = null;
    setDestination(dest);
  };
  const checkBinding = (index) => {
    let a = destinationData.findIndex((e) => e.index === index);
    return a !== -1;
  };

  return (
    <div className="App">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="table-container">
          <Row gutter={[10, 10]} justify="end">
            <Col lg={8}>
              <Droppable droppableId="source">
                {(droppableProvided) => (
                  <table
                    style={{ backgroundColor: "#fbfbfbfa" }}
                    className="table"
                    {...droppableProvided.droppableProps}
                    ref={droppableProvided.innerRef}
                  >
                    <thead>
                      <tr>
                        <th>Headers</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sourceData.map((row, index) => (
                        <tr>
                          <td>
                            <Draggable
                              key={`s${index}`}
                              draggableId={`s${index}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={
                                    snapshot.isDragging ? "dragging" : ""
                                  }
                                >
                                  {checkBinding(index) ? (
                                    <Tag
                                      icon={<CheckCircleOutlined />}
                                      color="success"
                                    >
                                      {row}
                                    </Tag>
                                  ) : (
                                    <Tag>{row}</Tag>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Droppable>
            </Col>
            <Col lg={1}>
              <Divider style={{ height: "100%" }} type="vertical" />
            </Col>
            <Col lg={15}>
              <Droppable droppableId="destination">
                {(droppableProvided) => (
                  <table
                    className="table"
                    {...droppableProvided.droppableProps}
                    ref={droppableProvided.innerRef}
                  >
                    <thead>
                      <tr>
                        <th width="50%">Columns</th>
                        <th>Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {destinationData.map((row, index) => (
                        // console.log("ind", row),
                        <tr>
                          <td>{row.label}</td>
                          <td>
                            <Draggable
                              key={`d${index}`}
                              draggableId={`d${index}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={
                                    snapshot.isDragging ? "dragging" : ""
                                  }
                                >
                                  {row.index != null && (
                                    <Tag
                                      closable
                                      onClose={() => removeBinding(index)}
                                    >
                                      {sourceData[row.index]}
                                    </Tag>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Droppable>
            </Col>
            <Col justify="end">
              <Button
                onClick={() => {
                  handleCurrentDecrease();
                }}
                type="primary"
              >
                Cancel
              </Button>
            </Col>
            <Col justify="end">
              <Button onClick={uploadPreviewData} type="primary">
                Submit
              </Button>
            </Col>
          </Row>
        </div>
      </DragDropContext>
    </div>
  );
}

export default DragDropList;
