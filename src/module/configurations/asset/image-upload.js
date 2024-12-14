
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Form, Upload, Row, Col, Button, message } from "antd";
import React, { Component } from "react";
import { publicUrl } from "../../../helpers/url";
import AssetService from "../../../services/asset-service";
import { withForm } from "../../../utils/with-form";
import ImgCrop from "antd-img-crop";
import asset from "./asset";
class ImageUpload extends Component {
  state = { fileList: [], file: null, isLoading: false };
  service = new AssetService();
  back = () => {
    this.props.prev();
  };
  next = () => {
    this.props.next();
  };
  beforeUpload = (file, fileList) => {
    return false;
  };
  componentDidMount() {
    this.getImage();
  }
  onChange = ({ fileList: newFileList }) => {
    this.imageUpload(newFileList[0]?.originFileObj);
  };
  getImage() {
    this.setState({ ...this.state, isLoading: true });
    this.service
      .retrieve(this.props.assetId)
      .then((response) => {
        let url = response.data.imagePath;
        if (url) {
          this.setState((state) => ({
            ...state,
            fileList: [
              {
                uid: "-1",
                name: url.substring(url.lastIndexOf("/") + 1),
                status: "done",
                thumbUrl: `${publicUrl}/${response.data.imagePath}`,
                url: `${publicUrl}/${response.data.imagePath}`,
              },
            ],
          }));
        }
      })
      .catch((error) => {
        console.log(message);
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
      });
  }
  imageUpload = (file) => {
    this.setState({ ...this.state, isLoading: true });
    this.service
      .image(file, this.props.assetId)
      .then(({ data }) => {
        if (data.success) {
          message.success(data.message);
          this.getImage();
        } else {
          message.error(data.message);
        }
      })
      .catch((error) => {
        console.log(message);
      })
      .finally(() => {
        this.setState({ ...this.state, isLoading: false });
      });
  };
  render() {
    return (
      <>
        <Row gutter={[20, 20]}>
          <Col sm={24}>
            <Form
              size="small"
              layout="vertical"
              // form={this.props.form}
              className="form-horizontal"
              // onFinish={this.onFinish}
            >
              <Form.Item label="Image">
                <ImgCrop rotate aspect={1 / 1}>
                  <Upload.Dragger
                    maxCount={1}
                    action={null}
                    listType="picture"
                    fileList={this.state.fileList}
                    onChange={this.onChange}

                    // onRemove={}
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
                </ImgCrop>
              </Form.Item>
            </Form>
          </Col>
          <Col span={24}>
            <Row justify="space-between">
              <Col>
                <Button onClick={this.back}>Back</Button>
              </Col>
              <Col>
                <Button type="primary" onClick={this.next}>
                  Next
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  }
}

export default withForm(ImageUpload);
