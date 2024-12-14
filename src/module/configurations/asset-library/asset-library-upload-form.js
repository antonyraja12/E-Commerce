import { DownloadOutlined, InboxOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Modal,
  Result,
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
import AssetLibraryService from "../../../services/asset-library-service";
import { withAuthorization } from "../../../utils/with-authorization";
import { withRouter } from "../../../utils/with-router";
import UploadPreview from "./asset-library-upload-preview";

const { Option } = Select;
const { Step } = Steps;

function AssetLibraryUpload(props) {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [previousFile, setPreviousFile] = useState(null);
  const [destinationData, setDestinationData] = useState([]);
  const [current, setCurrent] = useState(0);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [file, setFile] = useState(null);
  const [labelData, setLabelData] = useState([]);
  const [dropDownData, setDropDownData] = useState();
  const [id, setId] = useState();
  const [data, setData] = useState([]);
  const [isModalOpen, setModelOpen] = useState(false);
  const service = new AssetLibraryService();
  const name = "Asset Library ";

  const downloadExcelFile = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = "/AssetLibrary_Bulk_Upload_ByteFactory.xlsx";
    downloadLink.download = "AssetLibrary_Bulk_Upload_ByteFactory.xlsx";
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

  const handleDeleteFile = () => {
    setFile(null); // Clear the uploaded file
    setFileUploaded(false); // Reset fileUploaded state
  };

  const onRemoveFile = () => {
    setFile(null); // Clear the uploaded file
    setFileUploaded(false); // Reset fileUploaded state
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
                {/* {fileUploaded && (
                  <Form.Item>
                    <Button onClick={handleDeleteFile}>Delete File</Button>
                  </Form.Item>
                )} */}
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
          <UploadPreview
            data={data}
            handleCurrentDecrease={handleCurrentDecrease}
            file={file}
          />
        );
      default:
        return <></>;
    }
  };

  // const beforeUpload = (file) => {
  //   setFile(file);
  //   setFileUploaded(true); // Set fileUploaded to true when a file is uploaded
  //   return false;
  // };

  const beforeUpload = (file) => {
    if (fileUploaded) {
      message.error("You can only upload one file at a time.");
      return false;
    }
    setFile(file);
    setFileUploaded(true); // Set fileUploaded to true when a file is uploaded
    return false;
  };

  const uploadFile = () => {
    if (file !== null) {
      if (previousFile !== null && service.deleteFile) {
        // Check if the deleteFile method is available in the service object
        service.deleteFile(previousFile).then((deleteResponse) => {
          if (deleteResponse.data) {
            // Delete successful, proceed with uploading the new file
            handleUploadFile();
          } else {
            // Handle delete error
            message.error(deleteResponse.data?.message);
          }
        });
      } else {
        // No previous file or deleteFile method, directly upload the new file
        handleUploadFile();
      }
    } else {
      message.error("Please select a file to upload.");
    }
  };

  const handleUploadFile = () => {
    service.uploadPreview(file).then((uploadResponse) => {
      if (uploadResponse.data) {
        // Handle successful upload
        setData(uploadResponse.data.data);
        message.success(uploadResponse.data?.message);
        setCurrent(1); // Assuming setCurrent is a function to update current state
        setPreviousFile(file); // Update the previousFile state to the new file
      } else {
        // Handle upload error
        message.error(uploadResponse.data?.message);
      }
    });
  };

  const handleCurrentDecrease = () => {
    setCurrent((prevCurrent) => prevCurrent - 1);
    handleDeleteFile(); // Call handleDeleteFile to delete the file when going back
  };

  return (
    <>
      {props.access[0]?.length ? (
        <Spin spinning={isLoading}>
          <br></br>
          <Steps progressDot current={current} labelPlacement="vertical">
            <Step title="Upload File" />
            <Step title="Preview" />
          </Steps>
          <Divider />
          <Card>{renderContent()}</Card>
          <Modal
            title="Required Information"
            open={isModalOpen}
            onOk={() => {
              setModelOpen(false);
            }}
            onCancel={() => {
              setModelOpen(false);
            }}
            width={800}
          >
            <Table />
          </Modal>
        </Spin>
      ) : (
        <Result
          status={"403"}
          title="403"
          subTitle="Sorry You are not authorized to access this page"
        />
      )}
    </>
  );
}

export default withRouter(withAuthorization(AssetLibraryUpload));
