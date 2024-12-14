import { Button, Col, Row, Spin, Table, message } from "antd";
import moment from "moment";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TagsCell from "../../../component/TagCell";
import SchedulerService from "../../../services/preventive-maintenance-services/scheduler-service";
function SchedulerPreviewPage(props) {
  const { data, id, handleCurrentDecrease, file, modeName } = props;
  const service = new SchedulerService();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  const handleUpload = () => {
    setLoading(true);
    service.schedulerUpload(file).then((response) => {
      if (response.data?.success) {
        message.success(response.data?.message);
        navigate("..");
      } else {
        message.error(response.data?.message);
        setLoading(false);
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
    {
      title: "Asset Name",
      dataIndex: "asset",
      align: "center",
    },
    {
      title: "Checklist ",
      dataIndex: "checklist",
      align: "center",
      render: (value) => {
        console.log("val", value);
        return (
          <TagsCell
            tags={value.map((val) => ({ val, val }))}
            keyName="val"
            valueName="val"
          />
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      align: "center",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      align: "center",
      render: (value) => {
        return moment(value).format("DD-MM-YYYY");
      },
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      align: "center",
      render: (value) => {
        return moment(value).format("DD-MM-YYYY");
      },
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      align: "center",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      align: "center",
    },
    {
      title: "Assigned To",
      dataIndex: "userId",
      align: "center",
    },
  ];

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
    </Spin>
  );
}
export default SchedulerPreviewPage;
