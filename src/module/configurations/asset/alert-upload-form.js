import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Modal, Upload, Form, Spin } from "antd";
import { useState } from "react";
import UploadDownloadService from "../../../services/upload-download-service";

function UploadTemplate(props) {
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const service = new UploadDownloadService();

  const beforeUpload = (file) => {
    setFile(file);
  };

  const upload = () => {
    setLoading(true);
    service
      .alertUpload(file, props.assetId)
      .then(({ data }) => {
        if (data?.success) {
          message.success(data.message);
          closePopup();
          props.list();
        } else message.error(data.message);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
    return false;
  };
  const closePopup = () => {
    setOpen(false);
  };

  const openPopup = () => {
    setOpen(true);
  };
  return (
    <>
      <Modal
        open={open}
        title="Upload File"
        destroyOnClose
        okText="Upload"
        onOk={upload}
        onCancel={closePopup}
      >
        <br />
        <Spin spinning={isLoading}>
          <Form>
            <Form.Item label="CSV File">
              <Upload beforeUpload={beforeUpload}>
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
      {/* <UploadButton onClick={openPopup} /> */}
      <Button icon={<UploadOutlined />} onClick={openPopup}></Button>
    </>
  );
}

export default UploadTemplate;
