import { Card, Spin, Form, Col, Button, Row, Select } from "antd";
import Page from "../../../utils/page/page";
import { useEffect, useState } from "react";
import OeeCalculationService from "../../../services/oee-calculation-service";
import DowntimeCardTwo from "../oee-dashboard/downtime-card-2";
import AssetService from "../../../services/asset-service";

function MachineStatusReport(props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [assets, setAssets] = useState({ loading: false, options: [] });
  useEffect(() => {
    fetch({ assetId: 4752 });
  }, []);

  const fetch = ({ assetId }) => {
    setLoading(true);
    const service = new OeeCalculationService();
    service
      .getByAssetId(assetId)
      .then(({ data }) => {
        setData(data);
        // console.log(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Spin spinning={loading}>
      <Card title="MachineStatusReport">
        <Form form={props.form} layout="inline">
          <Row gutter={10} align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <Form.Item name="assetId">
                <Select allowClear />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Go
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <DowntimeCardTwo {...data?.shiftAllocation} />
      </Card>
    </Spin>
  );
}

export default MachineStatusReport;
