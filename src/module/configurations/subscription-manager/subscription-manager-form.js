import { Editor } from "@monaco-editor/react";
import { useEffect, useMemo, useState, useRef } from "react";
import { useMonaco } from "@monaco-editor/react";
// import { useEffect, useState } from "react";
import SubscriptionManagerService from "../../../services/subscription-manager-service";
import {
  Select,
  Button,
  Form,
  Input,
  Spin,
  message,
  Checkbox,
  Space,
  Row,
  Col,
} from "antd";
import { useParams } from "react-router-dom";
import AssetService from "../../../services/asset-service";
import AssetLibraryService from "../../../services/asset-library-service";
// import { Select, Button, Form, Input, Spin, message, Checkbox } from "antd";
function SubscriptionManagerForm(props) {
  const editorRef = useRef(null);
  const [variables, setVariables] = useState([]);
  const { assetId, assetLibraryId } = useParams();
  const { name } = props;
  // const { assetId, subscriptionManagerId, parameters } = props;
  const [form] = Form.useForm();
  const trigger = Form.useWatch("trigger", form);
  const [parameterOptions, setParameterOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const handleEditorDidMount = (editor, monaco) => {
    monaco.languages.registerCompletionItemProvider("javascript", {
      provideCompletionItems: (model, position) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });
        const match = textUntilPosition.match(/me\.$/);
        // if (match) {
        console.log("matched");
        const variableSuggestions = variables.map((variable) => ({
          label: variable,
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: variable,
        }));
        const suggestions = [...variableSuggestions];
        return { suggestions: suggestions };
        // }
      },
    });
    // }
  };
  const retrieve = (name) => {
    setLoading(true);
    // const service = new AssetService();
    let service;
    let id;
    if (assetId) {
      service = new AssetService();
      id = assetId;
    } else if (assetLibraryId) {
      service = new AssetLibraryService();
      id = assetLibraryId;
    }
    service
      .retrieveSubscription(id, name)
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
    // const service = new AssetService();
    let service;
    let id;
    if (assetId) {
      service = new AssetService();
      id = assetId;
    } else if (assetLibraryId) {
      service = new AssetLibraryService();
      id = assetLibraryId;
    }
    service.listParameterAll(id).then(({ data }) => {
      const parameters = data ? Object.values(data) : [];
      setVariables(parameters.map((e) => e.parameterName));

      setParameterOptions(
        parameters
          .map((e) => ({
            value: e.parameterName,
            label: e.parameterName,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    });
  }, [assetId, assetLibraryId]);
  // }, [parameters]);
  const onFinish = (value) => {
    setSaving(true);
    // const service = new AssetService();
    let service;
    let id;
    if (assetId) {
      service = new AssetService();
      id = assetId;
    } else if (assetLibraryId) {
      service = new AssetLibraryService();
      id = assetLibraryId;
    }
    // const retrieve = (assetId, name) => {
    //   setLoading(true);
    // const service = new SubscriptionManagerService();
    service
      .addorUpdateSubscription(id, value)

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
          assetId: assetId,
          assetLibraryId: assetLibraryId,
        }}
      >
        {/* <Form.Item name="name" label="Name"> */}
        <Form.Item wrapperCol={{ span: 12 }} name="name" label="Name">
          <Input />
        </Form.Item>

        <Form.Item name="assetId" label="AssetId" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="assetLibraryId" label="AssetLibraryId" hidden>
          <Input />
        </Form.Item>
        <Row gutter={[10, 10]}>
          <Col span={12}>
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
          <Col span={12}>
            {trigger === "DataChange" && (
              <Form.Item name="parameterName" label="Property">
                <Select options={parameterOptions} showSearch />
              </Form.Item>
            )}
            {trigger === "Scheduler" && (
              <Form.Item name="expression" label="Expression">
                <Input />
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
            onMount={handleEditorDidMount}
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
export default SubscriptionManagerForm;
