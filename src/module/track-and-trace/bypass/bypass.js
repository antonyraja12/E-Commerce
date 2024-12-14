import { Col, Row, Switch, Table } from "antd";
import { useWorkStation } from "../../../hooks/useWorkStation";
import Page from "../../../utils/page/page";
import { useEffect, useState } from "react";
import BypassService from "../../../services/track-and-trace-service/bypass-service";

function Bypass() {
  const [bypassData, setBypassData] = useState({});
  const [isWorkStationLoading, workStation] = useWorkStation();
  const columns = [
    {
      dataIndex: "workStationId",
      title: "S.No.",
      render: (value, record, index) => {
        return index + 1;
      },
      width: 80,
    },
    {
      dataIndex: "workStationName",
      title: "Station Name",
    },
    {
      dataIndex: "workStationId",
      title: "Bypass",
      align: "center",
      width: 80,
      render: (value) => {
        return (
          <Switch
            size="small"
            value={bypassData[value] ? true : false}
            onChange={(val) => updateBypass(val, value)}
          />
        );
      },
    },
  ];
  const updateBypass = (value, workStationId) => {
    const service = new BypassService();
    service.save(workStationId, value).then(({ data }) => {
      setBypassData((state) => {
        let obj = { ...state, [data.workStationId]: data.status };
        return obj;
      });
    });
  };

  const fetchStatus = () => {
    const service = new BypassService();
    service.list().then(({ data }) => {
      let obj = {};
      for (let x of data) {
        obj[x.workStationId] = x.status;
      }
      setBypassData(obj);
    });
  };
  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <Row>
      <Col lg={12}>
        <Page
        // title="Bypass"
        >
          <Table
            columns={columns}
            loading={isWorkStationLoading}
            dataSource={workStation?.data}
            bordered
            pagination={false}
          />
        </Page>
      </Col>
    </Row>
  );
}

export default Bypass;
