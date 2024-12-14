import React, { useEffect, useState } from "react";
import { withForm } from "../../../utils/with-form";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Select,
  Spin,
} from "antd";
import WorkStationService from "../../../services/track-and-trace-service/work-station-service";
import { useParams } from "react-router-dom";
import { validateStringWithUnderscore } from "../../../helpers/validation";
const { Option } = Select;
const PropertyForm = (props) => {
  const { form, workStationId, parameterName } = props;

  const [loading, setLoading] = useState(false);
  const [dataType, setDataType] = useState(null);
  // const [parameterName ,setParameterName] =

  const service = new WorkStationService();

  const save = (value) => {
    service
      .addorUpdateProperty(workStationId, value)
      .then(({ data }) => {
        if (parameterName) message.success("Updated successfully");
        else message.success("Saved successfully");
        if (typeof props.afterSave === "function") props.afterSave(data);
      })

      .catch((err) => {
        console.log("Error:", err);
        message.error(err.message || "An error occurred");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const retrieve = (parameterName) => {
    setLoading(true);
    service
      .retrieveByPropertyName(workStationId, parameterName)
      .then(({ data }) => {
        form.setFieldsValue(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (parameterName) {
      retrieve(parameterName);
    }
  }, [parameterName]);

  const isInputValue = (value) => {
    setDataType(value);
    form.setFieldValue("defaultValue", null);
    form.setFieldValue("assetDisplayValue", []);

    if (value === "BOOLEAN") {
      form.setFieldValue("assetDisplayValue", [
        {
          value: "true",
          displayValue: "",
        },
        {
          value: "false",
          displayValue: "",
        },
      ]);
    } else if (value === "STRINGBOOL") {
      form.setFieldValue("assetDisplayValue", [
        {
          value: "0",
          displayValue: "",
        },
        {
          value: "1",
          displayValue: "",
        },
        {
          value: "3",
          displayValue: "",
        },
      ]);
    }
  };

  return (
    <>
      <Spin spinning={loading}>
        <Form
          onFinish={save}
          form={form}
          layout="vertical"
          requiredMark="optional"
        >
          <Col sm={16} xs={24}>
            <Form.Item
              name="parameterName"
              label="Parameter name"
              rules={[
                { required: true, message: "Parameter is mandatory" },
                {
                  validator: validateStringWithUnderscore,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col sm={16} xs={24}>
            <Form.Item name="displayName" label="Display name">
              <Input />
            </Form.Item>
          </Col>
          <Col sm={16} xs={24}>
            <Form.Item name="description" label="Description">
              <Input.TextArea />
            </Form.Item>
          </Col>

          <Col sm={16} xs={24}>
            <Form.Item
              label="Unit"
              name="unit"
              rules={[{ required: false, message: "Please enter the unit" }]}
            >
              <Input maxLength={200} />
            </Form.Item>
          </Col>

          <Col sm={16} xs={24}>
            <Form.Item
              label="Data Type"
              name="dataType"
              rules={[
                { required: true, message: "Please enter the Data Type" },
              ]}
            >
              <Select onChange={isInputValue}>
                <Option value="STRING">STRING</Option>
                <Option value="BOOLEAN">BOOLEAN</Option>
                <Option value="NUMBER">NUMBER</Option>
                <Option value="DATETIME">DATETIME</Option>
                <Option value="DATE">DATE</Option>
                <Option value="TIME">TIME</Option>
                <Option value="JSON">JSON</Option>
              </Select>
            </Form.Item>
            {}
          </Col>
          <Col sm={16} xs={24}>
            <Form.Item label="" name="readonly" valuePropName="checked">
              <Checkbox>Readonly</Checkbox>
            </Form.Item>
          </Col>
          <Col sm={16} xs={24}>
            <Form.Item label="" name="monitoring" valuePropName="checked">
              <Checkbox>Monitoring Property</Checkbox>
            </Form.Item>
          </Col>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
};

export default withForm(PropertyForm);
