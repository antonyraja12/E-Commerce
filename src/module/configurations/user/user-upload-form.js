import {
  DownloadOutlined,
  InboxOutlined,
  InfoCircleTwoTone,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Modal,
  Row,
  Select,
  Spin,
  Steps,
  Table,
  Tooltip,
  Upload,
  message,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserUploadPreview from "./user-upload-perview";
import UserService from "../../../services/user-service";

const { Option } = Select;
const { Step } = Steps;

function UserUpload(props) {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [destinationData, setDestinationData] = useState([]);
  const [current, setCurrent] = useState(0);
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [data, setData] = useState([]);
  const service = new UserService();
  const downloadExcelFile = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = "/User_Bulk_Upload_ByteFactory.xlsx";
    downloadLink.download = "User_Bulk_Upload_ByteFactory.xlsx";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  const propsUpload = {
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };
  const onRemoveFile = () => {
    setFile(null);
    setFileUploaded(false);
  };

  const renderContent = () => {
    switch (current) {
      case 0:
        return (
          <Row justify="end" gutter={[10, 10]}>
            <Col span={24}>
              <p
                style={{
                  color: "#FF004D",
                  fontSize: "15px",
                  fontWeight: "500",
                }}
              >
                Note: Only .xlsx files are supported. Click to download a sample
                sheet.
                <Tooltip placement="top" title="Sample Template">
                  <Button
                    type="link"
                    onClick={downloadExcelFile}
                    icon={<DownloadOutlined />}
                  />
                </Tooltip>
              </p>
              <Form>
                <Form.Item label="Select File">
                  <Upload.Dragger
                    beforeUpload={beforeUpload}
                    accept=".xlsx"
                    {...propsUpload}
                    listType="picture"
                    // disabled={fileUploaded}
                    onRemove={onRemoveFile}
                    fileList={file ? [file] : []} // Provide the fileList prop to show the uploaded file
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                      Support for a single or bulk upload.
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              </Form>
            </Col>
            <Col>
              <Button onClick={() => navigate("..")}>Cancel</Button>
            </Col>
            <Col justify="end">
              <Button onClick={uploadFile} type="primary">
                Upload
              </Button>
            </Col>
          </Row>
        );
      case 1:
        return (
          <UserUploadPreview
            data={data}
            handleCurrentDecrease={handleCurrentDecrease}
            file={file}
            // id={id}
          />
        );
      default:
        return <></>;
    }
  };

  const beforeUpload = (file) => {
    if (fileUploaded) {
      message.error("You can only upload one file at a time.");
      return false;
    }
    setFile(file);
    setFileUploaded(true);
    return false;
  };

  const uploadFile = () => {
    if (file !== null) {
      service.uploadPreview(file).then((response) => {
        if (response.data) {
          setData(response.data.data);
          message.success(response.data?.message);
          setCurrent(1);
        } else {
          message.error(response.data?.message);
        }
      });
    } else {
      message.error("Please Select The File");
    }
  };

  const handleCurrentDecrease = () => {
    setCurrent((prevCurrent) => prevCurrent - 1);
  };

  const handleCurrentIncrease = (data, destinationData) => {
    setCurrent((prevCurrent) => prevCurrent + 1);
    setData(data);
    setDestinationData(destinationData);
  };
  // console.log("data", data);
  return (
    <>
      <Spin spinning={isLoading}>
        <br></br>
        <Steps progressDot current={current} labelPlacement="vertical">
          <Step title="Upload File" />
          {/* <Step title="Select Data" /> */}
          <Step title="Preview" />
        </Steps>
        <Divider />
        <Card>{renderContent()}</Card>
      </Spin>
    </>
  );
}

export default UserUpload;
