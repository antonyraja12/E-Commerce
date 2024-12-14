import {
  Form,
  Upload,
  Row,
  Col,
  Button,
  message,
  Spin,
  Table,
  Space,
  Avatar,
  Modal,
  Select,
  Typography,
} from "antd";

import React, { Component } from "react";
import { publicUrl } from "../../../helpers/url";

import ImgCrop from "antd-img-crop";
import LogoService from "../../../services/logo-service";

import { PlusOutlined } from "@ant-design/icons";

import { Image } from "antd";
import Page from "../../../utils/page/page";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";

class LogoUpload extends Component {
  state = {
    isLoading: false,
    collapsedLogo: [],
    mainLogo: [],
    previewVisible: false,
    previewImage: "",
    previewTitle: "Preview",
    isOrganizationListLoading:false,
    organizationList:[],
    selectedOrganization:null,
  };

  service = new LogoService();
  appHierarchyService = new AppHierarchyService();

  componentDidMount() {
    // this.fetchData();
    this.getOrganizationList();
  }
  fetchData = () => {
    if(this.state.selectedOrganization){
      this.setState((state) => ({
      ...state,
      isLoading: true,
      collapsedLogo: [],
      mainLogo: [],
    }));
    this.service
      .getData(this.state.selectedOrganization)
      .then(({ data }) => {
        // console.log(data);
        const mainLogoArray = data[0].mainLogo
          ? [
              {
                uid: "-1",
                name: data[0].mainLogo,
                status: "done",
                url: `${publicUrl}/${data[0].mainLogo}`,
              },
            ]
          : [];
        const collapsedLogoArray = data[0].collapsedLogo
          ? [
              {
                uid: "-2",
                name: data[0].collapsedLogo,
                status: "done",
                url: `${publicUrl}/${data[0].collapsedLogo}`,
              },
            ]
          : [];
        this.setState({
          ...this.state,
          mainLogo: mainLogoArray,
          collapsedLogo: collapsedLogoArray,
        });
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
      });
    }
  };

  handleDelete = (mode) => {
    this.deleteImage(mode);
  };

  imageUpload = (file, type) => {
    this.setState({ isLoading: true });
    return this.service
      .logoUpload(file, type, this.state.selectedOrganization)
      .then(({ data }) => {
        data.success
          ? message.success(data.message)
          : message.error(data.message);
        if (data.success) {
          this.fetchData();
        }
      })
      .catch(() => {
        message.error("Error uploading image.");
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  deleteImage = (mode) => {
    Modal.confirm({
      title: "Are you sure to delete?",
      onOk: () => {
        this.setState({ isLoading: true });
        this.service
          .deleteFile(mode,this.state.selectedOrganization)
          .then(({ data }) => {
            data.success
              ? message.success(data.message)
              : message.error(data.message);
            if (data.success) {
              this.fetchData();
            }
          })
          .catch(() => {
            message.error("Error deleting image.");
          })
          .finally(() => {
            this.setState({ isLoading: false });
          });
      },
    });
  };

  onChange = (e) => {
    if (e.fileList.length > 0)
      return this.imageUpload(e.fileList[0].originFileObj, 2);
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  getOrganizationList() {
    this.setState((state, props) => ({
      ...state,
      isOrganizationListLoading: true,
      organizationList: [],
      selectedOrganization:null,
    }));

    this.appHierarchyService
      .list({ mode: "Organization" })
      .then((response) => {
        this.setState(
          (state, props) => ({
            ...state,
            organizationList: response.data?.map((e) => ({
              label: e.ahname,
              value: e.ahid,
            })),
          })
        );
      })
      .finally(() => {
        this.setState((state, props) => ({
          ...state,
          isOrganizationListLoading: false,
        }));
      });
  }
  render() {
    const {
      isLoading,
      collapsedLogo,
      mainLogo,
      previewVisible,
      previewImage,
      previewTitle,
    } = this.state;
    return (
    <Page><Spin spinning={isLoading}>
        <Row gutter={[20, 20]}>
        {/* <Col sm={24}>
        <Typography.Text strong>Select Organization</Typography.Text>
      </Col> */}
      <Col sm={24}>
      <Select
                  style={{width:"25%"}}
                  optionFilterProp="label"
                  showSearch
                  placeholder="Select Organization"
                  allowClear
                  loading={this.state.isOrganizationListLoading}
                  options={this.state.organizationList}
                  onChange = {(value) => {
                    this.setState(
                      (state) => ({ ...state, selectedOrganization: value }),
                      () => {
                        this.fetchData();
                      }
                    );
                  }}
                  ></Select>
      </Col>
          { this.state.selectedOrganization && <Col sm={24}>
            <Form
              wrapperCol={{ span: 12 }}
              labelCol={{ span: 10 }}
              size="small"
              layout="horizontal"
            >
              <Form.Item label="Main Logo Upload">
                <Upload
                  onRemove={() => this.handleDelete(1)}
                  beforeUpload={(file, fileList) => {
                    return this.imageUpload(file, "mainLogo");
                  }}
                  //onChange={this.onChange}
                  onPreview={this.handlePreview}
                  listType="picture-card"
                  maxCount={1}
                  fileList={mainLogo}
                >
                  {mainLogo.length === 0 && <PlusOutlined />}
                </Upload>
              </Form.Item>
              <Form.Item label="Collapse Logo Upload">
                <ImgCrop rotate aspect={1 / 1}>
                  <Upload
                    action={null}
                    // onChange={this.onChange}
                    beforeUpload={(file, fileList) => {
                      return this.imageUpload(file, "collapsedLogo");
                    }}
                    listType="picture-card"
                    maxCount={1}
                    fileList={collapsedLogo}
                    onPreview={this.handlePreview}
                    onRemove={() => this.handleDelete(2)}
                  >
                    {collapsedLogo.length === 0 && <PlusOutlined />}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Form>
            <Image
              preview={{
                visible: previewVisible,
                src: previewImage,
                onVisibleChange: (visible, prevVisible) => {
                  if (!visible) this.handleCancel();
                },
              }}
            />
          </Col> }
        </Row>
      </Spin>
      </Page>  
    );
  }
}

export default LogoUpload;
