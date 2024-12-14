import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  message,
} from "antd";
import React, { forwardRef, useEffect, useState } from "react";
import AssetService from "../../../services/asset-service";
import AssetLibraryService from "../../../services/asset-library-service";
import { validateStringWithUnderscore } from "../../../helpers/validation";

const { TextArea } = Input;

function AssetLibraryAlertsForm(props, ref) {
  const [form] = Form.useForm();
  const { assetLibraryId, alertName, afterSave } = props;
  const [parameterOptions, setParameterOptions] = useState([]);
  const [isSaving, setSaving] = useState(false);
  const [parameterLoading, setParameterLoading] = useState(false);
  useEffect(() => {
    const service = new AssetLibraryService();
    setParameterLoading(true);
    service
      .retrieve(assetLibraryId)
      .then(({ data }) => {
        let params = Object.values(data.parameters);
        setParameterOptions(
          params.map((e) => ({
            label: e.parameterName,
            value: e.parameterName,
          }))
        );

        if (alertName) {
          form.setFieldsValue(data.alerts[alertName]);
        }
      })
      .finally(() => {
        setParameterLoading(false);
      });
  }, []);

  const onFinish = (v) => {
    setSaving(true);
    const service = new AssetLibraryService();
    service
      .addorUpdateAlert(assetLibraryId, v)
      .then(({ data }) => {
        afterSave(data);
        if (alertName) message.success("Updated successfully");
        else message.success("Added Successfully");
      })
      .finally(() => {
        setSaving(false);
      });
  };
  return (
    <Form
      ref={ref}
      layout="vertical"
      form={form}
      labelAlign="left"
      onFinish={onFinish}
      initialValues={{ assetLibraryId: assetLibraryId }}
      colon={false}
      Col={{ sm: 16, xs: 24 }}
      disabled={props.disabled}
    >
      <Form.Item
        label="Alert Name"
        name="alertName"
        rules={[
          {
            required: true,
            message: "Please input Alert Name!",
          },
          {
            validator: validateStringWithUnderscore,
          },
        ]}
      >
        <Input disabled={!!alertName} />
      </Form.Item>
      <Form.Item
        label="Parameter Name"
        name="parameterName"
        rules={[{ required: true, message: "Please input Parameter Name!" }]}
      >
        <Select
          // onChange={getParameter}
          loading={parameterLoading}
          autoFocus
          options={parameterOptions}
        />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <TextArea rows={2} maxLength={200} />
      </Form.Item>
      <Space>
        <Form.Item
          label="Priority"
          name="priority"
          rules={[{ required: true, message: "Please select the priority" }]}
        >
          <InputNumber min="1" max="10" />
        </Form.Item>

        <Form.Item
          label="Notification Type"
          name="notificationType"
          rules={[
            {
              required: true,
              message: "Please select the notification type",
            },
          ]}
        >
          <Checkbox.Group
            options={[
              { label: "e-Mail", value: "EMAIL" },
              { label: "SMS", value: "SMS" },
            ]}
          />
        </Form.Item>
      </Space>
      <Form.Item label="Condition">
        <Form.List name="conditions">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: "flex",
                    marginBottom: 8,
                  }}
                  align="baseline"
                >
                  <Form.Item>
                    <Input bordered={false} value="|value|" disabled />
                  </Form.Item>
                  <Form.Item
                    style={{ width: "80px" }}
                    {...restField}
                    name={[name, "operator"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing first name",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Operator"
                      options={[
                        { value: "==", label: "==" },
                        { value: "!=", label: "!=" },
                        { value: ">", label: ">" },
                        { value: ">=", label: ">=" },
                        { value: "<", label: "<" },
                        { value: "<=", label: "<=" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "value"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing last name",
                      },
                    ]}
                  >
                    <Input placeholder="Value" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add field
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary" loading={isSaving}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
}

export default forwardRef(AssetLibraryAlertsForm);
