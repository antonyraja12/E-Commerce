import { Button, Col, Modal, Row, Spin, Table, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadDownloadService from "../../../../services/upload-download-service";

function PreviewPage(props) {
  const { data, destinationData, id, handleCurrentDecrease, modeName } = props;
  const service = new UploadDownloadService();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [repeatedData, setRepeatedData] = useState([]);

  useEffect(() => {
    const filteredValues = data?.filter((row) => !row.unique);
    // .map((row) => row.unique);
    setRepeatedData(filteredValues);
  }, [data]);

  const handleUpload = () => {
    const jsonStr = destinationData?.map((e) => ({
      key: e.key,
      index: e.index.toString(),
      label: e.label,
    }));
    service.uploadDataId(id, jsonStr, modeName).then((response) => {
      setLoading(true);
      // console.log(response.data);
      if (response.data?.success) {
        setLoading(false);
        message.success(response.data?.message);
        navigate("..");
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
      render: (value, record) => {
        var bgColor = "";
        if (record.unique === false) {
          bgColor = "red";
        }

        return <span style={{ color: bgColor }}>{value}</span>;
      },
    })),
  ];

  const info = () => {
    Modal.info({
      title:
        "Check Name and Check description already exist.Do you still want to add ?",
      width: "1000px",
      content: (
        <Table pagination={false} dataSource={repeatedData} columns={columns} />
      ),
      onOk: handleUpload, // Call handleUpload when the modal is closed by clicking OK
    });
  };

  return (
    <Spin spinning={isLoading}>
      <Row gutter={[10, 10]} justify="end">
        <Row>
          <Col>
            <Table
              className="virtual-table"
              rowKey="checkTypeId"
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
            >
              Cancel
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() => {
                console.log("Button clicked");
                repeatedData.length > 0 ? info() : handleUpload();
              }}
              type="primary"
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Row>
    </Spin>
  );
}
export default PreviewPage;
