import React, { Component } from "react";
import { Col, Row, Steps, Form, Upload, Button, message } from "antd";
import Page from "../../../utils/page/page";
import WorkInstructionFrom from "../configuration/digital-work-instruction-config/work-instruction-details-form";
import DigitalWorkInstructionExcelUploadService from "../../../services/digital-work-instruction-service/dwi-excel-upload-service";
import DwiDragDropListForExcel from "./wi-excel-upload-drag-and-drop";
import ExcelUploadPreviewPage from "./excel-upload-preview-page";
import ImageUploadList from "./image-upload-list";

class DwiExcelUplaodStepper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: 0,
      isLoading: 0,
      file: null,
      dropDownData: null,
      labelData: [],
      id: null,
      workInstructionId: null,
      data: [],
      destinationData: [],
      dataForImageUpload: {},
    };

    this.service = new DigitalWorkInstructionExcelUploadService();
    this.name = "checkList";

    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.beforeUpload = this.beforeUpload.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  labelDataFunc = () => {
    this.service.template().then((response) => {
      this.setState({ labelData: response.data });
    });
  };

  componentDidMount() {
    this.labelDataFunc();
  }

  beforeUpload(file) {
    this.setState({ file });
  }

  uploadFile() {
    const { file } = this.state;

    if (file !== null) {
      this.service.uploadFile(file).then((response) => {
        if (response.data?.success) {
          this.setState({
            dropDownData: response.data?.data?.header?.map((e) => ({
              value: e.index,
              label: e.key,
              id: e.id,
            })),
            id: response.data?.data?.id,
          });
          message.success(response.data?.message);
          this.setState({ current: 2 });
        } else {
          message.error(response.data?.message);
        }
      });
    } else {
      message.error("Please Select The File");
    }
  }

  next(id) {
    if (id) {
      this.setState({ ...this.state, workInstructionId: id });
    }
    this.setState({ current: this.state.current + 1 });
  }

  prev() {
    this.setState({ current: this.state.current - 1 });
  }

  loadTable = () => {
    this.service.list();
  };

  handleCurrentIncrease = (data, destinationData) => {
    this.setState({ data: data });
    this.setState({ destinationData: destinationData });
    this.next();
  };

  moveToUploadImagePage = (data) => {
    this.setState({ dataForImageUpload: data.data });
    this.next();
  };

  renderContent() {
    const { current } = this.state;

    switch (current) {
      case 0:
        return <WorkInstructionFrom next={this.next} />;
      case 1:
        return (
          <div>
            {/* {console.log(
              "image upload workInstructionId",
              this.state.workInstructionId
            )} */}
            <div>Excel Upload</div>
            <hr />
            <Row next={this.next} justify="end" gutter={[10, 10]}>
              <Col span={24}>
                <Form>
                  <Form.Item>
                    <Upload.Dragger
                      beforeUpload={this.beforeUpload}
                      accept=".xlsx"
                      listType="picture"
                      multiple={false}
                      style={{
                        backgroundColor: "white",
                        borderColor: "#D6D6D6",
                        borderStyle: "dashed",
                        borderWidth: "2px",
                      }}
                    >
                      <p className="ant-upload-drag-icon">
                        <img
                          src="/excel_upload_image.png"
                          alt="excel_upload_image"
                        />
                      </p>
                      <p style={{ fontWeight: "600", fontSize: "16px" }}>
                        Drag or select file to upload
                      </p>
                      <p
                        style={{
                          color: "#C0C0C0",
                          fontSize: "12px",
                          fontWeight: "400",
                        }}
                      >
                        Support for a single or bulk upload. Strictly prohibit
                        from
                        <br />
                        uploading company data or other band files
                      </p>
                    </Upload.Dragger>
                  </Form.Item>
                </Form>
              </Col>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Col justify="end">
                  <Button
                    onClick={() => {
                      this.setState({ ...this.state, current: 0 });
                    }}
                  >
                    Back
                  </Button>
                </Col>
                <Col justify="end">
                  <Button onClick={this.uploadFile} type="primary">
                    Next
                  </Button>
                </Col>
              </div>
            </Row>
          </div>
        );
      case 2:
        return (
          <div>
            <div>Excel Upload</div>
            <hr />
            <DwiDragDropListForExcel
              dropDownData={this.state.dropDownData}
              closePopup={this.prev}
              labelData={this.state.labelData}
              handleCurrentDecrease={this.prev}
              id={this.state.id}
              handleCurrentIncrease={this.handleCurrentIncrease}
              loadTable={this.loadTable}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <div>Excel Upload</div>
            <hr />
            <ExcelUploadPreviewPage
              modeName={this.state.name}
              data={this.state.data}
              destinationData={this.state.destinationData}
              handleCurrentDecrease={this.prev}
              id={this.state.id}
              workInstructionId={this.state.workInstructionId}
              moveToUploadImagePage={this.moveToUploadImagePage}
            />
          </div>
        );
      case 4:
        return (
          <ImageUploadList
            dataForImageUpload={this.state.dataForImageUpload}
            handleCurrentIncrease={this.next}
          />
        );
      default:
    }
  }

  render() {
    const { current } = this.state;
    const { Step } = Steps;

    return (
      <>
        <Page title="Digital Work Instruction">
          <br />
          <Row justify="center" gutter={[10, 10]}>
            <Col span={5}>
              <Steps
                style={{ height: "70vh", color: "#FFFFFF" }}
                current={current}
                direction="vertical"
                labelPlacement="horizontal"
                size="large"
                items={[
                  {
                    title: "Create New WI",
                  },
                  {
                    title: "Upload Excel",
                  },
                  {
                    title: "Map Data",
                  },
                  {
                    title: "Preview",
                  },

                  {
                    title: "Upload Image",
                  },
                ]}
              ></Steps>
            </Col>
            <Col span={18}>{this.renderContent()}</Col>
          </Row>
        </Page>
      </>
    );
  }
}

export default DwiExcelUplaodStepper;
