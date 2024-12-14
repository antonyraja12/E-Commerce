import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Select,
  Spin,
  message,
} from "antd";
import { useEffect, useState } from "react";
import AssetParametersService from "../../../services/asset-parameters-service";
import AssetService from "../../../services/asset-service";
const { Option } = Select;
function AssetParameterForm(props) {
  const { assetId, parameterName } = props;
  const [form] = Form.useForm();
  const [dataType, setDataType] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNumberFields, setShowNumberFields] = useState(false);
  const { getFieldDecorator, getFieldValue } = form;
  const [widgetType, setWidgetType] = useState("");
  const handleDataTypeChange = (value) => {
    setShowNumberFields(value === "NUMBER");
  };
  const isInputValue = (value) => {
    // console.log("check", value);
    setDataType(value);
    form.setFieldValue("defaultValue", null);
    form.setFieldValue("assetDisplayValueDto", []);

    if (value === "BOOLEAN") {
      form.setFieldValue("assetDisplayValueDto", [
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
      // console.log(value);
      form.setFieldValue("assetDisplayValueDto", [
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
  const save = (value) => {
    setSaving(true);
    const service = new AssetService();
    service
      .addorUpdateParameter(assetId, value)
      .then(({ data }) => {
        if (parameterName) message.success("Updated successfully");
        else message.success("Created successfully");
        if (typeof props.afterSave === "function") props.afterSave(data);
      })
      .finally(() => {
        setSaving(false);
      });
  };
  const retrieve = (parameterName) => {
    const service = new AssetService();
    setLoading(true);
    service
      .retrieveParameter(assetId, parameterName)
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
  const handleWidgetTypeChange = (selectedWidgetType) => {
    setWidgetType(selectedWidgetType);
    // Perform additional actions based on the selected widgetType if needed
  };
  return (
    <>
      <Spin spinning={loading}>
        <Form
          onFinish={save}
          form={form}
          layout="vertical"
          requiredMark="optional"
          initialValues={{ assetId: props.assetId }}
        >
          <Form.Item
            hidden
            name="assetId"
            label="Asset Id"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Col sm={16} xs={24}>
            <Form.Item
              name="parameterName"
              label="Parameter name"
              rules={[
                { required: true, message: "ParameterName is mandatory" },
              ]}
            >
              <Input disabled={parameterName ? true : false} />
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
            <Button htmlType="submit" type="primary" loading={saving}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
}

export default AssetParameterForm;
