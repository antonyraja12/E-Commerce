import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { Button, Form, Input, Spin, message, Checkbox } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import AssetService from "../../../services/asset-service";
import { useParams } from "react-router-dom";
import AssetLibraryService from "../../../services/asset-library-service";

function ServiceManagerForm(props) {
  const { assetId, assetLibraryId } = useParams();
  const { name } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (name) retrieve(name);
  }, [name]);

  const retrieve = (name) => {
    // const retrieve = (id) => {
    setLoading(true);
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
      .retrieveService(id, name)
      .then(({ data }) => {
        form.setFieldsValue(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onFinish = (value) => {
    setSaving(true);
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
      .addorUpdateService(id, value)
      .then(({ data }) => {
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
        initialValues={{
          active: true,
          assetId: assetId,
          assetLibraryId: assetLibraryId,
        }}
      >
        <Form.Item name="name" label="Name">
          <Input />
        </Form.Item>
        <Form.Item name="assetId" label="AssetId" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="assetLibraryId" label="AssetLibraryId" hidden>
          <Input />
        </Form.Item>
        <Form.List name="argument">
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Form.Item name={name} label={index === 0 ? "Argument" : ""}>
                  <Input
                    addonAfter={
                      <CloseOutlined
                        onClick={() => {
                          remove(name);
                        }}
                      />
                    }
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
            onValidate={(markers) => {
              markers.forEach((marker) =>
                console.log("onValidate:", marker.message)
              );
            }}
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

export default ServiceManagerForm;
