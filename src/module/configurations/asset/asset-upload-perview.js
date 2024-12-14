import { ExportOutlined } from "@ant-design/icons";
import { Button, Col, Popover, Row, Table, message } from "antd";
import Column from "antd/es/table/Column";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AssetService from "../../../services/asset-service";

function AssetUploadPreview(props) {
  const { data, file, handleCurrentDecrease } = props;
  const [isVisible, setVisible] = useState(false);
  const service = new AssetService();
  const navigate = useNavigate();

  const handleUpload = () => {
    service.uploadFile(file).then((response) => {
      // console.log("log1", response);
      if (response.data?.success) {
        message.success(response.data?.message);
        navigate("..");
      } else {
        message.error(response.data?.message);
      }
    });
  };
  // const arrData = Object.values(data) ? Object.values(data) : "";

  const arrData = data && typeof data === "object" ? Object.values(data) : "";

  const columns = [
    {
      title: "S.No.",
      dataIndex: "sno",
      key: "sno",

      render: (text, record, index) => index + 1,
    },
    {
      title: "Asset Name",
      dataIndex: "assetName",
      key: "assetName",
    },
    {
      title: "Entity",
      dataIndex: "entity",
      key: "entity",
    },
    {
      title: "Asset Library Name",
      dataIndex: "assetLibraryName",
      key: "assetLibraryName",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },

    {
      title: "Parameter Properties",
      dataIndex: "parameters",
      align: "center",
      render: (value, index) => {
        const arrvalue = value ? Object.values(value) : [];

        const content = (
          <Table
            dataSource={arrvalue}
            rowKey={(record, index) => index}
            pagination={{
              showSizeChanger: true,
              //showQuickJumper: true,
              size: "default",
              pageSize: 5,
            }}
          >
            <Column
              title="Parameter Name"
              dataIndex="parameterName"
              key="parameterName"
            />
            <Column
              title="Display Name"
              dataIndex="displayName"
              key="displayName"
            />
            <Column title="DataType" dataIndex="dataType" key="dataType" />
          </Table>
        );
        return (
          <>
            <Popover
              content={content}
              title="Parameter Properties"
              placement="left"
              trigger="click"
            >
              <Button icon={<ExportOutlined />}> View</Button>
            </Popover>
          </>
        );
      },
    },
  ];

  return (
    <Row gutter={[10, 10]} justify="end">
      <Row>
        <Col>
          <Table
            className="virtual-table"
            rowKey="assetId"
            dataSource={arrData}
            columns={columns}
            size="middle"
            pagination={false}
            scroll={{
              y: 330,
            }}
          />
        </Col>
      </Row>
      <Row justify="end" gutter={[10, 10]}>
        <Col>
          <Button
            onClick={() => {
              handleCurrentDecrease();
            }}
          >
            Cancel
          </Button>
        </Col>
        <Col>
          <Button onClick={handleUpload} type="primary">
            Submit
          </Button>
        </Col>
      </Row>
    </Row>
  );
}
export default AssetUploadPreview;
