import React from "react";
import CheckService from "../../../services/preventive-maintenance-services/check-service";
import CheckAssetFileMappingService from "../../../services/check-asset-file-mapping";
import { Select, Upload, Card, Col, Row, Tag, Typography } from "antd";
import { rootUrl } from "../../../helpers/url";
import { UploadOutlined } from "@ant-design/icons";
import PageList from "../../../utils/page/page-list";
import Page from "../../../utils/page/page";
import AssetService from "../../../services/asset-service";
import PageForm from "../../../utils/page/page-form";

const { Option } = Select;

class CheckAssetFileBulkUpload extends PageForm {
  title = "CheckAssetFileMapping";
  service = new CheckAssetFileMappingService();
  checkService = new CheckService();
  assetService = new AssetService();

  componentDidMount() {
    this.assetService.list().then((response) => {
      this.setState(
        (state) => ({ ...state, assetlist: response.data }),
        () => {
          // console.log(this.state.assetlist);
        }
      );
    });
    super.componentDidMount();
  }

  render() {
    return (
      <Page title={this.title}>
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <Card size="small">
              <Typography
                style={{ fontSize: "16pt", color: "gray", fontWeight: "600" }}
              >
                UPLOAD AREA
              </Typography>
              <Upload multiple listType="picture-card">
                <div>
                  <UploadOutlined />
                  Upload
                </div>
              </Upload>
            </Card>
          </Col>

          <Col span={8}>
            <Card size="small">
              <table>
                <thead>
                  <tr>
                    <th
                      style={{
                        fontSize: "16pt",
                        color: "gray",
                        fontWeight: "600",
                      }}
                    >
                      ASSET LIST
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {this.state.assetlist?.map((e) => (
                    <tr>
                      <td>
                        <Tag style={{ fontSize: "12pt" }}>{e.assetName}</Tag>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </Col>
        </Row>

        {/* <Row justify="end">
            <Col>
              <Button type="primary" htmlType="submit">
                Next
              </Button>
            </Col>
          </Row> */}
      </Page>
    );
  }
}

export default CheckAssetFileBulkUpload;
