import { Editor, useMonaco } from "@monaco-editor/react";
import { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Spin, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import WorkStationService from "../../../services/track-and-trace-service/work-station-service";
import { validateStringWithUnderscore } from "../../../helpers/validation";

function ServiceForm(props) {
  const monaco = useMonaco();
  const { name, workStationId } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [parameterName, setParameterName] = useState([]);
  const [editorInstance, setEditorInstance] = useState(null); // To store the Monaco editor instance
  const [workStation, setWorkStation] = useState(null);
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

  useEffect(() => {
    if (name) retrieve(name);
  }, [name]);

  useEffect(() => {
    if (workStationId) {
      listProperties();
    }
  }, [workStationId]);

  const listProperties = () => {
    setLoading(true);
    service
      .retrieve(workStationId)
      .then(({ data }) => {
        setWorkStation(data);
        // const serviceName = Object.keys(data.serviceDefinition);

        const parameterNames = Object.values(data.propertyDefinition).map(
          (property) => property.parameterName
        );
        setParameterName(parameterNames.sort());
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const retrieve = (name) => {
    setLoading(true);
    service
      .retrieveByServiceName(workStationId, name)
      .then(({ data }) => {
        form.setFieldsValue(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onFinish = (value) => {
    setSaving(true);
    service
      .addorUpdateService(workStationId, value)
      .then(() => {
        message.success("Saved successfully");
        if (typeof props.afterSave === "function") props.afterSave();
      })
      .finally(() => {
        setSaving(false);
      });
  };

  return (
    <Spin spinning={loading}>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{ active: true }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: "Please enter name" },
            { validator: validateStringWithUnderscore },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.List name="argument">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }, index) => (
                <Form.Item
                  key={key}
                  name={name}
                  label={index === 0 ? "Argument" : ""}
                >
                  <Input
                    addonAfter={<CloseOutlined onClick={() => remove(name)} />}
                  />
                </Form.Item>
              ))}
              <Button type="dashed" onClick={() => add()} block>
                Add More Arguments
              </Button>
            </>
          )}
        </Form.List>

        <Form.Item name="body" label="Script">
          <Editor
            className="jsEditor"
            height="300px"
            defaultLanguage="javascript"
            // onMount={(editor, monaco) => {
            //   setEditorInstance(monaco);
            //   if (parameterName.length > 0) {
            //     setupAutoComplete(monaco, parameterName);
            //   }
            // }}
            // onValidate={(markers) => {
            //   markers.forEach((marker) =>
            //     console.log("onValidate:", marker.message)
            //   );
            // }}
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

export default ServiceForm;
