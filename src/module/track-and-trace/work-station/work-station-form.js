import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import DeviceService from "../../../services/track-and-trace-service/device-service";
import LineMasterService from "../../../services/track-and-trace-service/line-master-service";
import WorkStationService from "../../../services/track-and-trace-service/work-station-service";
import { withForm } from "../../../utils/with-form";
import { withRouter } from "../../../utils/with-router";

const { Title } = Typography;

const WorkStationForm = (props) => {
  const { form, params } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [lineOption, setLineOption] = useState([]);
  const { confirm } = Modal;

  const service = new WorkStationService();
  const lineService = new LineMasterService();
  const deviceService = new DeviceService();

  useEffect(() => {
    fetchLineOption();
    if (params?.id) {
      onRetrieve(params.id);
    }
  }, [params?.id]);

  const fetchLineOption = async () => {
    setIsLoading(true);
    try {
      const response = await lineService.list({ status: true });
      setLineOption(
        response.data?.map((e) => ({
          label: e.lineMasterName,
          value: e.lineMasterId,
        }))
      );
    } catch (error) {
      message.error("Failed to fetch line");
    } finally {
      setIsLoading(false);
    }
  };

  const onRetrieve = async (id) => {
    setIsLoading(true);
    try {
      const response = await service.retrieve(id);
      patchForm(response.data);
    } catch (error) {
      message.error("Failed to fetch work station");
    } finally {
      setIsLoading(false);
    }
  };

  const patchForm = (data) => {
    console.log("data", data);

    form.setFieldsValue({
      ...data,
      lineMasterId: data?.lineMaster?.lineMasterId,
    });
  };

  const onClose = () => {
    form.resetFields();
    props.navigate("..");
  };
  const onFinish = async (value) => {
    let response;
    if (params.id) {
      response = await service.update(value, params.id);
    } else {
      response = await service.save(value);
    }
    if (response.status == 200) {
      const action = params.id ? "updated" : "added";
      message.success(`Work station ${action} successfully`);
    } else {
      message.success(`Something went wrong, Try again!`);
    }

    if (params?.id) {
      props.navigate(`../${params?.id}/properties`);
    } else {
      props.navigate(`./${response.data.workStationId}/properties`);
    }
    // props.navigate(
    //   `/tat/work-station/add/${response.data.workStationId}/properties`
    // );
  };

  return (
    <Spin spinning={isLoading}>
      <Form
        colon={false}
        form={form}
        layout="horizontal"
        labelAlign="left"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          status: true,
          mode: "Auto",
        }}
        onFinish={onFinish}
      >
        <Row gutter={[20, 10]}>
          <Col span={20}>
            <Form.Item
              name="workStationName"
              label="Work Station Name"
              rules={[
                {
                  required: true,
                  message: "Please enter work station name",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="displayName"
              label="Display Name"
              rules={[
                {
                  required: true,
                  message: "Please enter work station name",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lineMasterId"
              label="Line"
              rules={[
                {
                  required: true,
                  message: "Please select line",
                },
              ]}
            >
              <Select options={lineOption} showSearch />
            </Form.Item>
            <Form.Item
              name="type"
              label="Type"
              rules={[
                {
                  required: true,
                  message: "Please select type",
                },
              ]}
            >
              <Select
                options={[
                  { label: "Buffer", value: "Buffer" },
                  { label: "MES", value: "MES" },
                  { label: "QA", value: "QA" },
                  { label: "Rework", value: "Rework" },
                  { label: "Camera", value: "Camera" },
                  { label: "Goepel", value: "Goepel" },
                ]}
                showSearch
              />
            </Form.Item>

            <Form.Item
              name="seqNo"
              label="Sequence No"
              rules={[
                {
                  required: true,
                  min: 1,
                  type: "number",
                },
              ]}
            >
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item
              name="mode"
              label="Mode"
              rules={[{ required: true, message: "Please select mode" }]}
            >
              <Radio.Group>
                <Radio value="Auto">Auto</Radio>
                <Radio value="Manual">Manual</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Radio.Group>
                <Radio value={true}>Active</Radio>
                <Radio value={false}>In-Active</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"space-between"}>
          <Col>
            <Button onClick={onClose}>Cancel</Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default withForm(withRouter(WorkStationForm));
