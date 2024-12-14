import React, { useEffect, useState } from "react";
import { Card, Form, Row, Col, Select, Button, message, Radio } from "antd";
import Page from "../../../utils/page/page";
import { FilterFilled } from "@ant-design/icons";
import WorkStationService from "../../../services/track-and-trace-service/work-station-service";
import "./overall-report.css"; // Import your custom CSS
import ProductionReport from "./production-report";
import DowntimeReport from "./downtime-report";
import QualityReport from "./quality-report";

const { Option } = Select;

const OverallReport = ({ props }) => {
  const [workStationOptions, setWorkStationOptions] = useState([]);
  const [displayedData, setDisplayedData] = useState("production");
  const [loading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const workStationService = new WorkStationService();
  useEffect(() => {
    fetchWorkStationOptions();
  }, []);
  const fetchWorkStationOptions = async () => {
    setIsLoading(true);
    try {
      const response = await workStationService.list({ active: true });
      setWorkStationOptions(
        response.data?.map((e) => ({
          label: e.workStationName,
          value: e.workStationId,
        }))
      );
    } catch (error) {
      message.error("Failed to fetch workstations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoButtonClick = () => {
    const values = form.getFieldsValue();
    console.log("Form values:", values);
  };

  return (
    <Page>
      <Card
        // title={
        //   <div
        //     style={{
        //       display: "flex",
        //       justifyContent: "space-between",
        //       alignItems: "center",
        //       fontSize: "16px",
        //     }}
        //   >
        //     <span>Reports</span>
        //   </div>
        // }
        bordered={false}
        size="small"
      >
        <Form form={form} layout="vertical">
          <Row gutter={[16]}>
            <Col span={4}>
              <Form.Item name="interval" initialValue="daily">
                <Select style={{ width: "100%" }}>
                  <Option value="daily">Daily</Option>
                  <Option value="weekly">Weekly</Option>
                  <Option value="monthly">Monthly</Option>
                  <Option value="yearly">Yearly</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item>
                <Button type="primary" onClick={handleGoButtonClick}>
                  Go
                </Button>
              </Form.Item>
            </Col>
            <Col span={6}>
              {/* <Form.Item>
                <Button
                  onClick={() => setOpen(true)}
                  icon={<FilterFilled />}
                  style={{
                    backgroundColor: isFilterApplied ? "#c9cccf" : "inherit",
                  }}
                >
                  Filter
                </Button>
              </Form.Item> */}
            </Col>
          </Row>
        </Form>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Radio.Group
            value={displayedData}
            onChange={(e) => setDisplayedData(e.target.value)}
          >
            <Radio.Button value="production">Production</Radio.Button>
            <Radio.Button value="downtime">Downtime</Radio.Button>
            <Radio.Button value="quality">Quality</Radio.Button>
          </Radio.Group>
          {/* <div>
                <Button
                  type="primary"
                  onClick={this.handleExcelButton}
                  icon={<DownloadOutlined />}
                >
                  Excel
                </Button>
              </div> */}
        </div>
      </Card>
      <br />
      {displayedData === "production" && <ProductionReport />}
      {displayedData === "downtime" && <DowntimeReport />}
      {displayedData === "quality" && <QualityReport />}
    </Page>
  );
};

export default OverallReport;
