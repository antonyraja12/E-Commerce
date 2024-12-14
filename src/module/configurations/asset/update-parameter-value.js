import {
  Button,
  Checkbox,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Radio,
  TimePicker,
} from "antd";
import { useEffect, useState } from "react";
import AssetEngineService from "../../../services/asset-engine-service";
import { Editor } from "@monaco-editor/react";
function UpdateParameterValue({
  assetId,
  dataType,
  open,
  parameterName,
  value,
  onClose,
}) {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      parameterName,
      value,
    });
  }, [dataType, parameterName, value]);

  const input = (dataType) => {
    let returnData = <></>;
    switch (dataType) {
      case "NUMBER":
        returnData = <InputNumber style={{ width: "100%" }} />;
        break;
      case "BOOLEAN":
        returnData = (
          <Radio.Group
            options={[
              { label: "True", value: true },
              { label: "False", value: false },
            ]}
          />
        );
        break;
      case "JSON":
        returnData = (
          <Editor className="jsEditor" height="300px" defaultLanguage="json" />
        );
        break;
      case "DATETIME":
        returnData = <DatePicker showTime />;
        break;
      case "DATE":
        returnData = <DatePicker />;
        break;
      case "TIME":
        returnData = <TimePicker />;
        break;
      case "STRING":
      default:
        returnData = <Input />;
        break;
    }
    return returnData;
  };
  const onFinish = ({ parameterName, value }) => {
    setSaving(true);
    const service = new AssetEngineService();
    service
      .updateParameterValue(assetId, parameterName, value)
      .then(({ data }) => {
        onClose(data);
      })
      .finally(() => {
        setSaving(false);
      });
  };
  return (
    <Form onFinish={onFinish} form={form} layout="vertical">
      <Form.Item name="parameterName" label="Parameter Name" hidden>
        <Input />
      </Form.Item>
      <Form.Item label="Update Parameter Value" name="value">
        {input(dataType)}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={saving}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default UpdateParameterValue;
