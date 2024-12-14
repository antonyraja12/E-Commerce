import {
  Button,
  Form,
  Input,
  TreeSelect,
  Radio,
  Spin,
  Row,
  Col,
  Select,
  InputNumber,
  Drawer,
  Space,
  Image,
  Upload,
  message,
  Modal,
  Divider,
  Table,
  Flex,
  Popconfirm,
  Checkbox,
} from "antd";
import {
  EditOutlined,
  ExclamationCircleFilled,
  ExclamationCircleOutlined,
  ExclamationOutlined,
  InfoCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import PageForm from "../../../utils/page/page-form";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import { appHierarchyPageId } from "../../../helpers/page-ids";
import LocationService from "../../../services/preventive-maintenance-services/location-service";
import ImgCrop from "antd-img-crop";
import {
  DeleteOutlined,
  InboxOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  validateDecimal,
  validateName,
  validateNumber,
} from "../../../helpers/validation";
import { remoteAsset } from "../../../helpers/url";
import {
  DeleteButton,
  EditButton,
} from "../../../utils/action-button/action-button";
import IndustrialType from "./industrial-type";
import IndustrialTypeService from "../../../services/app-hierarchy/industrial-type-service";
import LoginService from "../../../services/login-service";
import { active } from "d3";

class AppHierarchyForm extends PageForm {
  industrialService = new IndustrialTypeService();
  auth = new LoginService();

  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: null,
      selectedValue: null,
      openOrganization: false,
      openPlant: false,
      openDepartment: false,
      openCustomer: false,
      mainLogo: null,
      collapsedLogo: null,
      isModalOpen: false,
      featureEditMode: false,
      featureEditId: null,
      isFeatureDisabled: true,
      showPopconfirm: false,
      industrialTypeId: " ",
      industrialTypeName: [],

      selectedIndustries: " ",
    };
    this.featureEditModeCancel = this.featureEditModeCancel.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }
  getUserName = () => {
    return this.auth.getUserName();
  };

  handleRadioButtonChange = (e) => {
    console.log(e, "eee");
    this.setState({ loadLibraryData: e.target.value === "Yes" });
  };
  onChange = (value) => {
    this.setState({ selectedValue: value });
  };

  checkFileType = (file) => {
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    const isImage = allowedFileTypes.includes(file.type);
    const maxSizeInBytes = 10 * 1024 * 1024;
    const isLtSize = file.size <= maxSizeInBytes;
    if (!isImage) {
      throw new Error("You can only upload image files (JPEG, JPG, PNG)!");
    } else if (!isLtSize) {
      throw new Error("Image must be smaller than 10MB!");
    }

    return true;
  };

  beforeUpload = (file, type) => {
    try {
      this.checkFileType(file);
      const logoUrl = URL.createObjectURL(file);
      let logoKey = "";
      this.setState({ errorMessage: "" });
      if (type === 1) logoKey = "mainLogo";
      if (type === 2) logoKey = "collapsedLogo";
      this.setState((state) => ({ ...state, [logoKey]: logoUrl }));
    } catch (error) {
      console.log(type, error.message);
      type == 1
        ? this.setState({ errorMessage: error.message })
        : this.setState({ errorMessage2: error.message });
      return false;
    }
    return false;
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
  normFile = (e) => {
    this.setState((state) => state);
    const isImage = this.checkFileType(e.file || e.fileList);

    const maxSizeInBytes = 10 * 1024 * 1024;
    const isLtSize = e.file.size < maxSizeInBytes;
    if (isImage && isLtSize && Array.isArray(e)) {
      this.setState((state) => ({
        ...state,
        errorMessage: "",
        errorMessage2: "",
        fileType: "",
      }));

      return e;
    }
    return isImage && isLtSize
      ? (() => {
          this.setState((state) => ({
            ...state,
            errorMessage: "",
            errorMessage2: "",
            fileType: "",
          }));
          return e.fileList;
        })()
      : null;
  };

  remove = (type) => {
    if (type === 1) {
      this.props.form.setFieldsValue({
        mainLogoPath: null,
        mainLogo: [],
      });
      this.setState((state) => ({ ...state, mainLogo: null }));
    }

    if (type === 2) {
      this.props.form.setFieldsValue({
        collapsedLogoPath: null,
        collapsedLogo: [],
      });
      this.setState((state) => ({ ...state, collapsedLogo: null }));
    }
  };
  handleCancel = () => {
    this.setState({ previewVisible: false, uploadInstructionVisible: false });
  };
  handleImageCancel = () => {
    this.setState({
      uploadInstructionVisible: false,
    });
  };
  imageInstruction = () => {
    this.setState({ uploadInstructionVisible: true });
  };
  loadCheckType = () => {
    this.setState((state) => ({ ...state, checkTypeLoading: true }));
    this.industrialService
      .list()
      .then((response) => {
        const sortedFeatureName = response.data
          .filter((feature) => feature.status === true)
          .sort((a, b) =>
            a.industrialTypeName.localeCompare(b.industrialTypeName)
          );
        const sortedFeatureNameForEdit = response.data.sort((a, b) =>
          a.industrialTypeName.localeCompare(b.industrialTypeName)
        );
        this.setState((state) => ({
          ...state,
          industrialTypeName: sortedFeatureName,
          featureNameForEdit: sortedFeatureNameForEdit,
        }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, checkTypeLoading: false }));
      });
  };
  showModal = () => {
    this.setState({ isModalOpen: true });
  };
  handlePreview = (type) => {
    this.setState((state) => ({ ...state, previewVisible: true, type: type }));
  };
  handelCancel = () => {
    this.setState((state) => ({ ...state, previewVisible: false, type: null }));
  };
  handleCategoryChange = (value) => {
    this.setState({ selectedCategory: value });
  };
  patchForm(data) {
    console.log(data, "patchform");
    this.setState({ showPopconfirm: true });
    if (this.props.form) {
      this.handleCategoryChange(data.mode);
      this.props.form.setFieldsValue(data);
      if (data.mode === "Customer") {
        this.props.form.setFieldsValue({
          ...data,
          mode: data.mode.toLowerCase(),
          address: data.customer?.address,
          latitude: data.customer?.latitude,
          longitude: data.customer?.longitude,
          contactDetails: data.customer?.contactDetails,
        });
      } else if (data.mode === "Plant") {
        this.props.form.setFieldsValue({
          ...data,
          mode: data.mode.toLowerCase(),
          latitude: data.plant?.latitude,
          longitude: data.plant?.longitude,
        });
      } else if (data.mode === "Organization") {
        this.props.form.setFieldsValue({
          ...data,
          mode: data.mode.toLowerCase(),
          latitude: data.organization?.latitude,
          longitude: data.organization?.longitude,
          industrialTypeId: data?.industrialTypeId,
          loadLibraryData: data?.loadLibraryData,
          mainLogoPath:
            data.organization?.mainLogo !== "null" &&
            data.organization?.mainLogo
              ? data.organization?.mainLogo
              : null,
          mainLogo:
            data.organization?.mainLogo !== "null" &&
            data.organization?.mainLogo
              ? [
                  {
                    uid: "-1",
                    name: "Logo Image",
                    status: "done",
                    url: remoteAsset(data.organization.mainLogo),
                  },
                ]
              : [],
          collapsedLogoPath:
            data.organization?.collapsedLogo !== "null" &&
            data.organization?.collapsedLogo
              ? data.organization?.collapsedLogo
              : null,
          collapsedLogo:
            data.organization?.collapsedLogo !== "null" &&
            data.organization?.collapsedLogo
              ? [
                  {
                    uid: "-1",
                    name: "Collapsed Logo Image",
                    status: "done",
                    url: remoteAsset(data.organization.collapsedLogo),
                  },
                ]
              : [],
        });
      } else {
        this.props.form.setFieldsValue({
          ...data,
          mode: data.mode.toLowerCase(),
        });
      }
    }
  }
  renderFormItems = (mainLogoCount, collapsedLogoCount) => {
    const { selectedCategory } = this.state;
    switch (selectedCategory?.toLowerCase()) {
      case "plant":
        return (
          <>
            <Form.Item
              label="Latitude"
              name="latitude"
              rules={[
                {
                  required: true,
                  message: "Please enter latitude",
                },
                {
                  validator: validateDecimal,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Longitude"
              name="longitude"
              rules={[
                {
                  required: true,
                  message: "Please enter longitude ",
                },
                {
                  validator: validateDecimal,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </>
        );
      case "department":
        return <></>;

      case "line":
        return <></>;
      case "organization":
        return (
          <>
            <Col>
              <Form.Item name="mainLogoPath" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                label="Logo"
                name="mainLogo"
                valuePropName="fileList"
                getValueFromEvent={this.normFile}
              >
                <Upload
                  action="/upload.do"
                  accept=".jpg, .jpeg, .png, .gif, .webp"
                  maxCount={1}
                  // onChange={this.imageCrop}
                  beforeUpload={(file) => this.beforeUpload(file, 1)}
                  listType="picture-card"
                  onRemove={() => this.remove(1)}
                  onPreview={() => this.handlePreview(1)}
                >
                  {!mainLogoCount && <PlusOutlined />}
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
            <Col>
              <Form.Item name="collapsedLogoPath" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                label="Collapsed Logo"
                name="collapsedLogo"
                valuePropName="fileList"
                getValueFromEvent={this.normFile}
              >
                <Upload
                  action="/upload.do"
                  accept=".jpg, .jpeg, .png, .gif, .webp"
                  maxCount={1}
                  // onChange={this.imageCrop}
                  beforeUpload={(file) => this.beforeUpload(file, 2)}
                  listType="picture-card"
                  onRemove={() => this.remove(2)}
                  onPreview={() => this.handlePreview(2)}
                >
                  {!collapsedLogoCount && <PlusOutlined />}
                </Upload>
              </Form.Item>{" "}
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
              {this.state.errorMessage2 && (
                <div style={{ marginTop: "8px", color: "red" }}>
                  {this.state.errorMessage2}
                </div>
              )}
            </Col>
            <Form.Item
              label="Latitude"
              name="latitude"
              rules={[
                {
                  required: true,
                  message: "Please enter latitude",
                },
                {
                  validator: validateDecimal,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Longitude"
              name="longitude"
              rules={[
                {
                  required: true,
                  message: "Please enter longitude ",
                },
                {
                  validator: validateDecimal,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={`Industrial Type`}
              name="industrialTypeId"
              rules={[
                {
                  required: true,
                  message: "Please enter Industrial Type",
                },
              ]}
            >
              <Select
                optionFilterProp="label"
                value={this.state.selectedIndustries}
                onChange={this.handleSelectChange}
                options={this.state.industrialTypeName.map((e) => ({
                  label: e.industrialTypeName,
                  value: e.industrialTypeId,
                }))}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: "5px 0px 0px" }} />
                    <IndustrialType
                      handleCancel={this.handleCancel}
                      mode={"Add"}
                    />
                    {this.getUserName() === "Administrator" && (
                      <Button
                        icon={<EditOutlined />}
                        block
                        onClick={this.showModal}
                        // disabled={this.state.isFeatureDisabled}
                      >
                        Edit list
                      </Button>
                    )}
                  </>
                )}
              />
            </Form.Item>
            {this.state.showPopconfirm && (
              <Form.Item
                label="Do you want to load the default asset library?"
                name="loadLibraryData"
                labelCol={24}
              >
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            )}
          </>
        );
      case "line":
        return <></>;
      case "customer":
        return (
          <>
            <Form.Item
              label="Address"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Please enter address",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.List name="contactDetails">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Form.Item label="Contact Details" required key={key}>
                      <Row align="bottom" gutter={10}>
                        <Col span={11}>
                          <Form.Item
                            style={{ margin: 0 }}
                            {...restField}
                            noStyle
                            name={[name, "customerName"]}
                            rules={[
                              {
                                required: true,
                                message: "",
                              },
                              {
                                validator: validateName,
                              },
                            ]}
                          >
                            <Input placeholder="Customer Name" />
                          </Form.Item>
                        </Col>
                        <Col span={11}>
                          <Form.Item
                            style={{ margin: 0 }}
                            noStyle
                            {...restField}
                            name={[name, "phoneNumber"]}
                            rules={[
                              {
                                required: true,
                                message: "",
                              },
                              {
                                validator: validateNumber,
                              },
                            ]}
                          >
                            <Input placeholder="Phone Number" />
                          </Form.Item>
                        </Col>
                        {!this.props.disabled && (
                          <Col span={2}>
                            <Form.Item style={{ margin: 0 }}>
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                              />
                            </Form.Item>
                          </Col>
                        )}
                      </Row>
                    </Form.Item>
                  ))}
                  {!this.props.disabled && (
                    <Form.Item label=" ">
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Contact Details
                      </Button>
                    </Form.Item>
                  )}
                </>
              )}
            </Form.List>
            <Form.Item
              label="Latitude"
              name="latitude"
              rules={[
                {
                  required: true,
                  message: "Please enter latitude",
                },
                {
                  validator: validateDecimal,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Longitude"
              name="longitude"
              rules={[
                {
                  required: true,
                  message: "Please enter longitude ",
                },
                {
                  validator: validateDecimal,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  pageId = appHierarchyPageId;
  service = new AppHierarchyService();
  locationService = new LocationService();

  closePopup = (v = false) => {
    this.props.form.resetFields();
    this.setState((state) => ({
      ...state,
      mainLogo: null,
      collapsedLogo: null,
      showPopconfirm: false,
    }));
    this.handleCategoryChange(null);
    this.props.close(v);
  };

  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
    this.loadParent();
    this.loadLocationParent();
  }

  componentDidMount() {
    this.setState({ selectedIndustries: " ", showPopconfirm: false });
    this.loadParent();
    this.loadLocationParent();
    this.loadCheckType();
    super.componentDidMount();
  }

  showOrganization = () => {
    this.setState({ openOrganization: true });
  };

  showPlant = () => {
    this.setState({ openPlant: true });
  };

  showDepartment = () => {
    this.setState({ openDepartment: true });
  };

  showCustomer = () => {
    this.setState({ openCustomer: true });
  };

  onClose = () => {
    this.setState({
      openOrganization: false,
      openPlant: false,
      openDepartment: false,
      openCustomer: false,
    });
  };
  onFinish1 = (formValues) => {
    const { category, ...rest } = formValues;

    this.setState({ showPopconfirm: false });
    console.log(rest, "rest");
    const baseStructure = {
      active: rest?.active,
      locationId: rest?.locationId,
      ahname: rest?.ahname,
      ahlevel: rest?.ahlevel,
      ahparentId: rest?.ahparentId,
    };

    const categoryStructures = {
      department: {
        mode: "Department",
        department: {
          departmentName: rest?.departmentName,
          parentId: rest?.ahparentId,

          description: rest?.description,
          latitude: rest?.latitude,
          longitude: rest?.longitude,
          createdOn: "2023-12-12T06:18:53.014Z",
          updatedOn: "2023-12-12T06:18:53.014Z",
        },
      },
      plant: {
        mode: "Plant",
        plant: {
          plantName: rest?.plantName,
          parentId: rest?.ahparentId,
          imageUrl: rest?.imageUrl || "string",
          description: rest?.description,
          latitude: rest?.latitude,
          longitude: rest?.longitude,
          createdOn: "2023-12-12T06:18:53.014Z",
          updatedOn: "2023-12-12T06:18:53.014Z",
        },
      },

      line: {
        mode: "Line",
        line: {
          lineName: rest?.lineName,
          parentId: rest?.ahparentId,
          description: rest?.description,
          latitude: rest?.latitude,
          longitude: rest?.longitude,
          createdOn: "2023-12-12T06:18:53.014Z",
          updatedOn: "2023-12-12T06:18:53.014Z",
        },
      },
      customer: {
        mode: "Customer",
        customer: {
          customerName: rest?.customerName,
          parentId: rest?.ahparentId,
          description: rest?.description,
          latitude: rest?.latitude,
          longitude: rest?.longitude,
          address: rest?.address,
          createdOn: "2023-12-12T06:18:53.014Z",
          updatedOn: "2023-12-12T06:18:53.014Z",
          contactDetails: rest?.contactDetails,
        },
      },
    };

    if (rest.mode === "organization") {
      const transformedValues = {
        ...baseStructure,
        latitude: rest?.latitude,
        longitude: rest?.longitude,
        mode: "Organization",
        mainLogoPath: rest?.mainLogoPath,
        mainLogo: rest?.mainLogo,
        collapsedLogoPath: rest?.collapsedLogoPath,
        collapsedLogo: rest?.collapsedLogo,
        industrialTypeId: rest?.industrialTypeId,
        loadLibraryData: rest?.loadLibraryData,
      };
      let formData = new FormData();
      for (let key in transformedValues) {
        if (transformedValues.hasOwnProperty(key)) {
          let value = transformedValues[key];
          if (key === "mainLogo" || key === "collapsedLogo") {
            if (value?.length > 0) formData.append(key, value[0].originFileObj);
            else formData.append(key, "");
          } else {
            formData.append(key, value);
          }
        }
      }

      if (this.props.id) {
        this.service
          .updateOrganization(formData, this.props.id)
          .then((response) => {
            this.onSuccess(response.data);
          });
      } else {
        this.service.addOrganization(formData).then((response) => {
          this.onSuccess(response.data);
        });
      }
    } else {
      const transformedValues = {
        ...baseStructure,
        ...categoryStructures[rest.mode],
      };
      this.onFinish(transformedValues);
    }
  };

  loadParent = () => {
    this.setState((state) => ({ ...state, isParentLoading: true }));
    this.service
      .list({})
      .then(({ data }) => {
        this.setState(
          (state) => ({
            ...state,
            parentTreeList: this.service.convertToSelectTree(data),
          }),
          () => {}
        );
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isParentLoading: false }));
      });
  };

  loadLocationParent = () => {
    this.setState((state) => ({ ...state, isParentLoading: true }));
    this.locationService
      .list({ active: true })
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          parentTreeList1: this.locationService.convertToSelectTree(data),
        }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isParentLoading: false }));
      });
  };
  handleCancel = () => {
    this.setState({
      isModalOpen: false,
      featureEditMode: false,
      featureEditId: null,
    });
    this.componentDidMount();
  };
  featureEdit(value) {
    this.setState({ featureEditMode: true, featureEditId: value });
  }

  featureDelete(value) {
    this.industrialService.delete(value).then((response) => {
      if (response.data.success) {
        this.loadCheckType();
      }
    });
  }

  featureEdit(value) {
    this.setState({ featureEditMode: true, featureEditId: value });
  }

  featureEditModeCancel() {
    this.setState((state) => ({
      ...state,
      featureEditMode: false,
      featureEditId: null,
    }));
  }
  handleSelectChange = (value) => {
    console.log("Selected value:", value);
    this.setState({ selectedIndustries: value, showPopconfirm: true });
  };

  render() {
    const { form } = this.props;
    const { industrialTypeName, isFeatureDisabled } = this.state;
    const mainLogoCount = form.getFieldValue("mainLogo")?.length;
    const mainLogoPath = mainLogoCount ? form.getFieldValue("mainLogo") : null;
    const mainLogourl = mainLogoCount ? mainLogoPath[0]?.url : null;

    const collapsedLogoCount = form.getFieldValue("collapsedLogo")?.length;
    const collapsedLogoPath = collapsedLogoCount
      ? form.getFieldValue("collapsedLogo")
      : null;
    const collapsedLogourl = collapsedLogoCount
      ? collapsedLogoPath[0]?.url
      : null;
    const columns = [
      {
        dataIndex: "sno",
        key: "sno",
        title: "S.No",
        align: "left",
        width: 0,
        render: (value, record, index) => {
          return index + 1;
        },
      },
      {
        title: "IndustrialType Name",
        dataIndex: "industrialTypeName",
        key: "industrialTypeName",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (value) => {
          return value ? "Active" : "Inactive";
        },
      },
      {
        title: "Action",
        dataIndex: "industrialTypeId",
        key: "industrialTypeId",
        align: "center",
        width: "100px",
        render: (value) => (
          <Flex>
            <EditButton onClick={() => this.featureEdit(value)} />
            <DeleteButton onClick={() => this.featureDelete(value)} />
          </Flex>
        ),
      },
    ];
    console.log(this.state, "state");
    console.log(this.getUserName(), "props");

    return (
      <>
        <Popups
          // width={800}
          // height={600}
          title={this.state?.title}
          open={this.state?.open}
          onCancel={this.closePopup}
          footer={[
            <Row justify="space-between" key="footer-row">
              <Col key="cancel-button">
                {(this.props.mode === "Add" ||
                  this.props.mode === "Update") && (
                  <Button onClick={this.closePopup} key="close">
                    Cancel
                  </Button>
                )}
              </Col>
              <Col key="submit-button">
                {(this.props.mode === "Add" ||
                  this.props.mode === "Update") && (
                  <Button
                    type="primary"
                    onClick={this.props.form.submit}
                    htmlType="submit"
                    key="submit"
                  >
                    {this.props.mode === "Add" ? "Save" : "Update"}
                  </Button>
                )}
              </Col>
            </Row>,
          ]}
        >
          <Spin spinning={!!this.state.isLoading}>
            <Form
              ref={this.formRef}
              name="dynamic_form_nest_item"
              style={{
                maxWidth: 600,
              }}
              autoComplete="off"
              size="small"
              className="form-horizontal"
              layout="horizontal"
              form={this.props.form}
              labelAlign="left"
              colon={false}
              labelCol={{ sm: 8, xs: 24 }}
              wrapperCol={{ sm: 16, xs: 24 }}
              disabled={this.props.disabled}
              onFinish={this.onFinish1}
            >
              <Form.Item
                label="Name"
                name="ahname"
                rules={[
                  {
                    required: true,
                    message: "Please enter name",
                  },
                  {
                    validator: validateName,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Category"
                name="mode"
                rules={[
                  {
                    required: true,
                    message: "Please select a category",
                  },
                ]}
              >
                <Select onChange={this.handleCategoryChange}>
                  <Select.Option value="organization">
                    Organization
                  </Select.Option>
                  <Select.Option value="department">Department</Select.Option>
                  <Select.Option value="plant">Plant</Select.Option>
                  <Select.Option value="line">Line</Select.Option>
                  <Select.Option value="customer">Customer</Select.Option>
                  <Select.Option value="others">Others</Select.Option>
                </Select>
              </Form.Item>
              {this.renderFormItems(mainLogoCount, collapsedLogoCount)}
              {this.props.form.getFieldValue("mode") != "organization" ? (
                <Form.Item label="Under" name="ahparentId" rules={[]}>
                  <TreeSelect
                    showSearch
                    treeDefaultExpandAll
                    style={{ width: "100%" }}
                    allowClear
                    treeData={this.state.parentTreeList}
                    treeNodeFilterProp="title"
                  />
                </Form.Item>
              ) : null}

              <Form.Item
                label="Location"
                name="locationId"
                rules={[
                  {
                    required: true,
                    message: "Please select location",
                  },
                ]}
              >
                <TreeSelect
                  showSearch
                  treeDefaultExpandAll
                  style={{ width: "100%" }}
                  allowClear
                  treeData={this.state.parentTreeList1}
                  treeNodeFilterProp="title"
                />
              </Form.Item>

              <Form.Item name="active" label="Status" initialValue={true}>
                <Radio.Group>
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>Inactive</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
            <Modal
              title="Image Preview"
              visible={this.state.previewVisible}
              footer={null}
              onCancel={this.handelCancel}
              style={{ width: "300px" }}
            >
              <img
                alt="Preview"
                style={{ width: "100%", height: "100%" }}
                src={
                  this.state.type &&
                  (this.state.type === 1
                    ? mainLogourl || this.state.mainLogo
                    : this.state.type === 2
                    ? collapsedLogourl || this.state.collapsedLogo
                    : undefined)
                }
                onClick={this.handelCancel}
              />
            </Modal>
            <Modal
              title="Edit IndustrialTypeName"
              open={this.state.isModalOpen}
              footer={null}
              onCancel={this.handleCancel}
            >
              {this.state.featureEditMode ? (
                <IndustrialType
                  handleCancel={this.handleCancel}
                  mode={"Update"}
                  featureEditModeCancel={this.featureEditModeCancel}
                  id={this.state.featureEditId}
                />
              ) : (
                <>
                  <Table
                    size="middle"
                    dataSource={this.state.featureNameForEdit}
                    columns={columns}
                    pagination={{
                      showSizeChanger: true,

                      size: "default",
                    }}
                    style={{ margin: "5px 0px 0px" }}
                  />
                </>
              )}
            </Modal>
          </Spin>
        </Popups>
      </>
    );
  }
}

export default withForm(AppHierarchyForm);
