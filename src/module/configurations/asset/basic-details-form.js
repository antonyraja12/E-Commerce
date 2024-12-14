import {
  Button,
  Col,
  Flex,
  Form,
  Image,
  Input,
  Radio,
  Row,
  Select,
  Spin,
  TreeSelect,
  Upload,
  Modal,
  message,
  InputNumber,
} from "antd";
import React from "react";

import AssetService from "../../../services/asset-service";
import OrganisationService from "../../../services/organisation-service";
import PageForm from "../../../utils/page/page-form";
import { withForm } from "../../../utils/with-form";

import { PlusOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { remoteAsset } from "../../../helpers/url";
import { validateImage, validateName } from "../../../helpers/validation";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import AssetFamilyService from "../../../services/asset-family-service";
import LoginService from "../../../services/login-service";
import UserService from "../../../services/user-service";
import { withRouter } from "../../../utils/with-router";
import AssetLibraryService from "../../../services/asset-library-service";
const { TextArea } = Input;
const { Option } = Select;

class BasicDetails extends PageForm {
  state = {
    previewVisible: false,
    errorMessage: "",
    fileType: "",
    uploadInstructionVisible: false,
    parentTreeList: [],
    isAssetLibraryLoading: false,
    assetLibraryOptions: [],
    openLimit: false,
  };
  organisationService = new OrganisationService();
  authService = new LoginService();
  userservice = new UserService();
  service = new AssetService();
  appHierarchyService = new AppHierarchyService();
  assetFamilyService = new AssetFamilyService();
  assetLibraryService = new AssetLibraryService();
  state = {
    previewImage: null,
  };

  handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.setState({ previewImage: reader.result });
      };
    }
  };
  closePopup = (id) => {
    if (!this.props.params.assetId) {
      this.props.navigate(`${id}/basic-details`);
    }
  };
  onSuccess(data) {
    if (data.message) {
      super.onSuccess({ message: data.message });
    } else {
      super.onSuccess({ success: true, message: "Added Successfully" });
    }
    this.closePopup(data.assetId);
  }
  getUserName = () => {
    let curruser = this.authService.getUserName();
    // let currentUserRole = this.userservice.
    return this.authService.getUserName();
  };
  getOrgValue = (value) => {
    let c = this.state.customer.find((e) => e.customerId === value);
    this.props.form.setFieldValue("organisationId", c?.organisationId);
  };

  componentDidMount() {
    this.loadAppHierarchy();
    this.loadAssetFamily();
    this.getUserName();
    super.componentDidMount();

    if (this.props.params.assetId) {
      this.onRetrieve(this.props.params.assetId);
      this.setState((state) => ({ ...state, fMode: "Update" }));
    }

    this.service.list().then(({ data }) => {
      this.setState((state) => ({ ...state, assetList: data }));
    });

    if (this.props.form.getFieldValue("assetCategory") === 2) {
      this.setState((state) => ({ ...state, parentIdView: true }));
    }
  }

  loadAppHierarchy = () => {
    this.appHierarchyService
      .list({ active: true })
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          parentTreeList: this.appHierarchyService.convertToSelectTree(data),
        }));
      })
      .catch((error) => {
        console.error("Failed to load app hierarchy:", error);
      });
  };
  loadAssetFamily = () => {
    this.assetFamilyService
      .list()
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          assetFamilyData: data,
        }));
      })
      .catch((error) => {
        console.error("Failed to load asset family:", error);
      });
  };
  saveFn(data) {
    if (data.parentId === undefined) {
      data.parentId = 0;
    }
    if (data.energyLimit === undefined) {
      data.energyLimit = null;
    }
    let formData = new FormData();
    for (let x in data) {
      if (data[x] === null) continue;
      if (x === "image" && data[x]?.length > 0)
        formData.append(x, data[x][0].originFileObj);
      else formData.append(x, data[x]);
    }
    if (this.props.params.assetId)
      return this.service.update(formData, this.props.params.assetId);
    return this.service.add(formData);
  }
  patchForm(data) {
    if (this.props.form) {
      this.loadAssetLibrary(data.ahId);
      this.setState({ openLimit: data?.energyLimit ? true : false });

      this.props.form.setFieldsValue({
        ...data,
        image: data.imagePath
          ? [
              {
                uid: "-1",
                name: "Asset Image",
                status: "done",
                url: remoteAsset(data.imagePath),
              },
            ]
          : [],
        assetCategory: data.assetCategory,
        parentId: data.parentId === 0 ? null : data.parentId,
        active: data.active,
      });
    }
  }
  checkFileType = (file) => {
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    const isImage = allowedFileTypes.includes(file.type);
    const maxSizeInBytes = 10 * 1024 * 1024; // 100KB
    const isLtSize = file.size <= maxSizeInBytes;
    if (!isImage) {
      throw new Error("You can only upload image files (JPEG, JPG, PNG)!");
    } else if (!isLtSize) {
      throw new Error("Image must be smaller than 10MB!");
    }

    return true;
  };

  beforeUpload = (file) => {
    try {
      this.checkFileType(file);
      const imageUrl = URL.createObjectURL(file);
      this.setState({ errorMessage: "" });

      this.setState({ imageUrl });
    } catch (error) {
      // Handle the error message
      this.setState({ errorMessage: error.message });
      return false;
    }
    return false; // Prevent upload
  };

  handlePreview = () => {
    this.setState({ previewVisible: true });
  };
  handleCancel = () => {
    this.setState({ previewVisible: false, uploadInstructionVisible: false });
  };
  handleImageCancel = () => {
    this.setState({
      uploadInstructionVisible: false,
    });
  };
  imageCrop = (e) => {
    // console.log(e);
  };
  normFile = (e) => {
    this.setState((state) => state);
    const isImage = this.checkFileType(e.file || e.fileList);

    const maxSizeInBytes = 10 * 1024 * 1024;
    const isLtSize = e.file.size < maxSizeInBytes;
    if (isImage && isLtSize && Array.isArray(e)) {
      this.setState((state) => ({ ...state, errorMessage: "", fileType: "" }));

      return e;
    }
    return isImage && isLtSize
      ? (() => {
          this.setState((state) => ({
            ...state,
            errorMessage: "",
            fileType: "",
          }));
          return e.fileList;
        })()
      : null;
  };
  remove = (e) => {
    this.props.form.setFieldValue("image", []);
    this.props.form.setFieldValue("imagePath", null);
    this.setState((state) => ({ ...state, errorMessage: "", fileType: "" }));
    return false;
  };
  imageInstruction = () => {
    this.setState({ uploadInstructionVisible: true });
  };

  onComplete = (data) => {
    // console.log("data", data);
  };
  assetCategoryChange = (val) => {
    if (val.target.value === 2) {
      this.setState((state) => ({ ...state, parentIdView: true }));
    } else {
      this.setState((state) => ({ ...state, parentIdView: false }));
    }
  };

  loadAssetLibrary = (value) => {
    console.log("Load Asset Library for value:", value);
    this.setState({ isAssetLibraryLoading: true });

    this.assetLibraryService
      .list({ ahId: value, status: true })
      .then(({ data }) => {
        // console.log("data1", data);
        const options = data.map((e) => ({
          value: e.assetLibraryId,
          label: e.assetLibraryName,
          category: e.assetCategory,
        }));

        this.setState({
          assetLibraryOptions: options,
          isAssetLibraryLoading: false,
        });
      });
  };
  handleEntityChange = (value) => {
    console.log("Selected Entity (ahid):", value);
    if (value) {
      this.loadAssetLibrary(value);
    }
    this.setState({ assetLibraryOptions: [] });
    this.props.form.setFieldsValue({ assetLibraryId: null });
  };
  handleAssetLibraryChange = (value) => {
    const selectedLibrary = this.state.assetLibraryOptions.find(
      (library) => library.value === value
    );

    const parentId =
      selectedLibrary.category === 2
        ? this.props.form.getFieldValue("parentId")
        : null;

    if (selectedLibrary) {
      if (selectedLibrary.category === 2) {
        this.setState((state) => ({
          ...state,
          parentIdView: true,
          openLimit: true,
        }));
        this.props.form.setFieldsValue({ assetCategory: 2 });
      } else {
        this.setState((state) => ({ ...state, parentIdView: false }));
        this.props.form.setFieldsValue({ assetCategory: 1 });
      }

      this.props.form.setFieldsValue({
        assetCategory: selectedLibrary.category,
        parentId: parentId,
      });
    }
  };
  //  onFinish=(value)=>{
  //   console.log("values", value)
  // }

  render() {
    const { form } = this.props;
    const parentIdView = form.getFieldValue("assetCategory");
    const imgCount = form.getFieldValue("image")?.length;
    const { previewImage, errorMessage, fileType } = this.state;
    const imgPath = imgCount ? form.getFieldValue("image") : null;
    const imgurl = imgCount ? imgPath[0]?.url : null;
    // const { form } = this.props;
    const { isAssetLibraryLoading, assetLibraryOptions } = this.state;
    console.log(this.state, "treelist");
    return (
      <Spin spinning={!!this.state.isLoading}>
        <Form
          // size="small"
          form={form}
          colon={false}
          // labelCol={{ sm: 8, xs: 24 }}
          // wrapperCol={{ sm: 12, xs: 24 }}
          // labelAlign="left"
          layout="vertical"
          onFinish={this.onFinish}
          preserve={false}
        >
          <Row align="bottom" gutter={[10, 10]}>
            <Col lg={6}>
              <Form.Item name="imagePath" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                name="image"
                valuePropName="fileList"
                getValueFromEvent={this.normFile}
              >
                <Upload
                  action="/upload.do"
                  accept=".jpeg, .jpg, .png"
                  maxCount={1}
                  // onChange={this.imageCrop}
                  beforeUpload={this.beforeUpload}
                  listType="picture-card"
                  onRemove={this.remove}
                  onPreview={this.handlePreview}
                  showUpload
                  // fileList={this.state.imageUrl ? [{ uid: '-1', url: this.state.imageUrl }] : []}
                >
                  {!imgCount && <PlusOutlined />}
                </Upload>
              </Form.Item>
              <InfoCircleOutlined
                onClick={this.imageInstruction}
                style={{ position: "absolute", top: 0, left: 110 }}
              />

              <Modal
                title="Image Upload Instructions"
                visible={this.state.uploadInstructionVisible}
                onCancel={this.handleImageCancel}
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

            <Col lg={6}>
              <Form.Item
                name="assetName"
                label="Asset Name"
                rules={[
                  {
                    required: true,
                    message: "Please input the Asset Name",
                  },
                  // {
                  //   validator: validateName,
                  // },
                ]}
              >
                <Input autoFocus maxLength={200} />
              </Form.Item>
            </Col>
            <Col lg={6}>
              <Form.Item
                label="Entity"
                name="ahid"
                rules={[{ required: true, message: "Please Select Entity" }]}
              >
                <TreeSelect
                  showSearch
                  treeDefaultExpandAll={false}
                  allowClear
                  treeData={this.state.parentTreeList}
                  onChange={this.handleEntityChange}
                />
              </Form.Item>
            </Col>
            <Col lg={6}>
              <Form.Item
                label="Asset Library"
                name="assetLibraryId"
                rules={[
                  { required: false, message: "Please select asset library" },
                ]}
              >
                <Select
                  options={this.state.assetLibraryOptions ?? []}
                  onChange={this.handleAssetLibraryChange}
                />
              </Form.Item>
            </Col>

            <Col md={6}>
              <Form.Item
                label="Category"
                name="assetCategory"
                rules={[{ required: true, message: "Please Select Category" }]}
              >
                <Radio.Group
                  onChange={this.assetCategoryChange}
                  // disabled={true}
                  // disabled={true}
                >
                  <Radio value={1}>Others</Radio>
                  <Radio value={2}>Energy</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item
                label="Energy Limit"
                name={"energyLimit"}
                rules={[
                  {
                    required: this.state.openLimit,
                    message: "Please enter the limit",
                  },
                ]}
              >
                <InputNumber
                  disabled={!this.state.openLimit}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col md={6}>
              <Form.Item
                label="Parent"
                name="parentId"
                // rules={
                //   parentIdView === 2
                //     ? [{ required: true, message: "Please Select Parent" }]
                //     : undefined
                // }
              >
                <Select disabled={!(parentIdView === 2)}>
                  {this.state.assetList?.map((e) => (
                    <Option key={e.assetId} value={e.assetId}>
                      {e.assetName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col md={6}>
              <Form.Item
                name="active"
                label="Status"
                rules={[{ required: true, message: "Please select Status" }]}
              >
                <Radio.Group>
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>Inactive</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item label="Description" name="description">
                <TextArea rows={3} maxLength={200} />
              </Form.Item>
            </Col>
            <Col md={24}>
              <Flex justify="flex-end">
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Flex>
            </Col>
          </Row>
        </Form>
        <Modal
          title="Image Preview"
          visible={this.state.previewVisible}
          footer={null}
          onCancel={this.handleCancel}
          style={{ width: "300px" }}
        >
          <img
            alt="Preview"
            style={{ width: "100%", height: "100%" }}
            src={imgurl || this.state.imageUrl}
            onClick={this.handleCancel}
          />
        </Modal>
      </Spin>
    );
  }
}

export default withRouter(withForm(BasicDetails));
