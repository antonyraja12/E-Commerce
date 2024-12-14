import { InfoCircleOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Steps,
  Table,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import { Column } from "rc-table";
import { FaFileCircleCheck, FaUpload } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { dateFormat, remoteAsset } from "../../../helpers/url";
import CheckTypeService from "../../../services/preventive-maintenance-services/check-type-service";
import CheckListExecutionService from "../../../services/preventive-maintenance-services/checklist-execution-service";
import ImageUploadService from "../../../services/preventive-maintenance-services/imageupload-checklist-execution";
import PageForm from "../../../utils/page/page-form";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";

const { Text } = Typography;
const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

class CheckListExecutionForm extends PageForm {
  service = new CheckListExecutionService();
  checkTypeService = new CheckTypeService();
  imageUploadService = new ImageUploadService();
  state = {
    //  imageUrl: [],
    fileList: [],
    uploadInstructionVisible: false,
    previewVisible: false,
    previewImage: "",
  };
  title = "Check List Execution";
  saveFn(data) {
    return this.service.add(data);
  }
  onSuccess(data) {
    super.onSuccess(data);
    if (this.state.partialStatus) {
      this.props.navigate("..");
    } else {
      this.props.next();
    }
  }

  componentDidMount() {
    this.checkTypeService.list().then((response) => {
      this.setState((state) => ({
        ...state,
        checkType: response.data?.reduce((c, e) => {
          c[e.checkTypeId] = e.checkTypeName;
          return c;
        }, {}),
      }));
      super.componentDidMount();
      if (this.props.params.id) {
        this.setState(
          (state) => ({
            ...state,
            checkListExecutionId: this.props.params.id,
          }),
          () => {
            this.props.form?.setFieldsValue({
              productDetails: "200 ml",
              checkListExecutionId: this.props.params.id,
            });
          }
        );
        this.onRetrieve(this.props.params.id);
      }
    });
  }

  onFinish1 = (data) => {
    const checkAllStatus = data.checks.map((field) => field.status);
    const isCheckAllSelected = checkAllStatus.some(
      (status) => status === null || status === undefined
    );
    this.setState((state) => ({ ...state, partialStatus: isCheckAllSelected }));
    this.onFinish(data);
  };
  isImage = (file) => {
    const imageTypes = ["image/jpeg", "image/png", "image/gif"]; // Add more image MIME types as needed
    return imageTypes.includes(file.type);
  };
  isSize = (file) => {
    const maxSize = 10 * 1024 * 1024; // 2MB in bytes
    return file.size <= maxSize;
  };
  beforeUpload = (file) => {
    let errorMessages = [];
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    // const uploadedFileNames = new Set(); // Track uploaded file names

    file.forEach((file) => {
      if (!this.isImage(file)) {
        errorMessages.push({
          name: file.name,
          errorMessage: `${file.name} is not a valid image file.`,
        });
      }
      if (file.size > maxSizeInBytes && this.isImage(file)) {
        // Check if size is greater than 2MB
        errorMessages.push({
          name: file.name,
          errorMessage: `${file.name} exceeds the maximum file size of 10MB.`,
        });
      }
    });

    if (errorMessages.length > 0) {
      this.setState({ errorMessage: errorMessages });
    }

    return false;
  };
  handleFileChange = ({ fileList }) => {
    this.setState({ errorMessage: [] });

    this.beforeUpload(fileList);
    const imageFiles = fileList.filter((file) =>
      this.handleRemove
        ? this.isImage(file)
        : this.isImage(file) && this.isSize(file)
    );

    console.log(imageFiles, "imagefile");

    this.setState({ fileList: imageFiles });
  };
  handleRemove = (file) => {
    // Filter out the deleted file from the fileList
    const filteredFileList = this.state.fileList.filter(
      (item) => item.uid !== file.uid
    );
    // Update state with the filtered fileList

    this.setState({ fileList: filteredFileList });
  };
  handlePreview = async (file) => {
    if (file.url) {
      this.setState({
        previewImage: file.url,
        previewVisible: true,
      });
    }
  };
  handlePreviewCancel = () => {
    this.setState({ previewVisible: false });
  };
  imageUpload = () => {
    this.setState({ errorMessage: [] });
    this.imageUploadService
      .image(
        this.state.paramsId,
        // this.state.file,
        this.state.fileList,
        this.props.form?.getFieldValue().checks[this.state.rowindex]
          .checkListExecutionChecksId,
        this.state.remarks,
        this.state.status
      )

      .then((response) => {
        if (response?.data) {
          message.success(response?.data);
          this.handlePopupClose();
          this.setState((state) => ({
            ...state,
          }));

          // this.onRetrieve(this.props.params.id);
        } else {
          message.error(response.data);
        }
      });
  };
  loadList = (v) => {};
  handlePopupOpen = (v, imageUrl) => {
    const urlArray = imageUrl
      ? imageUrl
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url)
      : [];
    const images = urlArray.map((url, index) => ({
      uid: `${index}`,
      name: "Check Image",
      status: "done",
      url: remoteAsset(url),
      type: "image/png",
      path: url,
    }));
    this.setState((state) => ({
      ...state,
      modalOpen: true,
      rowindex: v,
      fileList: images,
      previewFile: false,
      remarks: this.props.form?.getFieldValue().checks[v].remark,
      status: this.props.form?.getFieldValue().checks[v].status,
    }));
    // this.onRetrieve(this.props.params.id);
    var checksId =
      this.props.form?.getFieldValue().checks[v].checkListExecutionChecksId;
    Promise.all([
      this.service.list({ checkListExecutionId: this.state.paramsId }),
    ]).then((response) => {
      this.setState((state) => ({
        ...state,
        // imageUrl: response[0]?.data[0]?.checks[v]?.imageUrl,
        imageUrl: response[0]?.data[0]?.checks[v]?.imageUrl?.split(","),
      }));
      if (response[0]?.data[0]?.checks[v]?.imageUrl == null) {
        if (this.state.file?.name != undefined) {
          this.setState((state) => ({ ...state, imageView: false }));
        }
      } else {
        this.setState((state) => ({ ...state, imageView: true }));
      }
    });
  };

  updateImageurl = (info) => {
    this.setState((state) => ({
      ...state,
      imageUrl: null,
      // file: info.fileList,
    }));

    if (this.state.imageUrl == null) {
      if (this.state.file?.name != undefined) {
        this.setState((state) => ({ ...state, imageView: false }));
      }
    } else {
      this.setState((state) => ({ ...state, imageView: true }));
    }
  };

  handlePopupClose = () => {
    this.setState((state) => ({ ...state, modalOpen: false, fileList: [] }));
    this.onRetrieve(this.props.params.id);
    // this.loadList();
  };
  imageIcon = (v) => {
    return this.state.initialValues?.checks[v].imageUrl !== null ? (
      // <CheckCircleTwoTone twoToneColor="#52c41a" />
      <FaFileCircleCheck />
    ) : (
      <></>
    );
  };
  imageInstruction = () => {
    this.setState({ uploadInstructionVisible: true });
  };
  handleCancel = () => {
    this.setState({
      uploadInstructionVisible: false,
    });
  };
  render() {
    return (
      <Spin spinning={this.state.isLoading}>
        <Form
          disabled={this.props.disabled}
          form={this.props.form}
          onFinish={this.onFinish1}
          layout="inline"
        >
          <Row gutter={[10, 10]}>
            <Col sm={24}>
              <Descriptions
                column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
                labelStyle={{ fontWeight: "bold" }}
              >
                <Descriptions.Item label="Check List Description">
                  {this.state.initialValues?.description}
                </Descriptions.Item>
                <Descriptions.Item label="Asset Name">
                  {this.state.initialValues?.asset?.assetName}
                </Descriptions.Item>
                <Descriptions.Item label="Scheduled Date">
                  {/* {Moment(this.state.initialValues?.startDate).format(
                    "DD-MM-YYYY"
                  )} */}
                  {dateFormat(this.state.initialValues?.startDate)}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  {this.state.initialValues?.status}
                </Descriptions.Item>
                {/* <Descriptions.Item label="Product"> */}
                <Descriptions.Item>
                  <Form.Item name="checkListExecutionId" hidden />
                </Descriptions.Item>
              </Descriptions>
            </Col>

            <Col sm={24}>
              <br />
              <br />
              <Form.List name="checks">
                {(fields, { add, remove }) => (
                  <Table dataSource={fields} bordered pagination={false}>
                    <Column
                      title="Description"
                      dataIndex="description"
                      key="description"
                      width={400}
                      align="center"
                      render={(key, record) => (
                        <>
                          <Form.Item
                            hidden
                            name={[record.name, "checkListExecutionChecksId"]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item name={[record.name, "checkDescription"]}>
                            <Input.TextArea
                              bordered={false}
                              readOnly
                              autoSize={{ minRows: 2, maxRows: 7 }}
                              placeholder="Check Description"
                              style={{ width: "" }}
                            />
                          </Form.Item>
                          <Row>
                            <Col>
                              {this.state.initialValues?.checks[
                                record.key
                              ]?.checkListExecutionCheckType?.map((e) => (
                                <Tag color="blue" key={e.checkTypeId}>
                                  {this.state.checkType?.length > 0
                                    ? this.state.checkType[e.checkTypeId]
                                    : ""}
                                  {this.state.checkType[e.checkTypeId]}
                                </Tag>
                              ))}
                            </Col>
                          </Row>
                        </>
                      )}
                    />
                    <Column
                      title="Status"
                      dataIndex="status"
                      key="status"
                      width={250}
                      align="center"
                      render={(status, record) => (
                        <Form.Item name={[record.name, "status"]}>
                          <Radio.Group buttonStyle="solid">
                            <Radio.Button value="YES">Yes</Radio.Button>
                            <Radio.Button value="NO"> No</Radio.Button>
                            <Radio.Button value="NA"> NA</Radio.Button>
                          </Radio.Group>
                        </Form.Item>
                      )}
                    />
                    <Column
                      title="Remark"
                      dataIndex="remark"
                      key="remark"
                      align="center"
                      render={(remark, record) => (
                        <Row align={"middle"}>
                          <Col sm={20}>
                            <Form.Item
                              name={[record.name, "remark"]}
                              dependencies={[record.name, "status"]}
                              rules={[
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    if (
                                      getFieldValue([
                                        "checks",
                                        record.name,
                                        "status",
                                      ]) == "NO" &&
                                      !value
                                    ) {
                                      return Promise.reject(
                                        new Error("Remark is required!")
                                      );
                                    }
                                    return Promise.resolve();
                                  },
                                }),
                                {
                                  required: false,
                                  message: "Please enter Remark!",
                                },
                              ]}
                            >
                              <Input.TextArea placeholder="Remarks" />
                            </Form.Item>
                          </Col>
                          <Col sm={4}>
                            <Form.Item
                              shouldUpdate={true}
                              name={[record.name, "checkListExecutionChecksId"]}
                            >
                              <Space>
                                {this.state.initialValues?.checks[record.name]
                                  .imageUrl !== null &&
                                this.state.initialValues?.checks[record.name]
                                  .imageUrl !== "" ? (
                                  <Button
                                    type="text"
                                    onClick={() => {
                                      this.handlePopupOpen(
                                        record.name,
                                        this.state.initialValues?.checks[
                                          record.name
                                        ].imageUrl
                                      );
                                    }}
                                    icon={
                                      <IoMdCheckmarkCircleOutline
                                        style={{
                                          color: "#52c41a",
                                          fontSize: "22px",
                                        }}
                                      />
                                    }
                                  />
                                ) : (
                                  <>
                                    <Tooltip title="Click to upload image">
                                      <Button
                                        type="text"
                                        icon={<FaUpload />}
                                        onClick={() => {
                                          this.handlePopupOpen(record.name);
                                        }}
                                      />
                                    </Tooltip>
                                  </>
                                )}
                                {/* {this.imageIcon(record.name)} */}
                              </Space>
                            </Form.Item>
                          </Col>
                        </Row>
                      )}
                    />
                  </Table>
                )}
              </Form.List>
            </Col>
            {!this.props.disabled && (
              <Col span={24}>
                <Row justify="end">
                  <Col>
                    <Button type="primary" htmlType="submit">
                      Save Preview
                    </Button>
                  </Col>
                </Row>
              </Col>
            )}
          </Row>
        </Form>
        <Modal
          title="Upload "
          width={300}
          // height={300}
          centered={true}
          open={this.state.modalOpen}
          onOk={this.imageUpload}
          onCancel={this.handlePopupClose}
          bodyStyle={{
            overflowY: "auto",
            maxHeight: "calc(300px)",
            width: "276px",
            paddingRight: "2em",
          }}

          // className="image-upload"
        >
          {this.state.errorMessage && (
            <div style={{ marginTop: "8px", color: "red" }}>
              {this.state.errorMessage.map((error, index) => (
                <Tooltip
                  placement="right"
                  title={error.errorMessage}
                  color="red"
                >
                  <Card
                    style={{
                      marginTop: "8px",
                      border: "1px solid red",
                      height: 70,
                      padding: "0 10px 0 10px",
                    }}
                    className="image-error"
                  >
                    <div key={index}>
                      <Paragraph
                        ellipsis={{ rows: 2, expandable: false }}
                        style={{ width: "100%", color: "red" }}
                      >
                        {error.errorMessage}
                      </Paragraph>
                    </div>
                  </Card>
                </Tooltip>
              ))}
            </div>
          )}

          <Upload
            listType="picture"
            accept="image/png, image/jpeg, image/jpg"
            fileList={this.state.fileList}
            beforeUpload={this.beforeUpload}
            onChange={this.handleFileChange}
            onRemove={this.handleRemove}
            onPreview={this.handlePreview}
            multiple={true}
          >
            <Button
              style={{ position: "absolute", top: 15, left: 100 }}
              icon={<UploadOutlined />}
            >
              Select File
            </Button>
          </Upload>

          <InfoCircleOutlined
            onClick={this.imageInstruction}
            style={{ position: "absolute", top: 23, right: 60 }}
          />
          <Modal
            title="Image Upload Instructions"
            visible={this.state.uploadInstructionVisible}
            onCancel={this.handleCancel}
            footer={null}
          >
            <div>
              <span> 1. Image should be in JPEG, JPG, or PNG format only.</span>
              <br></br>
              <span>2. File size should be less than 10MB.</span>
            </div>
          </Modal>
        </Modal>
        <Modal
          title="Image Preview"
          visible={this.state.previewVisible}
          footer={null}
          onCancel={this.handlePreviewCancel}
          style={{ width: "300px" }}
        >
          <img
            alt="Preview"
            style={{ width: "100%", height: "100%" }}
            src={this.state.previewImage}
            onClick={this.handlePreviewCancel}
          />
        </Modal>
      </Spin>
    );
  }
}

export default withRouter(withForm(CheckListExecutionForm));
