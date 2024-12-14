import { Button, Card, Col, Flex, Form, Input, Row } from "antd";
import React, { useState } from "react";
import WorkStationInstanceService from "../../../services/track-and-trace-service/work-station-instance-service";
import Popups from "../../../utils/page/popups";
import { withForm } from "../../../utils/with-form";

const ServiceExecute = (props) => {
  const { form, onClose, title, open, serviceName, argument, id } = props;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const service = new WorkStationInstanceService();
  const closePopup = () => {
    form.resetFields();
    setData(null);
    onClose();
  };
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const argsWithDefaults = (argument || []).reduce((acc, arg) => {
        acc[arg] = values[arg] || "";
        return acc;
      }, {});
      const response = await service.callService(
        id,
        serviceName,
        argsWithDefaults
      );
      setData(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popups
      destroyOnClose
      title={title}
      open={open}
      onCancel={closePopup}
      footer={[
        <Row justify="space-between">
          <Col>
            <Button key="close" onClick={closePopup}>
              Cancel
            </Button>
          </Col>
          <Col>
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={form.submit}
              htmlType="submit"
            >
              Execute
            </Button>
          </Col>
        </Row>,
      ]}
      width={1000}
    >
      <Row gutter={[10, 10]}>
        <Col span={6} style={{ height: "45vh", overflowY: "auto" }}>
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            colon={false}
            size="small"
          >
            {argument?.map((arg) => (
              <Form.Item
                key={arg}
                name={arg}
                label={arg}
                // rules={[
                //   {
                //     required: true,
                //     message: "Please enter a value",
                //   },
                // ]}
              >
                <Input />
              </Form.Item>
            ))}
          </Form>
        </Col>

        <Col span={18}>
          <Card style={{ height: "45vh", overflowY: "auto" }}>
            {data !== null ? JSON.stringify(data) : ""}
          </Card>
        </Col>
      </Row>
    </Popups>
  );
};
export default withForm(ServiceExecute);
