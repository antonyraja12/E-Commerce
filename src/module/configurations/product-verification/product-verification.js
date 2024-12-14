import {
  Card,
  Col,
  Divider,
  Drawer,
  Image,
  Layout,
  Modal,
  Row,
  Typography,
} from "antd";
import { saveAs } from "file-saver";
import moment from "moment";
import React, { Component } from "react";
import { Document, Page } from "react-pdf";
import { publicUrl, remoteAsset } from "../../../helpers/url";
import AddWarrantyService from "../../../services/add-warranty-service";
import AssetService from "../../../services/asset-service";
import ProductFileService from "../../../services/inventory-services/product-file-service";
import { withRouter } from "../../../utils/with-router";
// import FileViewer from "react-file-viewer";
// import FileViewer from "react-file-viewer-extended";
import { Badge } from "antd";
import Doc360Service from "../../../services/doc-360-service/doc-360-service";
import ManualPage from "./manual-page";
const { Text, Title } = Typography;
const { Header, Content, Footer } = Layout;

const allowedImageExtensions = ["png", "jpg", "jpeg", "gif", "bmp", "svg"];
const allowedPdfExtensions = ["pdf"];
const downloadImage = (path) => {
  saveAs(remoteAsset(path), path);
};

class ProductVerification extends Component {
  state = { isLoading: false, drawOpen: false, htmlContent: "", content: "" };
  service = new AssetService();
  warrantyService = new AddWarrantyService();
  productservice = new ProductFileService();
  doc360Service = new Doc360Service();

  componentDidMount() {
    this.service.list({ assetId: this.props.params?.id }).then((response) => {
      this.setState((state) => ({ ...state, assetData: response.data[0] }));
    });
    this.warrantyService
      .list({ assetId: this.props.params?.id })
      .then((response) => {
        this.setState((state) => ({
          ...state,
          warrantyData: response.data[0],
        }));
      });
    this.productservice
      .list({ assetId: this.props.params?.id })
      .then((response) => {
        this.setState((state) => ({ ...state, productData: response.data }));
      });
  }

  closeDocModal = () => {
    this.setState((state) => ({ ...state, openDocModal: false }));
  };
  closeProjectModal = () => {
    this.setState((state) => ({
      ...state,
      openProjectModal: false,
      content: "",
    }));
  };
  getCategory = () => {
    this.doc360Service.getCategory().then(({ data }) => {
      this.getArticle(data.data.articles);
    });
  };

  //Article

  getArticleById = async (id) => {
    this.setState((state) => ({ ...state, isLoading: true, htmlContent: "" }));
    const response = await this.doc360Service
      .getArticle(id)
      .then(({ data }) => {
        return data.data;
      });

    const content = this.state.htmlContent + response?.html_content;
    this.setState((state) => ({
      ...state,
      htmlContent: content,
    }));
    this.setState((state) => ({
      ...state,
      isLoading: false,
      openDocModal: true,
    }));
  };
  getArticle = async (data) => {
    this.setState((state) => ({ ...state, isLoading: true }));
    for (let i = 0; i < data.length; i++) {
      try {
        const response = await this.doc360Service
          .getArticle(data[i].id)
          .then(({ data }) => {
            return data.data;
          });
        const content = this.state.htmlContent + response?.html_content;
        this.setState((state) => ({
          ...state,
          htmlContent: content,
        }));
      } catch (error) {
        console.error("Error occurred while fetching article:", error);
      }
    }
    this.setState((state) => ({
      ...state,
      isLoading: false,
      openDocModal: true,
    }));
  };
  getfile = (url) => {
    let fileExtension = url.split(".").pop();
    fileExtension = fileExtension.toLowerCase();
    this.setState((state) => ({
      ...state,
      file: url,
      extension: fileExtension,
      drawOpen: true,
    }));
  };

  //projectVersion

  getProjectVersionById = async (value) => {
    if (value) {
      this.setState((state) => ({ ...state, isLoading: true, content: "" }));
      const response = await this.doc360Service
        .getProjectVersion("8555a1f6-95ba-4cbe-bea7-df373db5979f", {
          searchQuery: value,
        })
        .then(({ data }) => {
          return data.data;
        });

      // const content = this.state.content + response?.hits[0]?.content;
      const content = response?.hits[0]?.content;
      this.setState((state) => ({
        ...state,
        content: content,
        isLoading: false,
      }));
      this.setState((state) => ({
        ...state,
        isLoading: false,
        openProjectModal: true,
      }));
    }
  };
  getProjectVersion = async (data) => {
    this.setState((state) => ({ ...state, isLoading: true }));
    for (let i = 0; i < data.length; i++) {
      try {
        const response = await this.doc360Service
          .getProjectVersion(data[i].id)
          .then(({ data }) => {
            return data.data;
          });
        const content = this.state.content + response?.html_content;
        this.setState((state) => ({
          ...state,
          content: content,
        }));
      } catch (error) {
        console.error("Error occurred while fetching projectVersion:", error);
      }
    }
    this.setState((state) => ({
      ...state,
      isLoading: false,
      openProjectModal: true,
    }));
  };
  getfile = (url) => {
    let fileExtension = url.split(".").pop();
    fileExtension = fileExtension.toLowerCase();
    this.setState((state) => ({
      ...state,
      file: url,
      extension: fileExtension,
      drawOpen: true,
    }));
  };
  renderFileViewer = () => {
    const { file, extension } = this.state;
    if (allowedImageExtensions.includes(extension)) {
      return (
        <img src={file} alt="file" style={{ width: "100%", height: "100%" }} />
      );
    } else if (allowedPdfExtensions.includes(extension)) {
      return (
        <Document file={file}>
          <Page pageNumber={1} />
        </Document>
      );
    } else {
      return <div>File format not supported for preview.</div>;
    }
  };

