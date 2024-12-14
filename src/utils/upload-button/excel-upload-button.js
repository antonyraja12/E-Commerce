import React from "react";
import { Modal, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

class ExcelUploadButton extends React.Component {
  state = {
    visible: false,
    fileList: [],
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      fileList: [],
    });
  };

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    formData.append("file", fileList[0]);

    // Upload logic here using formData
    // ...

    message.success("File uploaded successfully");
    this.setState({
      visible: false,
      fileList: [],
    });
  };

  handleUploadChange = (info) => {
    let fileList = [...info.fileList];

    // Limit number of uploaded files
    fileList = fileList.slice(-1);

    this.setState({ fileList });
    if (info.file.status !== "uploading") {
      // console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed`);
    }
  };

  render() {
    const { visible, fileList } = this.state;
    const uploadProps = {
      name: "file",
      accept: ".xlsx, .xls",
      action: "http://your_upload_endpoint",
      fileList,
      onChange: this.handleUploadChange,
      showUploadList: false,
    };

    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          <UploadOutlined />
        </Button>
        <Modal
          title="Upload Excel Sheet"
          visible={visible}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              disabled={fileList.length === 0}
              loading={false}
              onClick={this.handleUpload}
            >
              Upload
            </Button>,
          ]}
        >
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Modal>
      </div>
    );
  }
}

export default ExcelUploadButton;
