import { Editor, useMonaco } from "@monaco-editor/react";
import { useMemo, useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Spin,
  message,
} from "antd";
import { validateStringWithUnderscore } from "../../../helpers/validation";
import WorkStationService from "../../../services/track-and-trace-service/work-station-service";
function SubscriptionForm(props) {
  const monaco = useMonaco();
  const [workStation, setWorkStation] = useState(null);
  const { workStationId, name } = props;
  const [form] = Form.useForm();
  const trigger = Form.useWatch("trigger", form);
  const mode = Form.useWatch("mode", form);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [propertyOptions, setPropertyOptions] = useState([]);

  const service = new WorkStationService();

  useMemo(() => {
    if (monaco) {
      monaco.languages.registerCompletionItemProvider("javascript", {
        // triggerCharacters: ["."],
        provideCompletionItems: (model, position) => {
          const suggestions = [
            {
              label: "me",
              kind: monaco.languages.CompletionItemKind.Module,
              insertText: "me.",
              detail: "This station",
              documentation: "Current object",
            },
            ...Object.keys(workStation?.propertyDefinition)?.map((value) => ({
              label: "me." + value,
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: "me." + value,
              detail: value,
              documentation: `Description for ${value}`,
            })),
            ...Object.values(workStation?.serviceDefinition)?.map((e) => {
              let arg = {};
              if (e.argument) {
                for (let key of e.argument) {
                  arg[key] = "";
                }
              }
              return {
                label: e.name,
                kind: monaco.languages.CompletionItemKind.Method,
                insertText: e.argument
                  ? `${e.name}(${JSON.stringify(arg, null, 2)})`
                  : `${e.name}()`,
                detail: e.name,
                documentation: `Workstation instance service : ${e.name}`,
              };
            }),
          ];

          return { suggestions };
        },
      });
    }
  }, [monaco, workStation]);

  const retrieve = (name) => {
    setLoading(true);
    service
      .retrieveBySubscriptionName(workStationId, name)
      .then(({ data }) => {
        form.setFieldsValue(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useMemo(() => {
    if (name) retrieve(name);
  }, [name]);
  useMemo(() => {
    service.retrieve(workStationId).then(({ data }) => {
      setWorkStation(data);

      setPropertyOptions(
        Object.keys(data?.propertyDefinition)?.map((e) => ({
          label: e,
          value: e,
        }))
      );
    });
  }, [workStationId]);

  const onFinish = (value) => {
    setSaving(true);
    service
      .addorUpdateSubscription(workStationId, value)
      .then(({ data }) => {
        message.success("Saved successfully");
        props.afterSave();
        form.setFieldsValue(data);
      })
      .finally(() => {
        setSaving(false);
        // setLoading(false);
      });
  };
  return (
    <Spin spinning={loading}>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{
          active: true,
        }}
      >
        <Form.Item
          wrapperCol={{ span: 12 }}
          name="name"
          rules={[
            { required: true, message: "Please enter name" },
            {
              validator: validateStringWithUnderscore,
            },
          ]}
          label="Name"
        >
          <Input />
        </Form.Item>

        <Row gutter={[10, 10]}>
          <Col span={8}>
            <Form.Item name="trigger" label="Trigger">
              <Select
                options={[
                  { value: "AnyDataChange", label: "AnyDataChange" },
                  { value: "DataChange", label: "DataChange" },
                  { value: "Scheduler", label: "Scheduler" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            {trigger === "DataChange" && (
              <Form.Item name="parameterName" label="Property">
                <Select options={propertyOptions || []} showSearch />
              </Form.Item>
            )}

            {trigger === "Scheduler" && (
              <Form.Item name="mode" label="Mode">
                <Select
                  options={[
                    { value: "Cron", label: "Cron" },
                    { value: "Milliseconds", label: "Milliseconds" },
                  ]}
                />
              </Form.Item>
            )}
          </Col>
          <Col span={8}>
            {trigger === "Scheduler" && mode == "Cron" && (
              <Form.Item name="expression" label="Expression">
                <Input />
              </Form.Item>
            )}
            {trigger === "Scheduler" && mode == "Milliseconds" && (
              <Form.Item name="milliSeconds" label="Milli Seconds">
                <InputNumber />
              </Form.Item>
            )}
          </Col>
        </Row>
        <Form.Item name="active" valuePropName="checked">
          <Checkbox>Active</Checkbox>
        </Form.Item>
        <Form.Item name="script" label="Script">
          <Editor
            className="jsEditor"
            height="300px"
            defaultLanguage="javascript"
          />
        </Form.Item>
        <Form.Item>
          <Button loading={saving} htmlType="submit" type="primary">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
}
export default SubscriptionForm;
