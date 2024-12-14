import { Button, Table, Row, Col, message } from "antd";
import DigitalWorkInstructionExcelUploadService from "../../../services/digital-work-instruction-service/dwi-excel-upload-service";

function ExcelUploadPreviewPage(props) {
  const {
    data,
    destinationData,
    id,
    handleCurrentDecrease,
    moveToUploadImagePage,
    modeName,
    workInstructionId,
  } = props;
  let arrayOfIds = [];
  const service = new DigitalWorkInstructionExcelUploadService();
  const handleUpload = () => {
    const jsonStr = destinationData?.map((e) => ({
      key: e.key,
      index: e.index.toString(),
      label: e.label,
    }));
    service.uploadDataId(id, jsonStr, modeName).then((response) => {
      if (response.data?.success) {
        arrayOfIds = response.data.data.map((d) => {
          return d.taskId;
        });
        service.mergeTask(workInstructionId, arrayOfIds).then((response2) => {
          if (response2.data?.success) {
            message.success(response2.data?.message);
            moveToUploadImagePage(response);
          } else {
            message.error(response.data?.message);
          }
        });
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
            rowKey="checkTypeId"
            dataSource={data}
            columns={columns}
            size="middle"
            pagination={{
              showSizeChanger: true,

              //showQuickJumper: true,

              size: "default",
            }}
            scroll={{
              y: 330,
            }}
          />
        </Col>
      </Row>
      <br />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Col>
          <Button
            onClick={() => {
              handleCurrentDecrease();
            }}
          >
            Back
          </Button>
        </Col>
        <Col>
          <Button onClick={handleUpload} type="primary">
            Next
          </Button>
        </Col>
      </div>
    </Row>
  );
}
export default ExcelUploadPreviewPage;
