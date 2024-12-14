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
// import DragDropList from "../common/drag-drop-list";
// import PreviewPage from "./preview-page-drag-drop";
import { useNavigate } from "react-router-dom";
import AssetUploadPreview from "./asset-upload-perview";
import AssetService from "../../../services/asset-service";
import { withRouter } from "../../../utils/with-router";
import { withAuthorization } from "../../../utils/with-authorization";

const { Option } = Select;
const { Step } = Steps;

function AssetUpload(props) {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [destinationData, setDestinationData] = useState([]);
  const [current, setCurrent] = useState(0);
  const [file, setFile] = useState(null);
  const [labelData, setLabelData] = useState([]);
  const [dropDownData, setDropDownData] = useState();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [id, setId] = useState();
  const [data, setData] = useState([]);
  const [isModalOpen, setModelOpen] = useState(false);
  const service = new AssetService();
  const name = "Asset ";
  const downloadExcelFile = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = "/Asset_Bulk_Upload_ByteFactory.xlsx";
    downloadLink.download = "Asset_Bulk_Upload_ByteFactory.xlsx";
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

  const loadTable = () => {
    props.list();
  };
  const onRemoveFile = () => {
    setFile(null);
    setFileUploaded(false);
  };
  const column = [
    {
      title: "Required field",
      dataIndex: "requiredField",
      key: "Required field",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "Description",
    },
    {
      title: "Sample Data",
      dataIndex: "sampleData",
      key: "Sample Data",
    },
  ];

  const information = [
    {
      key: 1,
      requiredField: "Asset Library ",
      description: "This column should contain the name of the Asset Library",
      sampleData: "40mmAssemblyLine",
    },
    {
      key: 2,
      requiredField: "Parameters",
      description: "Name of the parameter avoid white space in parameter name ",
      sampleData: "Temprature",
    },
    {
      key: 3,
      requiredField: "Display Name",
      description: "Display name is Representing the name of parameters",
      sampleData: "Temprature",
    },
    {
      key: 4,
      requiredField: "DataType",
      description: "Parameter type it can be  Number ,Boolean Or String ",
      sampleData: " Number",
    },
  ];

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
          <AssetUploadPreview
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
        // console.log("res", response);
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
      {props.access[0]?.length ? (
        <Spin spinning={isLoading}>
          <br></br>
          <Steps progressDot current={current} labelPlacement="vertical">
            <Step title="Upload File" />
            {/* <Step title="Select Data" /> */}
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
            <Table columns={column} dataSource={information} />
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

export default withRouter(withAuthorization(AssetUpload));
