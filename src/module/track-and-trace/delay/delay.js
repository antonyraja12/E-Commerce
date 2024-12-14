import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Spin,
  Typography,
} from "antd";

import React, { useEffect } from "react";
import WorkStationService from "../../../services/track-and-trace-service/work-station-service";
import Page from "../../../utils/page/page";
import { withRouter } from "../../../utils/with-router";
import useCrudOperations from "../utils/useCrudOperation";
import { withAuthorization } from "../../../utils/with-authorization";

const Delay = (props) => {
  const [form] = Form.useForm();
  const service = new WorkStationService();

  const { isLoading, setIsLoading, fetchData, data } =
    useCrudOperations(service);

  const handleSubmit = () => {
    form.submit();
  };
  const onFinish = (values) => {
    setIsLoading(true);
    const constructedValue = values.workDelay?.map((e) => ({
      workStationId: e.workStationId,
      values: { cycleTime: e.cycleTime },
    }));
    service
      .addCycleTime(constructedValue)
      .then((res) => {
        if (res.status == 200) {
          message.success("Saved successfully");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getCycleTime = async () => {
    try {
      const result = await service.getPropertyValue();
      return result;
    } catch (error) {
      console.error("Error fetching cycle time:", error);
    }
  };
  useEffect(() => {
    getCycleTime()
      .then((res) => {
        const cycleTime = res.data?.map((e) => ({
          workStationId: e.workStationId,
          cycleTime: e.cycleTime,
        }));
        const formData = data
          ?.filter((e) => e.status === true)
          ?.sort((a, b) => a.seqNo - b.seqNo)
          ?.map((value) => {
            const matchedValue = cycleTime?.find(
              (ct) => ct.workStationId === value.workStationId
            );
            return {
              workStationId: value.workStationId,
              workStationName: value.workStationName,
              cycleTime: matchedValue?.cycleTime || 0,
            };
          });

        form.setFieldsValue({ workDelay: formData });
      })
      .catch((error) => {
        console.error("Error fetching cycle time:", error);
      });
  }, [data, form]);

  const onValueInputChange = (value) => {
    if (value !== undefined) {
      const workDelayValues = form.getFieldValue("workDelay");
      const newFormData = workDelayValues?.map((e) => ({
        ...e,
        cycleTime: value,
      }));
      form.setFieldsValue({
        workDelay: newFormData,
      });
    }
  };

  return (
    <Spin spinning={isLoading}>
      <Page>
        <Form
          form={form}
          // layout="horizontal"
          onFinish={onFinish}
          colon={false}
        >
          <Row gutter={[10, 10]}>
            <Col span={8}>
              <Card title="All Station" bordered={true}>
                <Form.Item
                  name="CycleTime"
                  label="Cycle Time"
                  initialValue={0}
                  rules={[
                    { required: true, message: "Please enter a cycle time" },
                  ]}
                >
                  <InputNumber
                    onChange={onValueInputChange}
                    style={{ width: "100%" }}
                    min={0}
                    suffix="Sec"
                  />
                </Form.Item>
              </Card>
            </Col>
            <Col span={16}>
              <Card title="Station Delay" bordered={true}>
                <Form.List name="workDelay">
                  {(fiedls, { add, remove }, { error }) => (
                    <>
                      <Row gutter={[15, 15]}>
                        {fiedls.map((value, index) => (
                          <Col span={12}>
                            <Form.Item key={value.key}>
                              <Form.Item
                                hidden
                                {...value}
                                name={[value.name, "workStationId"]}
                              >
                                <Input />
                              </Form.Item>
                              <Form.Item
                                hidden
                                {...value}
                                name={[value.name, "workStationName"]}
                              >
                                <Input />
                              </Form.Item>
                              <Form.Item
                                labelCol={{
                                  span: 8,
                                  style: { textAlign: "left" },
                                }}
                                wrapperCol={{ span: 12 }}
                                label={
                                  <Typography.Title level={5}>
                                    {form.getFieldValue([
                                      "workDelay",
                                      value.name,
                                      "workStationName",
                                    ]) || "Station Name"}
                                  </Typography.Title>
                                }
                                {...value}
                                name={[value.name, "cycleTime"]}
                              >
                                <InputNumber
                                  suffix="Sec"
                                  style={{ width: "100%" }}
                                  min={0}
                                />
                              </Form.Item>
                            </Form.Item>
                          </Col>
                        ))}
                      </Row>
                    </>
                  )}
                </Form.List>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: "right", marginTop: "16px" }}>
              {
                <Button type="primary" onClick={handleSubmit}>
                  Submit All Delays
                </Button>
              }
            </Col>
          </Row>
        </Form>
      </Page>
    </Spin>
  );
};

export default withRouter(withAuthorization(Delay));
