import { DownloadOutlined, InboxOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Row,
  Select,
  Spin,
  Steps,
  Tooltip,
  Upload,
  message,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SchedulerService from "../../../services/preventive-maintenance-services/scheduler-service";
import SchedulerPreviewPage from "./scheduler-preview-page";

const { Option } = Select;
const { Step } = Steps;

function SchedluerUpload(props) {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const service = new SchedulerService();
  const name = "scheduler";
  const downloadExcelFile = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = "/Scheduler_Excel_ByteFactory.xlsx";
    downloadLink.download = "Scheduler_Excel_ByteFactory.xlsx";
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
              <Button onClick={uploadFileScheduler} type="primary">
                Upload
              </Button>
            </Col>
          </Row>
        );

      case 1:
        return (
          <SchedulerPreviewPage
            data={data}
            file={file}
            handleCurrentDecrease={handleCurrentDecrease}
          />
        );
      default:
        return <></>;
    }
  };

  const beforeUpload = (file) => {
    setFile(file);
    return false;
  };

  const uploadFileScheduler = () => {
    if (file !== null) {
      service.schedulerUploadPreview(file).then((response) => {
        if (response.data?.success) {
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

  const DescriptionColumn = [
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
  const DescriptionData = [
    {
      key: 1,
      requiredField: "Asset Name",
      description: "Kindly Check the Asset already Exists or Not",
      sampleData: "CMA_MAC_123",
    },
    {
      key: 2,
      requiredField: "Check List Name",
      description: "Check list Should be a Existing One Enter Correctly",
      sampleData: "Daily-routine-checklist",
    },
    {
      key: 3,
      requiredField: "Frequency",
      description: "Scheduler Frequency",
      sampleData: "Daily,Weekly",
    },
    {
      key: 4,
      requiredField: "Assigned To",
      description:
        "The user name who will assign the task should appear in this column.",
      sampleData: "Administrator",
    },
    {
      key: 5,
      requiredField: "Start Date",
      description: "This Column will schedule the event from the date",
      sampleData: "26/04/2024",
    },
    {
      key: 6,
      requiredField: "End Date",
      description:
        "This Column will schedule the event from start date to end Date",
      sampleData: "28/04/2024",
    },
    {
      key: 7,
      requiredField: "Start Time",
      description: "Enter the Time 24 hrs Format",
      sampleData: "23:00:00	",
    },
    {
      key: 8,
      requiredField: "End Time",
      description: "Enter the Time 24 hrs Format",
      sampleData: "23:30:00	",
    },
    {
      key: 9,
      requiredField: "Description",
      description: "Description Related to The Scheduled Checklist",
      sampleData: "Check the lubrication level in Daily Routine",
    },
  ];

  return (
    <>
      <Spin spinning={isLoading}>
        <br></br>
        <Steps progressDot current={current} labelPlacement="vertical">
          <Step title="Upload File" />
          <Step title="Preview" />
        </Steps>
        <Divider />
        <Card>{renderContent()}</Card>
      </Spin>
    </>
  );
}

export default SchedluerUpload;
