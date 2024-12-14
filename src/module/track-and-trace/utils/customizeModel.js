import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Modal, Upload } from "antd";
import { useState } from "react";

const CustomizeModel = ({
  isModalVisible,
  setIsModalVisible,
  handleUpload,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  //   const { isModalVisible, setIsModalVisible, handleUpload } = props;
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    return false; // Prevent the automatic upload
  };
  const handleRemove = () => {
    setSelectedFile(null); // Remove the selected file
  };
  const handleSave = async () => {
    if (selectedFile) {
      await handleUpload(selectedFile); // Upload the file when "Save" is clicked
      setSelectedFile(null); // Reset the selected file after upload
      setIsModalVisible(false);
    } else {
      message.error("Please select a file before saving");
    }
  };
  return (
    <>
      <Modal
        title="Upload File"
        visible={isModalVisible}
        footer={[
          <Button
            key="cancel"
            // icon={<CancelOutlined />}
            onClick={() => {
              setIsModalVisible(false);
              handleRemove();
            }}
          >
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
        onCancel={() => {
          setIsModalVisible(false);
          handleRemove();
        }}
      >
        <Upload
          beforeUpload={handleFileSelect}
          // showUploadList={false}
          multiple={false}
          maxCount={1} // Limit to only one file
          accept=".xlsx, .xls"
          listType="picture"
          onRemove={handleRemove}
          fileList={selectedFile ? [selectedFile] : []}
        >
          <Button icon={<UploadOutlined />}>Select File</Button>

          {/* <Button icon={<UploadOutlined />}>Select File</Button> */}
        </Upload>
      </Modal>
    </>
  );
};
export default CustomizeModel;
