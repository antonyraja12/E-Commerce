import React, { useState } from "react";
import { Button, Table } from "antd";
import ImageUploadButton from "./image-upload-button";

const ImageUploadList = (props) => {
  const { dataForImageUpload, handleCurrentIncrease } = props;
  const removeDuplicates = (array, property) => {
    const uniqueSet = new Set();

    return array.filter((item) => {
      const key = item["taskId"];
      if (!uniqueSet.has(key)) {
        uniqueSet.add(key);
        return true;
      }
      return false;
    });
  };

  let resultArray = removeDuplicates(dataForImageUpload.data);

  const columns = [
    {
      title: "S.No.",
      dataIndex: "sno",
      align: "center",
      width: 50,
      render: (text, record, index) => index + 1,
    },
    {
      title: "Task Name",
      dataIndex: "taskName",
      align: "center",
      width: 100,
    },
    {
      title: "Action",
      dataIndex: "taskId",
      align: "center",
      width: 100,
      render: (value) => <ImageUploadButton taskId={value} />,
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={resultArray} />
      <div style={{ width: "100%", textAlign: "end" }}>
        <Button onClick={handleCurrentIncrease} type="primary">
          Next
        </Button>
      </div>
    </div>
  );
};
export default ImageUploadList;
