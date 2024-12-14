import {
  ExceptionOutlined,
  InfoCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  AutoComplete,
  Avatar,
  Button,
  Checkbox,
  Col,
  Descriptions,
  Form,
  Image,
  Input,
  Modal,
  Radio,
  Row,
  Spin,
  Table,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { publicUrl } from "../../../helpers/url";
import WorkorderResolutionService from "../../../services/preventive-maintenance-services/workorder-resolution-service";
import WorkOrderResolveService from "../../../services/preventive-maintenance-services/workorder-resolve-service";
import PageForm from "../../../utils/page/page-form";
import { withForm } from "../../../utils/with-form";
// import CorrectiveActionSuggestionService from "../../../services/spare-parts-services/corrective-action-suggestion-service";
// import EnquireService from "../../../services/spare-parts-services/enquire-service";
import Paragraph from "antd/es/typography/Paragraph";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import { remoteAsset } from "../../../helpers/url";
import InventoryRequestService from "../../../services/inventory-services/inventory-request-service";
import InventoryResolution from "../../spare-parts-management/inventory-resolution/inventory-resolution";
const { TextArea } = Input;

class ResolutionWorkOrderResolve extends PageForm {
  state = {
    file: null,
    fileList: [],
    rcaOptions: [],
    caOptions: [],
    paOptions: [],
    beforeResolveImage: [],
    afterResolveImage: [],
    isLoading: false,
    rcaList: [],
    caList: [],
    paList: [],
    spareRequestData: [],

    modalVisible: false,
    modalVisible: false,
    errorMessage: "",
    errorMessage1: "",
    uploadInstructionVisible: false,
  };

  service = new WorkorderResolutionService();
  resolveservice = new WorkOrderResolveService();
  inventoryRequestService = new InventoryRequestService();

  loadSpareRequest = () => {
    this.setState((state) => ({
      ...state,
      isLoading: true,
    }));
    this.inventoryRequestService
      .list({ resolutionWorkOrderId: this.props.id })
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          spareRequestData: data,
          isSpareVisible: data.length > 0,
        }));
      })
      .finally(() => {
        this.setState((state) => ({
          ...state,
          isLoading: false,
        }));
      });
  };
  isAnyRequestApproved = () => {
    const { spareRequestData } = this.state;
    console.log("loggg", spareRequestData);
    return (
      spareRequestData.length === 0 ||
      spareRequestData.every((request) => request.status === "Dispatched")
    );
  };
  triggerInitialChange = () => {
    this.getRcaList();

    this.suggestionconfigurationservice
      .list({ checkName: this.state.initialValues?.description })
      .then((response) => {
        this.setState((state) => ({
          ...state,
          correctiveActionSuggestion: response.data,
        }));
      });

    if (this.props.form.getFieldValue("ca")) {
      this.getRecommendedSpare(this.props.form.getFieldValue("ca"));
    }
  };
  getRecommendedSpare = (key) => {
    this.suggestionconfigurationservice
      .list({ checkName: this.state.initialValues?.description, capa: key })
      .then((response) => {
        this.setState((state) => ({
          ...state,
          productdetails: response.data,
        }));
      });
  };

  handleSearch = (value) => {
    let filter = this.state.correctiveActionSuggestion
      ?.filter((e) =>
        e.correctiveAction?.toLowerCase().includes(value?.toLowerCase())
      )
      .map((e) => e.correctiveAction);

    this.setState((state) => ({
      ...state,
      option: Array.from(new Set(filter))?.map((e) => ({ value: e })),
    }));
  };

  saveFn(data) {
    return this.resolveservice.add({
      ...data,
      resolutionWorkOrderId: this.props.id,
      productIds: this.state.productIds ?? [],
    });
  }
  onSuccess(data) {
    super.onSuccess(data);
    this.props.next();
  }
  setProductIds = (ids) => {
    this.setState((state) => ({ ...state, productIds: ids }));
  };

  saveFun(data, beforeResolveImage, afterResolveImage) {
    const { rca, ca, pa } = data;

    let formData = new FormData();
    if (
      beforeResolveImage &&
      beforeResolveImage[0] &&
      beforeResolveImage[0].originFileObj
    ) {
      formData.append(
        "beforeResolveImage",
        beforeResolveImage?.[0].originFileObj
      );
    }
    if (
      afterResolveImage &&
      afterResolveImage[0] &&
      afterResolveImage[0].originFileObj
    ) {
      formData.append(
        "afterResolveImage",
        afterResolveImage?.[0].originFileObj
      );
    }

    const id = this.state.id;

    return this.service.resolve(id, rca, ca, pa, formData);
  }

  onFinish1 = (values) => {
    const { beforeResolveImage, afterResolveImage } = this.state;

    this.saveFun(values, beforeResolveImage, afterResolveImage)
      .then((response) => {
        this.props.next();
      })
      .catch((error) => {
        console.error("Save error:", error);
      });
  };

  // getImage = (info) => {
  //   this.setState((state) => ({ ...state, beforeResolveImage: info.fileList }));
  // };
  // getImage1 = (info) => {
  //   this.setState((state) => ({ ...state, afterResolveImage: info.fileList }));
  // };
  beforeUpload = (file) => {
    console.log(file, "filelis");
    const beforeImageUrl = URL.createObjectURL(file);
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    const isImage = allowedFileTypes.includes(file.type);
    const maxSizeInBytes = 10 * 1024 * 1024;
    const isLtSize = file.size <= maxSizeInBytes;
    if (!isImage) {
      this.setState({
        errorMessage: "You can only upload JPG/PNG file types!",
      });
      // Reset image to null
      this.setState({ beforeResolveImage: [] });
      return false;
    } // Prevent upload
    if (!isLtSize) {
      this.setState({ errorMessage: "Image must be smaller than 10MB!" });
      // Reset image to null
      this.setState({ beforeResolveImage: [] });
      return false;
    } // Prevent upload
    this.setState({
      beforeResolveImage: file.fileList,
      beforeImageUrl: beforeImageUrl,
    });

    return false;
  };
  afterUpload = (file) => {
    console.log(file, "filelis");
    const afterImageUrl = URL.createObjectURL(file);

    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    const isImage = allowedFileTypes.includes(file.type);
    const maxSizeInBytes = 10 * 1024 * 1024;
    const isLtSize = file.size <= maxSizeInBytes;
    if (!isImage) {
      this.setState({
        errorMessage1: "You can only upload JPG/PNG file types!",
      });
      // Reset image to null
      this.setState({ afterResolveImage: [] });
      return false;
    } // Prevent upload
    if (!isLtSize) {
      this.setState({ errorMessage1: "Image must be smaller than 10MB!" });
      // Reset image to null
      this.setState({ afterResolveImage: [] });
      return false;
    } // Prevent upload
    this.setState({
      afterResolveImage: file.fileList,
      afterImageUrl: afterImageUrl,
    });

    return false;
  };
  imageInstruction = () => {
    this.setState({ uploadInstructionVisible: true });
  };
  handleCancel = () => {
    this.setState({
      uploadInstructionVisible: false,
    });
  };
  handlePreviewAfter = () => {
    this.setState({ previewVisibleAfter: true });
  };
  handlePreviewBefore = () => {
    this.setState({ previewVisibleBefore: true });
  };
  handlePreviewCancel = () => {
    this.setState({
      previewVisibleAfter: false,
      uploadInstructionVisible: false,
      previewVisibleBefore: false,
    });
  };
  handleImageCancel = () => {
    this.setState({
      uploadInstructionVisible: false,
    });
  };
  getImage = (info) => {
    console.log("img", info);
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    const isImage = allowedFileTypes.includes(info.file.type);
    const maxSizeInBytes = 10 * 1024 * 1024;
    const isLtSize = info.file.size <= maxSizeInBytes;
    if (isImage && isLtSize) {
      this.setState((state) => ({
        ...state,
        beforeResolveImage: info.fileList,
        errorMessage: "",
      }));
      // console.log("resolve", info.fileList[0]?.originFileObj);
    } else {
      this.setState((state) => ({ ...state, beforeResolveImage: [] }));
    }
  };
  getImage1 = (info) => {
    console.log("img", info);
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    const isImage = allowedFileTypes.includes(info.file.type);
    const maxSizeInBytes = 10 * 1024 * 1024;
    const isLtSize = info.file.size <= maxSizeInBytes;
    if (isImage && isLtSize) {
      this.setState((state) => ({
        ...state,
        afterResolveImage: info.fileList,
        errorMessage1: "",
      }));
      // console.log("resolve", info.fileList[0]?.originFileObj);
    } else {
      this.setState((state) => ({ ...state, afterResolveImage: [] }));
    }
  };
  handleViewClick = () => {
    this.setState({ modalVisible: true });
  };
  getRcaList = () => {
    const checkDescription = this.state.initialValues?.description;
    this.service.getRcaSuggestion({ checkDescription }).then(({ data }) => {
      this.setState((state) => ({
        ...state,
        rcaList: data.result,
        rcaOptions: data.result.map((e) => ({ value: e, label: e })),
      }));
    });
  };
  getCaList = () => {
    const checkDescription = this.state.initialValues?.description;
    const rca = this.props.form.getFieldValue("rca");
    this.service.getCaSuggestion({ checkDescription, rca }).then(({ data }) => {
      this.setState((state) => ({
        ...state,
        caList: data.result,
        caOptions: data.result.map((e) => ({ value: e, label: e })),
      }));
    });
  };
  getPaList = () => {
    const checkDescription = this.state.initialValues?.description;
    const rca = this.props.form.getFieldValue("rca");
    const ca = this.props.form.getFieldValue("ca");
    this.service
      .getPaSuggestion({ checkDescription, rca, ca })
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          paList: data.result,
          paOptions: data.result.map((e) => ({ value: e, label: e })),
        }));
      });
  };

  suggest = (str, mode) => {
    const form = this.props.form;
    let rca, ca;
    if (mode === "rca") {
      form.setFieldValue("ca", null);
      form.setFieldValue("pa", null);
    } else if (mode === "ca") {
      form.setFieldValue("pa", null);
      rca = form.getFieldValue("rca");
    } else if (mode === "pa") {
      ca = form.getFieldValue("ca");
    }
    const cd = this.state.initialValues?.description;

    this.service.getSuggestion(str, cd, rca, ca).then(({ data }) => {
      this.setState((state) => {
        let obj = { ...state };
        let arr =
          data.sorted_matching_phrases?.map((e) => ({ value: e })) ?? [];
        if (mode === "rca")
          obj = { ...state, rcaOptions: arr, caOptions: [], paOptions: [] };
        if (mode === "ca") obj = { ...state, caOptions: arr, paOptions: [] };
        if (mode === "pa") obj = { ...state, paOptions: arr };
        return obj;
      });
    });
  };
  filterOption = (list, key, string) => {
    const str = string.toLowerCase();
    this.setState((state) => ({
      ...state,
      [key]: list
        .filter((e) => e.toLowerCase().includes(str))
        .map((e) => ({ value: e, label: e })),
    }));
  };
  handleViewClick = () => {
    this.setState({ modalVisible: true });
  };

  componentDidMount() {
    super.componentDidMount();
    // this.onRetrieve(this.props.id);
    this.loadSpareRequest();
  }

  render() {
    const settings = {
      dots: true,

      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    return (
      <Spin spinning={this.state.isLoading}>
        <Row gutter={[0, 0]}>
          <Col span={24}>
            <div style={{ float: "right" }}>
              <Tooltip placement="top" title="Knowledge Base">
                <Link
                  to={`https://maxbyte-poc.document360.io/docs/operators-manual`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography.Text>
                    <ExceptionOutlined style={{ fontSize: "20px" }} />
                  </Typography.Text>
                </Link>
              </Tooltip>
            </div>
          </Col>
          <Col span={24}>
            <Descriptions
              column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
              // bordered
              // layout="vertical"

              labelStyle={{ fontWeight: "bold" }}
            >
              <Descriptions.Item key="l0" label="R.No">
                {this.state.initialValues?.rwoNumber}
              </Descriptions.Item>
              <Descriptions.Item key="l1" label="Description">
                {/* {this.state.initialValues?.description} */}
                <Paragraph
                  ellipsis={{ rows: 2, expandable: true }}
                  style={{ width: "100%" }}
                >
                  {this.state.initialValues?.description}
                </Paragraph>
              </Descriptions.Item>
              <Descriptions.Item key="l2" label="Asset Name">
                {this.state.initialValues?.asset?.assetName}
              </Descriptions.Item>

              <Descriptions.Item key="16" label="Initiated By">
                {this.state.initialValues?.initiatedBy?.userName}
              </Descriptions.Item>
              <Descriptions.Item key="l3" label="Scheduled Date">
                {moment(this.state.initialValues?.startDate).format(
                  "DD-MM-YYYY"
                )}
              </Descriptions.Item>
              <Descriptions.Item key="19" label="Due Date">
                {moment(this.state.initialValues?.dueDate).format("DD-MM-YYYY")}
              </Descriptions.Item>

              <Descriptions.Item key="17" label="Assigned To">
                {this.state.initialValues?.assignedTo?.userName}
              </Descriptions.Item>
              <Descriptions.Item key="18" label="Priority">
                {this.state.initialValues?.priority}
              </Descriptions.Item>
              <Descriptions.Item key="l4" label="Status">
                {this.service.status(this.state.initialValues?.status)}
              </Descriptions.Item>
              {this.state.initialValues?.remarks && (
                <Descriptions.Item key="20" label="Issue" span={10}>
                  {this.state.initialValues?.remarks}
                </Descriptions.Item>
              )}
              {this.state.initialValues?.comments && (
                <Descriptions.Item key="20" label="Comment" span={10}>
                  {this.state.initialValues?.comments}
                </Descriptions.Item>
              )}
              <Descriptions.Item key="l10" label="Reference Image">
                <Tooltip
                  title={
                    this.state.initialValues?.imageUrl ? null : "No Preview"
                  }
                >
                  <Button
                    onClick={this.handleViewClick}
                    disabled={this.state.initialValues?.imageUrl ? false : true}
                  >
                    View
                  </Button>
                </Tooltip>
                <Modal
                  visible={this.state.modalVisible}
                  title="Preview"
                  onCancel={() => this.setState({ modalVisible: false })}
                  footer={null}
                  width={300}
                  height={300}
                  className="image-preview"
                >
                  {/* <Slider {...settings}> */}
                  {this.state.initialValues?.imageUrl
                    ?.split(",")
                    ?.map((image, index) => (
                      <div key={index}>
                        <Image
                          style={{ width: 300, height: 250 }}
                          src={`${publicUrl}${image}`}
                          fallback="data:image/png;base64,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"
                        />{" "}
                      </div>
                    ))}
                  {/* </Slider> */}
                </Modal>
              </Descriptions.Item>
              {this.state.initialValues?.rejectedReason && (
                <Descriptions.Item key="20" label="Reject Reason" span={10}>
                  {this.state.initialValues?.rejectedReason}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Col>
          <Col span={24}>
            <div className="details">
              <Form
                disabled={this.props.disabled}
                layout="vertical"
                labelCol={{ sm: 24, xs: 24 }}
                wrapperCol={{ sm: 24, xs: 24 }}
                onFinish={this.onFinish1}
                form={this.props.form}
              >
                <Row gutter={[10, 10]}>
                  <Col span={12}>
                    <Form.Item name="beforeResolveImage">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {/* <ImgCrop rotate aspect={1 / 1}> */}
                        <Upload
                          listType="picture"
                          fileList={this.state.beforeResolveImage}
                          onChange={this.getImage}
                          beforeUpload={this.beforeUpload}
                          onPreview={this.handlePreviewBefore}
                        >
                          <strong>Before Resolve Image: </strong>
                          <Button icon={<UploadOutlined />}>
                            Click to Upload
                          </Button>
                        </Upload>
                        {/* </ImgCrop> */}
                      </div>
                    </Form.Item>
                    <InfoCircleOutlined
                      onClick={this.imageInstruction}
                      style={{ position: "absolute", top: 0, left: 318 }}
                    />

                    <Modal
                      title="Image Upload Instructions"
                      visible={this.state.uploadInstructionVisible}
                      onCancel={this.handleCancel}
                      footer={null}
                    >
                      <div>
                        <span>
                          {" "}
                          1. Image should be in JPEG, JPG, or PNG format only.
                        </span>
                        <br></br>
                        <span>2. File size should be less than 10MB.</span>
                        {/* Add more instructions as needed */}
                      </div>
                    </Modal>
                    {this.state.errorMessage && (
                      <div style={{ marginTop: "8px", color: "red" }}>
                        {this.state.errorMessage}
                      </div>
                    )}
                  </Col>

                  <Col span={12}>
                    <Form.Item name="afterResolveImage">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {/* <ImgCrop rotate aspect={1 / 1}> */}
                        <Upload
                          listType="picture"
                          fileList={this.state.afterResolveImage}
                          onChange={this.getImage1}
                          beforeUpload={this.afterUpload}
                          onPreview={this.handlePreviewAfter}
                        >
                          <strong>After Resolve Image: </strong>
                          <Button icon={<UploadOutlined />}>
                            {" "}
                            Click to Upload
                          </Button>
                        </Upload>
                        {/* </ImgCrop> */}
                      </div>
                    </Form.Item>
                    <InfoCircleOutlined
                      onClick={this.imageInstruction}
                      style={{ position: "absolute", top: 0, left: 310 }}
                    />

                    <Modal
                      title="Image Upload Instructions"
                      visible={this.state.uploadInstructionVisible}
                      onCancel={this.handleCancel}
                      footer={null}
                    >
                      <div>
                        <span>
                          {" "}
                          1. Image should be in JPEG, JPG, or PNG format only.
                        </span>
                        <br></br>
                        <span>2. File size should be less than 10MB.</span>
                        {/* Add more instructions as needed */}
                      </div>
                    </Modal>
                    {this.state.errorMessage1 && (
                      <div style={{ marginTop: "8px", color: "red" }}>
                        {this.state.errorMessage1}
                      </div>
                    )}
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Do you need to raise the spare or inventory requests?">
                      <Radio.Group
                        onChange={(e) =>
                          this.setState((state) => ({
                            ...state,
                            isSpareVisible: e.target.value === "yes",
                          }))
                        }
                        value={this.state.isSpareVisible ? "yes" : "no"}
                      >
                        <Radio value="yes">Yes</Radio>
                        <Radio value="no">No</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="rca"
                      label="Root Cause Analysis"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the Root Cause!",
                        },
                      ]}
                    >
                      <AutoComplete
                        options={this.state.rcaOptions ?? []}
                        // onSearch={(e) =>
                        //   this.filterOption(this.state.rcaList, "rcaOptions", e)
                        // }
                        // onChange={this.getCaList}
                      >
                        <Input.TextArea rows={3} />
                      </AutoComplete>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="ca"
                      label="Corrective Action"
                      rules={[
                        {
                          required: true,
                          message: "Please select the Corrective Action!",
                        },
                      ]}
                    >
                      <AutoComplete
                        options={this.state.caOptions ?? []}
                        // onChange={this.getPaList}
                        // onSearch={(e) =>
                        //   this.filterOption(this.state.caList, "caOptions", e)
                        // }
                      >
                        <TextArea rows={3} />
                      </AutoComplete>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="pa"
                      label="Preventive Action"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the Preventive Action!",
                        },
                      ]}
                    >
                      <AutoComplete
                        options={this.state.paOptions ?? []}
                        // onSearch={(e) =>
                        //   this.filterOption(this.state.paList, "paOptions", e)
                        // }
                      >
                        <Input.TextArea rows={3} />
                      </AutoComplete>
                    </Form.Item>
                  </Col>
                  {this.state.isSpareVisible ? (
                    <Col span={24}>
                      <InventoryResolution
                        id={this.props.id}
                        assetFamilyId={
                          this.state.initialValues?.asset?.assetFamilyId
                        }
                        loadSpareRequest={this.loadSpareRequest}
                      />
                    </Col>
                  ) : (
                    ""
                  )}
                </Row>
                <br></br>
                <Row justify="end">
                  {/* <Col>
                    <Button onClick={this.props.prev}>Back</Button>
                  </Col> */}
                  <Col>
                    <Button
                      htmlType="submit"
                      type="primary"
                      disabled={!this.isAnyRequestApproved()}
                    >
                      Send For Approval
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
        </Row>
        <Modal
          title="Image Preview"
          visible={
            this.state.previewVisibleBefore || this.state.previewVisibleAfter
          }
          footer={null}
          onCancel={this.handlePreviewCancel}
          style={{ width: "300px" }}
        >
          <img
            alt="Preview"
            style={{ width: "100%", height: "100%" }}
            src={
              this.state.previewVisibleBefore
                ? this.state.beforeImageUrl
                : this.state.afterImageUrl
            }
            onClick={this.handlePreviewCancel}
          />
        </Modal>
      </Spin>
    );
  }
}

function Spare(props) {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(props.data?.map((e) => e.product));
  }, [props.data]);
  const columns = [
    {
      dataIndex: "imageUrl",
      key: "imageUrl",
      title: "Image",
      width: "100px",
      align: "center",
      render: (value) => {
        return <Avatar src={remoteAsset(value)} shape="square" />;
      },
    },

    {
      dataIndex: "productName",
      key: "productName",
      title: "Product Name",
      align: "left",
      sorter: (a, b) => a.productName.localeCompare(b.productName),
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      align: "left",
    },
  ];
  return (
    <Table
      size="small"
      rowSelection={{
        type: "checkbox",
        onChange: (selectedRowKeys, selectedRows) => {
          props.setProductIds(selectedRowKeys);
        },
      }}
      rowKey="productId"
      columns={columns}
      dataSource={data}
    />
  );
}

export default withForm(ResolutionWorkOrderResolve);
