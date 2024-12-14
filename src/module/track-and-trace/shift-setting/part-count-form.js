import React, { useEffect, useMemo, useState } from "react";
import Page from "../../../utils/page/page";
import { withRouter } from "../../../utils/with-router";
import useCrudOperations from "../utils/useCrudOperation";
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  message,
  Row,
  Spin,
  Tag,
  TimePicker,
  Tooltip,
  Typography,
} from "antd";
import ShiftAllocationService from "../../../services/shift-configuration/shift-allocation-service";
import dayjs from "dayjs";
import { fetchData } from "pdfjs-dist";
import ShiftWisePartCountService from "../../../services/track-and-trace-service/shift-wise-part-count-service";
import { CloseOutlined, SaveOutlined, UndoOutlined } from "@ant-design/icons";
const { Text, Title } = Typography;

const ShiftWisePartCountForm = (props) => {
  const title = "Part Count Update";
  const { access } = props;
  const [form] = Form.useForm();
  const service = new ShiftAllocationService();
  const partCountService = new ShiftWisePartCountService();
  const filters = {
    startDate: dayjs().startOf("day").toISOString(),
    endDate: dayjs().endOf("day").toISOString(),
  };
  const { data, isLoading, fetchData, setIsLoading } = useCrudOperations(
    service,
    filters
  );

  useEffect(() => {
    loadFormValues();
  }, [data]);

  const loadFormValues = () => {
    partCountService.list().then((res) => {
      const shiftData = data?.map((shift) => {
        const match = res.data?.find(
          (apiShift) => apiShift.shiftAllocationId === shift.shiftAllocationId
        );
        return {
          shiftAllocationId: shift.shiftAllocationId,
          targetPartCount: match ? match.targetedPartCount : "",
          actualPartCount: match ? match.actualPartCount : "",
          goodPartCount: match ? match.goodPartCount : "",
          badPartCount: match ? match.badPartCount : "",
        };
      });

      form.setFieldsValue({
        shiftData,
      });
    });
  };

  const onFinish = (values, index) => {
    const data = values.shiftData.map((e) => ({
      shiftAllocationId: e.shiftAllocationId,
      targetedPartCount: e.targetPartCount,
      actualPartCount: e.actualPartCount,
      goodPartCount: e.goodPartCount,
      badPartCount: e.badPartCount,
    }));

    setIsLoading(true);
    partCountService
      .add(data)
      .then((res) => {
        if (res.status == 200) {
          message.success("Saved successfully");
        }
      })
      .catch((err) => {
        console.log("error", err);
      })
      .finally(() => {
        setIsLoading(false);
        // ResetForm();
      });
  };

  const ResetForm = () => {
    form.resetFields();
  };
  const hasAccess = (permission) => {
    return access?.[0]?.includes(permission);
  };
  return (
    <Spin spinning={isLoading}>
      <Card
      // title={title}
      >
        <Row justify={"center"} gutter={[10, 10]}>
          {data.length === 0 ? (
            <Col span={24} style={{ textAlign: "center" }}>
              <Empty description="No Shift" />
            </Col>
          ) : (
            <Col span={24}>
              <Form
                colon={false}
                form={form}
                layout="horizontal"
                onFinish={(values) => onFinish(values)}
                // initialValues={{
                //   shiftData: data.map((shift) => ({
                //     shiftAllocationId: shift.shiftAllocationId,
                //   })),
                // }}
              >
                <table className="table-row">
                  <thead>
                    <tr>
                      <th>Shift Name</th>
                      <th>Target Part Count</th>
                      <th>Actual Part Count</th>
                      <th>Good Part Count</th>
                      <th>Bad Part Count</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((shift, index) => (
                      <tr key={shift.shiftAllocationId}>
                        <td>
                          <Tag color="volcano">{shift.shiftName}</Tag>
                        </td>

                        <td>
                          <Form.Item
                            hidden
                            noStyle
                            name={["shiftData", index, "shiftAllocationId"]}
                            initialValue={shift.shiftAllocationId}
                          ></Form.Item>
                          <Form.Item
                            noStyle
                            name={["shiftData", index, "targetPartCount"]}
                            rules={
                              [
                                // {
                                //   required: true,
                                // },
                              ]
                            }
                          >
                            <Input />
                          </Form.Item>
                        </td>

                        <td>
                          <Form.Item
                            noStyle
                            name={["shiftData", index, "actualPartCount"]}
                          >
                            <Input disabled />
                          </Form.Item>
                        </td>
                        <td>
                          <Form.Item
                            noStyle
                            name={["shiftData", index, "goodPartCount"]}
                          >
                            <Input disabled />
                          </Form.Item>
                        </td>
                        <td>
                          <Form.Item
                            noStyle
                            name={["shiftData", index, "badPartCount"]}
                          >
                            <Input disabled />
                          </Form.Item>
                        </td>
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Row gutter={10} justify={"end"}>
                  <Col>
                    <Button onClick={ResetForm}>Reset</Button>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                    >
                      Save
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          )}
        </Row>
      </Card>
    </Spin>
  );
};

export default withRouter(ShiftWisePartCountForm);
