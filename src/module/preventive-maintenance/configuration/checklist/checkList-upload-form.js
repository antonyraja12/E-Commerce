import {
  DownloadOutlined,
  InboxOutlined,
  InfoCircleOutlined,
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
  Space,
  Spin,
  Steps,
  Table,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadDownloadService from "../../../../services/upload-download-service";
import DragDropList from "../common/drag-drop-list";
import PreviewPage from "./preview-page-drag-drop";

const { Option } = Select;
const { Step } = Steps;

function ChecklistUpload(props) {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [destinationData, setDestinationData] = useState([]);
  const [current, setCurrent] = useState(0);
  const [file, setFile] = useState(null);
  const [labelData, setLabelData] = useState([]);
  const [dropDownData, setDropDownData] = useState();
  const [id, setId] = useState();
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const service = new UploadDownloadService();
  const name = "checkList";
  const downloadExcelFile = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = "/Checklist_Bulk_Upload_ByteFactory.xlsx";
    downloadLink.download = "Checklist_Bulk_Upload_ByteFactory.xlsx";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  const labelDataFunc = () => {
    service.template().then((response) => {
      setLabelData(response.data);
    });
  };

  useEffect(() => {
    labelDataFunc();
  }, []);

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
      requiredField: "Assets",
      description: "This column should contain the name of the assets",
      sampleData: "Amada Punching",
    },
    {
      key: 2,
      requiredField: "Checktype",
      description:
        "Use this column to specify the type of check to be performed",
      sampleData: "Cleaning",
    },
    {
      key: 3,
      requiredField: "Checks",
      description:
        "Enter details about the specific checks or inspections to be conducted",
      sampleData: "Lubrication Checks",
    },
    {
      key: 4,
      requiredField: "Checks Description",
      description:
        "Provide descriptions or additional information related to each check",
      sampleData: " Check the Oil level of the and Quality of  the oil",
    },
    {
      key: 5,
      requiredField: "Checklist ",
      description:
        "Specify the name or title of the checklist associated with the checks",
      sampleData: " Monthly Checklist",
    },
    {
      key: 6,
      requiredField: "Checklist Description",
      description:
        "Include any relevant descriptions or instructions pertaining to the checklist",
      sampleData: " Montly Checklist ",
    },
  ];

  const renderContent = () => {
    switch (current) {
      case 0:
        return (
          <>
            <Row justify="" gutter={[10, 10]}>
              <Col span={24}>
                <Typography.Text style={{ color: "" }}>
                  <p
                    style={{
                      color: "#FF004D",
                      fontSize: "15px",
                      fontWeight: "500",
                    }}
                  >
                    Note: Only .xlsx files are supported. Click to download a
                    sample sheet.
                    <Tooltip placement="top" title="Sample Template">
                      <Button
                        type="link"
                        onClick={downloadExcelFile}
                        icon={<DownloadOutlined />}
                      />
                    </Tooltip>
                  </p>
                </Typography.Text>
                <Space />
                <Form>
                  <Form.Item label={<>Select File</>}>
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
            </Row>
            <Row justify={""} gutter={[10, 10]}>
              <Col sm={2}></Col>
              <Col sm={18}>
                {" "}
                <Button
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                  hidden
                  icon={<InfoCircleOutlined />}
                  // style={{ marginLeft: "9%" }}
                >
                  {" "}
                  Info{" "}
                </Button>
              </Col>
              <Col sm={2}>
                <Button onClick={() => navigate("..")}>Cancel</Button>
              </Col>
              <Col sm={2}>
                <Button onClick={uploadFile} type="primary">
                  Upload
                </Button>
              </Col>
            </Row>
          </>
        );
      case 1:
        return (
          <DragDropList
            dropDownData={dropDownData}
            closePopup={handleCurrentDecrease}
            labelData={labelData}
            handleCurrentDecrease={handleCurrentDecrease}
            id={id}
            handleCurrentIncrease={handleCurrentIncrease}
            loadTable={loadTable}
          />
        );
      case 2:
        return (
          <PreviewPage
            modeName={name}
            data={data}
            destinationData={destinationData}
            handleCurrentDecrease={handleCurrentDecrease}
            id={id}
          />
        );
      default:
        return <></>;
    }
  };

  const beforeUpload = (file) => {
    setFile(file);
  };

  const uploadFile = () => {
    if (file !== null) {
      service.uploadFile(file).then((response) => {
        if (response.data?.success) {
          setDropDownData(
            response.data?.data?.header?.map((e) => ({
              value: e.index,
              label: e.key,
              id: e.id,
            }))
          );
          setId(response.data?.data?.id);
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

  return (
    <>
      <Spin spinning={isLoading}>
        <br></br>
        <Steps progressDot current={current} labelPlacement="vertical">
          <Step title="Upload File" />
          <Step title="Select Data" />
          <Step title="Preview" />
        </Steps>
        <Divider />
        <Card>{renderContent()}</Card>
      </Spin>
      <Modal
        title="Required Information"
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        width={800}
      >
        <Table columns={column} dataSource={information} />
      </Modal>
    </>
  );
}

export default ChecklistUpload;
