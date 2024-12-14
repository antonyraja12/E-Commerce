import { Button, Col, Divider, Flex, Row, Tag } from "antd";
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect } from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import DigitalWorkInstructionExcelUploadService from "../../../services/digital-work-instruction-service/dwi-excel-upload-service";
import { MdDragIndicator } from "react-icons/md";

function DwiDragDropListForExcel(props) {
  const service = new DigitalWorkInstructionExcelUploadService();
  const {
    labelData,
    dropDownData,
    modeName,
    id,
    handleCurrentDecrease,
    handleCurrentIncrease,
  } = props;
  const [sourceData, setSource] = useState([]);
  const [destinationData, setDestination] = useState([]);
  useEffect(() => {
    let sd = dropDownData.sort((a, b) => a.value - b.value).map((e) => e.label);
    setSource(sd);

    let dd = labelData.map((e) => ({
      key: e.key,
      label: e.label,
      index: e.index,
    }));
    setDestination(dd);
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
      dest[i].index = source.index;
      setDestination(dest);
    }
  };

  const removeBinding = (index) => {
    let dest = destinationData;
    dest[index].index = null;
    setDestination(dest);

    // source table re-render
    let updatedSourceData = [...sourceData];
    updatedSourceData[dest[index].index] = null;
    setSource(updatedSourceData.filter((item) => item !== null));
  };
  const checkBinding = (index) => {
    let a = destinationData.findIndex((e) => e.index === index);
    return a !== -1;
  };

  return (
    <div className="App">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div>
          <Row
            justify="end"
            style={{ height: "70vh", display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                display: "flex",
                flex: "1",
                columnGap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <Col lg={8}>
                <Droppable droppableId="source">
                  {(droppableProvided) => (
                    <table
                      style={{ width: "100%" }}
                      {...droppableProvided.droppableProps}
                      ref={droppableProvided.innerRef}
                    >
                      <div
                        style={{
                          backgroundColor: "#233E7F",
                          color: "#FFFFFF",
                          borderRadius: "8px",
                          padding: "10px",
                          marginBottom: "10px",
                          textAlign: "center",
                          fontWeight: "600",
                        }}
                      >
                        Headers
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          rowGap: "10px",
                          columnGap: "5px",
                        }}
                      >
                        {sourceData.map((row, index) => (
                          <div style={{ flex: "1" }}>
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
                                      style={{
                                        display: "flex",
                                        marginRight: "0px",
                                        fontSize: "16px",
                                        padding: "10px",
                                        rowGap: "10px",
                                      }}
                                    >
                                      {row}
                                    </Tag>
                                  ) : (
                                    <Tag
                                      style={{
                                        display: "flex",
                                        marginRight: "0px",
                                        fontSize: "16px",
                                        padding: "8px 10px",
                                        rowGap: "10px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          paddingTop: "3px",
                                          paddingRight: "5px",
                                        }}
                                      >
                                        <MdDragIndicator />
                                      </div>
                                      {row}
                                    </Tag>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          </div>
                        ))}
                      </div>
                    </table>
                  )}
                </Droppable>
              </Col>
              <Col style={{ flex: "1" }}>
                <Droppable droppableId="destination">
                  {(droppableProvided) => (
                    <table
                      className="table"
                      {...droppableProvided.droppableProps}
                      ref={droppableProvided.innerRef}
                    >
                      <div
                        style={{
                          backgroundColor: "#233E7F",
                          color: "#FFFFFF",
                          borderRadius: "8px",
                          padding: "10px",
                          textAlign: "center",
                          fontWeight: "600",
                        }}
                      >
                        Data
                      </div>
                      {destinationData.map((row, index) => (
                        <div>
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
                                style={{ display: "flex" }}
                              >
                                {row.index == null && (
                                  <div
                                    style={{
                                      color: "#B6B6B6",
                                      padding: "7px 10px",
                                      border: "dotted #B6B6B6 1px",
                                      marginTop: "10px",
                                      borderRadius: "8px",
                                      width: "100%",
                                      fontSize: "16px",
                                      textAlign: "center",
                                      borderRadius: "8px",
                                    }}
                                  >
                                    {row.label}
                                  </div>
                                )}
                                {row.index != null && (
                                  <Tag
                                    style={{
                                      color: "#000000",
                                      padding: "8px 10px",
                                      border: "dotted #B6B6B6 1px",
                                      marginTop: "10px",
                                      borderRadius: "8px",
                                      width: "100%",
                                      fontSize: "16px",
                                      display: "flex",
                                      justifyContent: "space-between",
                                      marginRight: "0px",
                                      backgroundColor: "#B6B6B6",
                                    }}
                                    closable
                                    onClose={() => removeBinding(index)}
                                  >
                                    <div
                                      style={{
                                        paddingTop: "3px",
                                        paddingRight: "5px",
                                      }}
                                    >
                                      <MdDragIndicator />
                                    </div>{" "}
                                    {sourceData[row.index]}
                                  </Tag>
                                )}
                              </div>
                            )}
                          </Draggable>
                        </div>
                      ))}
                    </table>
                  )}
                </Droppable>
              </Col>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Col>
                <Button
                  onClick={() => {
                    handleCurrentDecrease();
                  }}
                >
                  Back
                </Button>
              </Col>
              <Col>
                <Button onClick={uploadPreviewData} type="primary">
                  Next
                </Button>
              </Col>
            </div>
          </Row>
        </div>
      </DragDropContext>
    </div>
  );
}

export default DwiDragDropListForExcel;
