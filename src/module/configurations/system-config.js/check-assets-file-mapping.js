import React, { Component } from "react";
import {
  Tabs,
  Form,
  Select,
  List,
  message,
  Upload,
  Button,
  Col,
  Row,
  Checkbox,
  Card,
  Spin,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import CheckAssetFileMappingService from "../../../services/check-asset-file-mapping";
import CheckService from "../../../services/preventive-maintenance-services/check-service";
import Page from "../../../utils/page/page";
import AssetService from "../../../services/asset-service";
import PageForm from "../../../utils/page/page-form";
import axios from "axios";

const { TabPane } = Tabs;
const { Option } = Select;

class CheckAssetFileMapping extends PageForm {
  title = "CheckAssetFileMapping";
  service = new CheckAssetFileMappingService();
  checkService = new CheckService();
  assetService = new AssetService();

  state = {
    checks: [],
    assets: [],
    selectedCheck: null,
    selectedAsset: null,
    sharedFile: null,
    singleFileUploadMode: false,
    uploadedFileUrl: null,
    selectedCheckValue: null,
    uploadForAll: false,
    selectedUsePrevious: [],
    check: [],
  };

  componentDidMount() {
    this.checkService.list({}).then((response) => {
      this.setState({ checks: response.data });
    });

    this.assetService.list({}).then((response) => {
      this.setState({ assets: response.data });
    });
    const initialCheckState = this.state.assets.map((asset, index) => {
      return index === 0 ? false : true;
    });

    this.setState({ check: initialCheckState });
    super.componentDidMount();
  }
  handleSingleFileUploadMode = () => {
    this.setState((state) => ({
      ...state,
      singleFileUploadMode: !state.singleFileUploadMode,
    }));
  };
  handleCheckSelect = (selectedCheck) => {
    if (!selectedCheck) {
      this.setState({
        selectedCheck: null,
        assets: [],
        selectedCheckValue: null,
      });
      return;
    }

    this.setState({ selectedCheck, selectedCheckValue: selectedCheck });
    this.assetService.list({ checkId: selectedCheck }).then((response) => {
      this.setState({ assets: response.data });
    });
  };
  handleCancel = () => {
    this.setState({
      selectedCheck: null,
      assets: [],
      selectedCheckValue: null,
      uploadForAll: false,
    });
  };

  handleFileUpload = (info, index) => {
    // console.log(index);
    const response = this.service.uploadFile(info).then((response) => {
      if (response?.data.success === true) {
        // message.success(response.data.message);
        let arr = [...this.state.assets];
        let obj = { ...arr[index], fileName: response.data.data };
        arr[index] = obj;
        // console.log(arr);
        this.setState((state) => ({
          ...state,
          assets: [...arr],
          uploadedFileUrl: response.data.data,
        }));

        this.onFinish({
          checkId: this.state.selectedCheck,
          assetId: arr[index].assetId,
          fileUrl: response.data.data,
        });
      } else {
        message.error(response?.data.message);
      }
    });
  };

  handlefiledelete = (index) => {
    let arr = [...this.state.assets];
    let obj = { ...arr[index], fileName: undefined };
    arr[index] = obj;
    this.setState((state) => ({ ...state, assets: [...arr] }));
  };

  handle_use_previous = (index, event, info) => {
    const { check } = this.state;
    const updatedCheck = [...check];
    updatedCheck[index] = event.target.checked;

    this.setState({ check: updatedCheck });

    let arr = [...this.state.assets];
    let fileUrl;
    let checkAssetsFileMappingId;

    if (index > 0) {
      let obj = { ...arr[index], fileName: arr[index - 1].fileName };
      arr[index] = obj;
      // console.log("useprevious", arr);

      // Set fileUrl based on checkbox state
      fileUrl = updatedCheck[index] ? arr[index - 1].fileName : undefined;

      // Set checkAssetsFileMappingId based on checkbox state
      checkAssetsFileMappingId = updatedCheck[index]
        ? arr[index - 1].checkAssetsFileMappingId
        : undefined;
    } else {
      let obj = { ...arr[index], fileName: undefined };
      arr[index] = obj;
      // console.log("useprevious", arr);

      // Set fileUrl based on checkbox state
      fileUrl = updatedCheck[index] ? undefined : null; // You can set this to any desired value

      // Set checkAssetsFileMappingId based on checkbox state and delete if unchecked
      if (!updatedCheck[index]) {
        checkAssetsFileMappingId = arr[index].checkAssetsFileMappingId;
        // Delete the checkAssetsFileMappingId using your service's delete method
        this.service
          .delete(checkAssetsFileMappingId)
          .then(() => {
            console.log(
              `Deleted checkAssetsFileMappingId: ${checkAssetsFileMappingId}`
            );
          })
          .catch((error) => {
            console.error(
              `Error deleting checkAssetsFileMappingId: ${checkAssetsFileMappingId}`,
              error
            );
          });
      }
    }

    this.setState({ assets: arr });

    if (updatedCheck[index]) {
      // Trigger onFinish if the checkbox is checked
      this.onFinish({
        checkId: this.state.selectedCheck,
        assetId: arr[index].assetId,
        fileUrl: fileUrl,
        checkAssetsFileMappingId: checkAssetsFileMappingId,
      });
    }
  };

  handleUploadForAllChange = (event) => {
    const { assets } = this.state;

    if (event.target.checked) {
      const firstAssetFileName = assets[0]?.fileName;
      const updatedAssets = assets.map((asset, index) => ({
        ...asset,
        fileName: index > 0 ? firstAssetFileName : asset.fileName,
      }));

      const updatedCheck = updatedAssets.map((asset, index) => {
        return index === 0 ? false : true;
      });

      this.setState({
        uploadForAll: true,
        assets: updatedAssets,
        check: updatedCheck,
      });
    } else {
      this.setState({
        uploadForAll: false,
        selectedUsePrevious: [],
        check: [],
      });
    }
  };

  handleSelectAllUsePreviousChange = (event) => {
    const selectedUsePrevious = this.state.selectedUsePrevious.map(
      (value, index) => (index === 0 ? false : event.target.checked)
    );

    this.setState({
      selectedUsePrevious,
      uploadForAll: event.target.checked,
    });

    if (event.target.checked) {
      this.setState((state) => ({ ...state, check: true }));
      const firstAssetFileName = this.state.assets[0]?.fileName;
      const updatedAssets = this.state.assets.map((asset, index) => ({
        ...asset,
        fileName: index > 0 ? firstAssetFileName : asset.fileName,
      }));

      this.setState({
        assets: updatedAssets,
      });
    } else {
      this.setState((state) => ({ ...state, check: false }));
    }
  };

  render() {
    const { selectedCheckValue, selectedCheck, uploadForAll, assets, check } =
      this.state;

    return (
      <Page title={this.title}>
        <Spin spinning={!!this.state.isLoading}>
          <Form
            size="small"
            labelAlign="left"
            className="form-horizontal"
            colon={false}
            layout="horizontal"
            form={this.props.form}
            labelCol={{ sm: 8, xs: 24 }}
            wrapperCol={{ sm: 16, xs: 24 }}
          >
            <Tabs defaultActiveKey="1">
              <TabPane tab="Single File Upload" key="1">
                <Form.Item name="checkId" label="Select Check">
                  <Select
                    onChange={this.handleCheckSelect}
                    value={selectedCheckValue}
                    style={{ width: "30%" }}
                    allowClear={true}
                  >
                    {this.state.checks.map((e) => (
                      <Option key={`Check${e.checkId}`} value={e.checkId}>
                        {e.checkName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <div>
                  {assets.some((asset) => asset.fileName) && (
                    <Checkbox
                      checked={uploadForAll}
                      onChange={this.handleUploadForAllChange}
                    >
                      Use previous for all assets
                    </Checkbox>
                  )}
                </div>
                {selectedCheck && (
                  <div>
                    <List
                      pagination={{
                        showSizeChanger: true,

                        //showQuickJumper: true,

                        size: "default",
                      }}
                      grid={{ gutter: 16, column: 1 }}
                      dataSource={assets}
                      renderItem={(item, index) => (
                        <List.Item>
                          <Card
                            title={item.assetName}
                            actions={[
                              index > 0 && (
                                // <Checkbox
                                //   checked={check[index]}
                                //   key={`prev-${item.assetId}`}
                                //   style={{ color: "gray" }}
                                //   hidden={
                                //     (!assets[index - 1 > 0 ? index - 1 : 0]
                                //       .fileName &&
                                //       !item.fileName) ||
                                //     index === 0
                                //   }
                                //   onChange={(v) =>
                                //     this.handle_use_previous(index, v)
                                //   }
                                // >
                                //   Use previous
                                // </Checkbox>
                                <Checkbox
                                  checked={check[index]}
                                  key={`prev-${item.assetId}`}
                                  style={{ color: "gray" }}
                                  hidden={
                                    (!assets[index - 1 > 0 ? index - 1 : 0]
                                      .fileName &&
                                      !item.fileName) ||
                                    index === 0
                                  }
                                  onChange={(event) => {
                                    this.handle_use_previous(index, event, {
                                      file: item.fileName, // Assuming 'item.fileName' is the file data to be uploaded
                                    });
                                  }}
                                >
                                  Use previous
                                </Checkbox>
                              ),

                              <Upload
                                name="file"
                                beforeUpload={(v) =>
                                  this.handleFileUpload(v, index)
                                }
                                onRemove={() => this.handlefiledelete(index)}
                                openFileDialogOnClick
                              >
                                <Button
                                  disabled={
                                    (assets[index].fileName && check[index]) ||
                                    (uploadForAll && check[index])
                                  }
                                  icon={<UploadOutlined />}
                                >
                                  Upload
                                </Button>
                              </Upload>,
                            ]}
                          >
                            {(index === 0 && item.fileName) ||
                            (check[index] && item.fileName) ? (
                              <p>File: {item.fileName}</p>
                            ) : (
                              <p>No file uploaded.</p>
                            )}
                          </Card>
                        </List.Item>
                      )}
                    />
                    {selectedCheck && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          marginTop: "20px",
                        }}
                      >
                        <Button type="primary" onClick={this.handleCancel}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </TabPane>
            </Tabs>
          </Form>
        </Spin>
      </Page>
    );
  }
}

export default CheckAssetFileMapping;
