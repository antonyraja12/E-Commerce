import {
  Button,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Spin,
  TreeSelect,
  message,
} from "antd";
import React from "react";

import OrganisationService from "../../../services/organisation-service";
import PageForm from "../../../utils/page/page-form";
import { withForm } from "../../../utils/with-form";

import { validateName } from "../../../helpers/validation";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import AssetFamilyService from "../../../services/asset-family-service";
import AssetLibraryService from "../../../services/asset-library-service";
import LoginService from "../../../services/login-service";
import UserService from "../../../services/user-service";
import { withRouter } from "../../../utils/with-router";
const { TextArea } = Input;
const { Option } = Select;

class AssetLibraryBasicDetails extends PageForm {
  organisationService = new OrganisationService();
  authService = new LoginService();
  userservice = new UserService();
  service = new AssetLibraryService();
  appHierarchyService = new AppHierarchyService();
  assetFamilyService = new AssetFamilyService();
  closePopup = (id) => {
    if (!this.props.params.assetLibraryId) {
      this.props.navigate(`${id}/parameters`);
    }
  };
  onSuccess(data) {
    console.log("message", data);
    super.onSuccess({ message: data.message });
    this.closePopup(data.data.assetLibraryId);
  }

  getUserName = () => {
    let curruser = this.authService.getUserName();
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

    if (this.props.params.assetLibraryId) {
      this.onRetrieve(this.props.params.assetLibraryId);
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
    if (this.props.params.assetLibraryId)
      return this.service.update(data, this.props.params.assetLibraryId);
    return this.service.add(data);
  }
  patchForm(data) {
    // console.log("data", data);
    this.props.form.setFieldsValue({
      ...data,
      ahid: data.ahId,
    });

    // console.log("data", data);
  }
  checkFileType = (file) => {
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    const isImage = allowedFileTypes.includes(file.type);
    if (!isImage) {
      message.error("You can only upload image files (JPEG, PNG)");
    }
    return isImage;
  };
  beforeUpload = (file) => {
    this.checkFileType(file);
    return false;
  };
  imageCrop = (e) => {
    console.log(e);
  };
  normFile = (e) => {
    this.setState((state) => state);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  remove = (e) => {
    this.props.form.setFieldValue("image", []);
    this.props.form.setFieldValue("imagePath", null);
    this.setState((state) => state);
    return false;
  };
  onComplete = (data) => {
    // console.log("data", data);
  };
  assetCategoryChange = (val) => {
    // console.log("val", val);
    if (val.target.value === 2) {
      this.setState((state) => ({ ...state, parentIdView: true }));
    } else {
      this.setState((state) => ({ ...state, parentIdView: false }));
    }
  };
  render() {
    return (
      <Spin spinning={!!this.state.isLoading}>
        <Form
          form={this.props.form}
          colon={false}
          layout="vertical"
          onFinish={this.onFinish}
          preserve={false}
        >
          <Row gutter={[20, 20]}>
            <Col sm={12} xs={24}>
              <Form.Item name="assetLibraryId" hidden>
                <Input />
              </Form.Item>

              <Form.Item
                name="assetLibraryName"
                label="Asset Library Name"
                rules={[
                  {
                    required: true,
                    message: "Please input the Asset Library Name",
                  },
                  {
                    validator: validateName,
                  },
                ]}
              >
                <Input
                  autoFocus
                  minLength={4}
                  maxLength={200}
                  // onKeyDown={removeSpaceAndSpecialChar}
                />
              </Form.Item>
              <Form.Item
                label="Entity"
                name="ahId"
                rules={[{ required: true, message: "Please Select Entity" }]}
              >
                <TreeSelect
                  showSearch
                  treeDefaultExpandAll={false}
                  allowClear
                  treeData={this.state.parentTreeList}
                />
              </Form.Item>
              <Form.Item
                label="Asset Category"
                name="assetCategory"
                rules={[
                  {
                    required: true,
                    message: "Please select asset category ",
                  },
                ]}
                initialValue={1}
              >
                <Radio.Group>
                  <Radio value={1}>Other Assets</Radio>
                  <Radio value={2}>Energy Meter</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col sm={12} xs={24}>
              <Form.Item label="Description" name="description">
                <Input.TextArea maxLength={200} rows={5} />
              </Form.Item>
              <Form.Item
                name="status"
                label="Status"
                initialValue={true}
                rules={[
                  {
                    required: true,
                    message: "Please select Status",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>Inactive</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col>
              <Button type="primary" htmlType="submit">
                Next
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    );
  }
}

export default withRouter(withForm(AssetLibraryBasicDetails));