  render() {
    const { assetData } = this.state;
    // console.log("asset", assetData);
    return (
      <Layout>
        <Header
          style={{
            backgroundColor: "#FAFAFA",
            position: "sticky",
            top: 0,
          }}
        >
          <Image
            src="/byteFactory.png"
            preview={false}
            style={{ margin: "auto", maxWidth: "150px" }}
          />
        </Header>
        <Content style={{ padding: "10px" }}>
          <Card
            title="Asset Details"
            bodyStyle={{
              margin: "1px",
              paddingTop: "10px",
              paddingBottom: "10px",
            }}
          >
            {assetData ? (
              // <Space direction="vertical">
              <Row gutter={[10, 10]}>
                <Col xs={8} sm={8}>
                  <Image
                    src={`${publicUrl}/${assetData?.imagePath}`}
                    fallback="data:image/png;base64,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"
                  />
                </Col>
                <Col xs={16} sm={16}>
                  <Row gutter={[10, 10]}>
                    <Col sm={12} xs={12}>
                      <Text strong>Asset Name</Text>
                    </Col>
                    <Col
                      sm={12}
                      xs={12}
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                        overflow: "hidden",
                        width: "auto",
                      }}
                    >
                      {assetData?.assetName}
                    </Col>
                  </Row>
                  <Row gutter={[10, 10]}>
                    <Col sm={12} xs={12}>
                      <Text strong>Asset Library</Text>
                    </Col>
                    <Col
                      sm={12}
                      xs={12}
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                        overflow: "hidden",
                        width: "auto",
                      }}
                    >
                      {assetData?.assetLibrary?.assetLibraryName}
                    </Col>
                  </Row>
                  <Row gutter={[10, 10]}>
                    <Col sm={12} xs={12}>
                      <Text strong>{assetData?.appHierarchy?.mode}</Text>
                    </Col>
                    <Col
                      sm={12}
                      xs={12}
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                        overflow: "hidden",
                        width: "auto",
                      }}
                    >
                      {assetData?.appHierarchy?.ahname}
                    </Col>
                  </Row>
                  <Row gutter={[10, 10]}>
                    <Col sm={12} xs={12}>
                      <Text strong>Status </Text>
                    </Col>
                    <Col
                      sm={12}
                      xs={12}
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                        overflow: "hidden",
                        width: "auto",
                      }}
                    >
                      {assetData?.active ? (
                        <Badge status="success" text="Active" />
                      ) : (
                        <Badge status="Error" text="In - Active" />
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col sm={20} xs={20}></Col>
              </Row>
            ) : // </Space>
            null}
          </Card>
          <Divider style={{ margin: 5 }} />
          <ManualPage />
          <Drawer
            size="large"
            visible={this.state.drawOpen}
            onClose={() =>
              this.setState((state) => ({ ...state, drawOpen: false }))
            }
          >
            {this.renderFileViewer()}
          </Drawer>
        </Content>

        <Footer
          style={{
            padding: "10px",
            color: "rgb(174 174 174)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: "white", // Change this to your desired background color
            zIndex: 1000, // Adjust the z-index if needed
          }}
        >
          <span>&copy; {moment().format("YYYY")} Powered by</span>

          <img
            src="/byteFactory.png"
            alt="logo"
            style={{ maxWidth: "100px" }}
          />
        </Footer>

        {/* //Article module */}

        <Modal
          title="Document Content"
          open={this.state.openDocModal}
          onCancel={this.closeDocModal}
          onOk={this.closeDocModal}
          destroyOnClose
          width={800}
          bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }} // Set height and enable overflow
        >
          <div
            dangerouslySetInnerHTML={{ __html: this.state.htmlContent }}
            style={{ fontFamily: "Nunito,sans-serif" }}
          ></div>
        </Modal>
      </Layout>
    );
  }
}

export default withRouter(ProductVerification);
