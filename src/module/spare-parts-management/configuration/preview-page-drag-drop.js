import { Button, Table, Row, Col, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import InventoryUploadDownloadService from "../../../services/inventory-upload-download-service ";
function PreviewPage(props) {
  const { data, destinationData, id, handleCurrentDecrease, modeName } = props;
  const service = new InventoryUploadDownloadService();
  const navigate = useNavigate();
  const handleUpload = () => {
    const jsonStr = destinationData?.map((e) => ({
      key: e.key,
      index: e.index.toString(),
      label: e.label,
    }));
    service.uploadDataId(id, jsonStr, modeName).then((response) => {
      if (response.data?.success) {
        message.success(response.data?.message);
        navigate("/spare-parts/configuration");
      } else {
        message.error(response.data?.message);
      }
    });
  };

  const columns = [
    {
      title: "S.No.",
      dataIndex: "sno",
      align: "center",
      width: 100,
      render: (text, record, index) => index + 1,
    },
    ...destinationData.map((e) => ({
      key: e.key,
      dataIndex: e.key,
      title: e.label,
      align: "center",
      width: 200,
    })),
  ];

  return (
    <Row gutter={[10, 10]} justify="end">
      <Row>
        <Col>
          <Table
            className="virtual-table"
            rowKey="sparePartTypeId"
            dataSource={data}
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
            type="primary"
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
export default PreviewPage;
