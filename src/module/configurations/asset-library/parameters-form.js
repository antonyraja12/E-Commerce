import { Button, Col, Form, Input, Select, Spin, message } from "antd";
import { useEffect, useState } from "react";
import AssetLibraryService from "../../../services/asset-library-service";
import { validateStringWithUnderscore } from "../../../helpers/validation";
const { Option } = Select;
function ParameterForm(props) {
  const { assetLibraryId, parameterName } = props;
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
    const service = new AssetLibraryService();
    service
      .addorUpdateParameter(assetLibraryId, value)
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
    const service = new AssetLibraryService();
    setLoading(true);
    service
      .retrieveParameter(assetLibraryId, parameterName)
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
          initialValues={{ assetLibraryId: props.assetLibraryId }}
        >
          <Form.Item
            hidden
            name="assetLibraryId"
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
                {
                  required: true,
                  message: "Parameter name is mandatory",
                },
                {
                  validator: validateStringWithUnderscore,
                },
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
                { required: true, message: "Please enter the Data type" },
              ]}
            >
              <Select onChange={isInputValue}>
                <Option value="STRING">STRING</Option>
                <Option value="BOOLEAN">BOOLEAN</Option>
                {/* <Option value="STRINGBOOL">MULTI STATE</Option> */}
                <Option value="NUMBER">NUMBER</Option>
                {/* <Option value="DATETIME">DATETIME</Option> */}
              </Select>
            </Form.Item>
            {}
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

export default ParameterForm;
