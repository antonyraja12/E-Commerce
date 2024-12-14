import {
  AutoComplete,
  Avatar,
  Button,
  Col,
  Descriptions,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Spin,
  Table,
  Tooltip,
  Upload,
} from "antd";
import moment from "moment";
import React from "react";
import { publicUrl } from "../../../helpers/url";
import WorkorderResolutionService from "../../../services/inspection-management-services/workorder-resolution-service";
import WorkOrderResolveService from "../../../services/inspection-management-services/workorder-resolve-service";
import PageForm from "../../../utils/page/page-form";
import { withForm } from "../../../utils/with-form";
import { InfoCircleOutlined, UploadOutlined } from "@ant-design/icons";
import Paragraph from "antd/es/typography/Paragraph";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import { remoteAsset } from "../../../helpers/url";
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
    modalVisible: false,
    errorMessage: "",
    errorMessage1: "",
    uploadInstructionVisible: false,
  };
  service = new WorkorderResolutionService();
  resolveservice = new WorkOrderResolveService();

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

  beforeUpload = (file) => {
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    const isImage = allowedFileTypes.includes(file.type);
    const maxSizeInBytes = 10 * 1024 * 1024;
    const isLtSize = file.size <= maxSizeInBytes;
    if (!isImage) {
      this.setState({
        errorMessage: "You can only upload JPG/PNG file types!",
      });
      this.setState({ beforeResolveImage: [] });
      return false;
    }
    if (!isLtSize) {
      this.setState({ errorMessage: "Image must be smaller than 10MB!" });
      this.setState({ beforeResolveImage: [] });
      return false;
    }
    this.setState({ beforeResolveImage: file.fileList });

    return false;
  };
  afterUpload = (file) => {
    console.log(file, "filelis");
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    const isImage = allowedFileTypes.includes(file.type);
    const maxSizeInBytes = 10 * 1024 * 1024;
    const isLtSize = file.size <= maxSizeInBytes;
    if (!isImage) {
      this.setState({
        errorMessage1: "You can only upload JPG/PNG file types!",
      });

      this.setState({ afterResolveImage: [] });
      return false;
    }
    if (!isLtSize) {
      this.setState({ errorMessage1: "Image must be smaller than 10MB!" });

      this.setState({ afterResolveImage: [] });
      return false;
    }
    this.setState({ afterResolveImage: file.fileList });

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
  getImage = (info) => {
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
    } else {
      this.setState((state) => ({ ...state, afterResolveImage: [] }));
    }
  };
  handleViewClick = () => {
    this.setState({ modalVisible: true });
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
  handleViewClick = () => {
    this.setState({ modalVisible: true });
  };
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
            <Descriptions
              column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
              labelStyle={{ fontWeight: "bold" }}
            >
              <Descriptions.Item key="l0" label="R.No">
                {this.state.initialValues?.rwoNumber}
              </Descriptions.Item>
              <Descriptions.Item key="l1" label="Description">
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
              <Descriptions.Item key="l5" label="Initiated By">
                {this.state.initialValues?.initiatedBy?.userName}
              </Descriptions.Item>
              <Descriptions.Item key="l3" label="Scheduled Date">
                {moment(this.state.initialValues?.startDate).format(
                  "DD-MM-YYYY"
                )}
              </Descriptions.Item>
              <Descriptions.Item key="l8" label="Due Date">
                {moment(this.state.initialValues?.dueDate).format("DD-MM-YYYY")}
              </Descriptions.Item>

              <Descriptions.Item key="l6" label="Assigned To">
                {this.state.initialValues?.assignedTo?.userName}
              </Descriptions.Item>
              <Descriptions.Item key="l7" label="Priority">
                {this.state.initialValues?.priority}
              </Descriptions.Item>
              <Descriptions.Item key="l4" label="Status">
                {this.service.status(this.state.initialValues?.status)}
              </Descriptions.Item>
              <Descriptions.Item key="l9" label="Issue" span={10}>
                {this.state.initialValues?.remarks}
              </Descriptions.Item>
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
                  <Slider {...settings}>
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
                  </Slider>
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
                        <Upload
                          listType="picture"
                          fileList={this.state.beforeResolveImage}
                          onChange={this.getImage}
                          beforeUpload={this.beforeUpload}
                        >
                          {" "}
                          <strong>Before Resolve Image: </strong>
                          <Button icon={<UploadOutlined />}>
                            {" "}
                            Click to Upload
                          </Button>
                        </Upload>
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
                        <Upload
                          listType="picture"
                          fileList={this.state.afterResolveImage}
                          onChange={this.getImage1}
                          beforeUpload={this.afterUpload}
                        >
                          <strong>After Resolve Image: </strong>
                          <Button icon={<UploadOutlined />}>
                            {" "}
                            Click to Upload
                          </Button>
                        </Upload>
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
                      </div>
                    </Modal>
                    {this.state.errorMessage1 && (
                      <div style={{ marginTop: "8px", color: "red" }}>
                        {this.state.errorMessage1}
                      </div>
                    )}
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
                      <AutoComplete options={this.state.rcaOptions ?? []}>
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
                      <AutoComplete options={this.state.caOptions ?? []}>
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
                      <AutoComplete options={this.state.paOptions ?? []}>
                        <Input.TextArea rows={3} />
                      </AutoComplete>
                    </Form.Item>
                  </Col>
                </Row>
                <br></br>
                <Row justify="space-between">
                  <Col>
                    <Button onClick={this.props.prev}>Back</Button>
                  </Col>
                  <Col>
                    <Button htmlType="submit" type="primary">
                      Send For Approval
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
        </Row>
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
      render: (value) => {
        return (
          <Paragraph
            ellipsis={{ rows: 2, expandable: true }}
            style={{ width: "100%" }}
          >
            {value}
          </Paragraph>
        );
      },
      width: 200,
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
