import React from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Steps,
  Switch,
  TreeSelect,
} from "antd";

import CheckService from "../../../../services/quality-inspection/check-service";
import CheckListService from "../../../../services/quality-inspection/checklist-service";

import Page from "../../../../utils/page/page";
import PageForm from "../../../../utils/page/page-form";
import { withForm } from "../../../../utils/with-form";
import { withRouter } from "../../../../utils/with-router";
import ChecksSelectionList from "./checks-selection-list";
import { checklistPageId } from "../../../../helpers/page-ids";
import AppHierarchyService from "../../../../services/app-hierarchy/app-hierarchy-service";
import AssetService from "../../../../services/asset-service";
import { validateName } from "../../../../helpers/validation";
import { MdGroups, MdPerson } from "react-icons/md";
import AssetLibraryService from "../../../../services/asset-library-service";
const { TextArea } = Input;
const { Option } = Select;

class ChecklistForm extends PageForm {
  pageId = checklistPageId;
  state = { current: 0, form: {}, mode: null };
  checkservice = new CheckService();
  service = new CheckListService();
  appHierarchyService = new AppHierarchyService();
  assetService = new AssetService();
  assetLibraryService = new AssetLibraryService();
  componentDidMount() {
    this.checkservice.list({ active: true }).then((response) => {
      this.setState((state) => ({ ...state, checks: response.data }));
    });

    if (this.props.params.id) {
      this.onRetrieve(this.props.params.id);
      this.closePopup = () => this.props.navigate("..");
      if (this.props.mode === "Edit")
        this.setState((state) => ({ ...state, title: "Edit Checklist" }));
      else if (this.props.mode === "View")
        this.setState((state) => ({
          ...state,
          title: "View Checklist",
          disabled: true,
        }));
    } else {
      this.setState((state) => ({ ...state, title: "Add Checklist" }));
    }
    this.getAssetList();
    this.loadAppHierarchy();
    this.loadAssetLibrary();
    super.componentDidMount();
  }

  loadAppHierarchy = () => {
    this.appHierarchyService
      .list()
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

  closePopup = () => {
    this.props.navigate("..");
  };

  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(data.data.checkListId);
  }

  save(checks) {
    this.onSubmit({ ...this.state.formValue, checks: checks });
    this.checkservice.list({ active: true }).then((response) => {
      this.setState((state) => ({ ...state, checks: response.data }));
    });
  }

  getAssetList(ahid) {
    this.setState((state, props) => ({
      ...state,
      isAssetListLoading: true,
      assetList: [], // Clear previous asset list
    }));

    this.assetService
      .list({ active: true, aHId: ahid }) // Use ahid parameter
      .then((response) => {
        this.setState(
          (state, props) => ({
            ...state,
            assetList: response.data?.map((e) => ({
              label: e.assetName,
              value: e.assetId,
            })),
          }),
          () => {
            // Optional: Set default asset if needed
            const { form } = this.props;
            const firstAsset = response.data[0];
            if (firstAsset && form) {
              form.setFieldsValue({
                assetId: firstAsset.assetId,
              });
            }
          }
        );
      })
      .finally(() => {
        this.setState((state, props) => ({
          ...state,
          isAssetListLoading: false,
        }));
      });
  }

  onChange = (value) => {
    this.setState((state) => ({ ...state, current: value }));
  };

  onNext = (value) => {
    this.setState(
      (state) => ({ ...state, formValue: value }),
      () => {
        this.onChange(1);
      }
    );
  };

  loadAssetLibrary = () => {
    this.assetLibraryService.list().then(({ data }) => {
      let options = data.map((e) => ({
        value: e.assetLibraryId,
        label: e.assetLibraryName,
        // Add a new property to hold the corresponding asset category
      }));
      this.setState((state) => ({ ...state, assetLibraryOptions: options }));
    });
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
        this.setState((state) => ({ ...state, parentIdView: true }));
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

  patchForm(data) {
    // console.log("data", data);
    if (this.props.form) {
      this.props.form.setFieldsValue({
        ...data,
        assets: data.assets?.map((e) => e.asset.assetId),
        ahid: data.assets?.map((e) => e.asset.ahid),
      });
    }
  }

  prev = () => {
    this.onChange(0);
  };

  render() {
    const { current, isLoading } = this.state;

    const content = () => {
      switch (current) {
        case 0:
          return (
            <Form
              size="small"
              form={this.props.form}
              className="form-horizontal"
              colon={false}
              labelCol={{ sm: 8, xs: 24 }}
              wrapperCol={{ sm: 16, xs: 24 }}
              labelAlign="left"
              layout="horizontal"
              onFinish={this.onNext}
              disabled={this.state?.disabled}
            >
              <Row gutter={[20, 20]} justify="space-between">
                <Col sm={16} xs={24}>
                  <Form.Item name="checkListId" hidden>
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="checkListName"
                    label="Checklist Name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the Checklist Name!",
                      },
                      {
                        validator: validateName,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Entity"
                    name="ahid"
                    rules={[
                      { required: true, message: "Please Select Entity" },
                    ]}
                  >
                    <TreeSelect
                      showSearch
                      treeDefaultExpandAll={false}
                      allowClear
                      treeData={this.state.parentTreeList}
                      onChange={(value) => this.getAssetList(value)}
                      filterTreeNode={(input, treeNode) =>
                        treeNode.title
                          .toLowerCase()
                          .includes(input.toLowerCase()) || input === ""
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    name="assets"
                    label="Asset Name"
                    rules={[
                      {
                        required: true,
                        message: "Please select an Asset Name!",
                      },
                    ]}
                  >
                    <Select mode="multiple" optionFilterProp="children">
                      {this.state.assetList?.map((e) => (
                        <Select.Option
                          key={`AssetName${e.value}`}
                          value={e.value}
                        >
                          {e.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item label="Description" name="description">
                    <TextArea rows={6} maxLength={200} />
                  </Form.Item>
                  <Form.Item name="active" label="Status" initialValue={true}>
                    <Radio.Group>
                      <Radio value={true}>Active</Radio>
                      <Radio value={false}>Inactive</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              <Row justify="end">
                <Col>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={this.state.disabled === false}
                  >
                    Next
                  </Button>
                </Col>
              </Row>
            </Form>
          );
        case 1:
          return (
            <ChecksSelectionList
              checks={this.state.initialValues?.checks ?? []}
              save={(checks) => this.save(checks)}
              prev={() => this.prev()}
              mode={this.props.mode}
            />
          );
        default:
          break;
      }
    };
    // console.log("mode", this.props.mode);
    return (
      <Page title="Checklist">
        <Spin spinning={!!isLoading}>
          <br></br>
          <Row justify="center" gutter={[10, 10]}>
            <Col sm={18}>
              <Steps current={current} progressDot>
                <Steps.Step title="General Details"></Steps.Step>
                <Steps.Step title="Check Items"></Steps.Step>
              </Steps>
              <br />
              <Card bordered={false}>{content()}</Card>
            </Col>
          </Row>
        </Spin>
      </Page>
    );
  }
}

export default withRouter(withForm(ChecklistForm));
