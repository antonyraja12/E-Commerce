import React, { useState } from "react";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Upload } from "antd";
import DigitalWorkInstructionExcelUploadService from "../../../services/digital-work-instruction-service/dwi-excel-upload-service";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ImageUploadButton = (props) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  const service = new DigitalWorkInstructionExcelUploadService();

  const handleCancel = () => setPreviewOpen(false);
  const { taskId } = props;

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = (info) => {
    let fileList = [...info.fileList];

    fileList = fileList.slice(-1);

    setFileList(fileList);
  };

  const beforeUpload = async (file) => {
    setFileList([file]);
    try {
      const response = await service.imageUpload(file, taskId);
      // console.log("hit", response);
    } catch (error) {
      console.error("Error during upload:", error);
    }
    return true; // Returning false to prevent automatic upload by Ant Design Upload component
  };

  return (
    <>
      <Upload
        listType="picture"
        fileList={fileList}
        beforeUpload={beforeUpload}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 1 ? null : (
          <Button icon={<UploadOutlined />}>Upload</Button>
        )}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default ImageUploadButton;
