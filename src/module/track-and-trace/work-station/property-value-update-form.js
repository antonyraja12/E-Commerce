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
import dayjs from "dayjs";
import { Editor } from "@monaco-editor/react";
import WorkStationService from "../../../services/track-and-trace-service/work-station-service";
function UpdatePropertyValue({
  id,
  dataType,
  open,
  parameterName,
  value,
  onClose,
  disabled,
}) {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    let val;

    switch (dataType) {
      case "DATETIME":
      case "DATE":
      case "DATE":
        val = dayjs(value).isValid() ? dayjs(value) : null;
        break;

      default:
        val = value;
        break;
    }
    form.setFieldsValue({
      parameterName,
      value: val,
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
        returnData = <DatePicker format="DD-MM-YYYY hh:mm:ss A" showTime />;
        break;
      case "DATE":
        returnData = <DatePicker format="DD-MM-YYYY" />;
        break;
      case "TIME":
        returnData = <TimePicker format="hh:mm:ss A" />;
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
    // if (dataType === "JSON") {
    //   try {
    //     value = JSON.parse(value);
    //   } catch (e) {
    //     setSaving(false);
    //   }
    // }

    const service = new WorkStationService();
    service
      .updatePropertyValue(id, parameterName, value)
      .then(({ data }) => {
        onClose(data);
      })
      .finally(() => {
        setSaving(false);
      });
  };
  return (
    <Form disabled={disabled} onFinish={onFinish} form={form} layout="vertical">
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

export default UpdatePropertyValue;
