import React, { useState, forwardRef, useContext, useEffect } from "react";
import {
  DashboardContext,
  fieldType,
  preDefinedService,
} from "../helper/helper";
import { Form, Input, Select, message, Button, Space, Card, Radio } from "antd";
import FilterService from "../services/filter-service";
import { CloseOutlined } from "@ant-design/icons";

const FilterForm = forwardRef((props, ref) => {
  const { id } = props;
  const [form] = Form.useForm();
  const element = Form.useWatch("element", form);
  const dataSource = Form.useWatch(["filterOption", "dataSource"], form);
  const type = Form.useWatch(["filterOption", "type"], form);
  const { dashboardId } = useContext(DashboardContext);
  const [serviceFields, setServiceFields] = useState([]);
  useEffect(() => {
    const service = new FilterService();
    service.retrieve(id).then(({ data }) => {
      form.setFieldsValue({ ...data });
    });
  }, [id]);

  useEffect(() => {
    const option = preDefinedService.find((e) => e.value === type);
    if (option) {
      setServiceFields(option.fields.map((e) => ({ label: e, value: e })));
    }
    form.setFieldsValue({
      labelKey: null,
      valueKey: null,
    });
  }, [type]);
  const onFinish = (data) => {
    const service = new FilterService();
    service
      .update({ ...data, dashboardId: dashboardId }, id)
      .then(({ data }) => {
        message.success("Saved successfully");
        props.afterSubmit();
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
  return (
    <Form
      ref={ref}
      form={form}
      className="widget-form"
      layout="horizontal"
      size="small"
      labelAlign="left"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 12 }}
      style={{ padding: "5px" }}
      onFinish={onFinish}
    >
      <Form.Item
        label="Element"
        name="element"
        rules={[{ required: true, message: "Select element" }]}
      >
        <Select options={fieldType} />
      </Form.Item>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Name is mandatory" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Label" name="label">
        <Input />
      </Form.Item>
      <Form.Item label="Width" name="width">
        <Input />
      </Form.Item>
      {element === "TreeSelect" && (
        <>
          <Form.Item
            label="Service"
            name={["filterOption", "type"]}
            rules={[{ required: true }]}
          >
            <Select options={preDefinedService} />
          </Form.Item>
          <Form.Item
            label="Value"
            name={["filterOption", "valueKey"]}
            rules={[{ required: true }]}
          >
            <Select options={serviceFields} />
          </Form.Item>
          <Form.Item
            label="Label"
            name={["filterOption", "labelKey"]}
            rules={[{ required: true }]}
          >
            <Select options={serviceFields} />
          </Form.Item>
          <Form.Item
            label="Primary"
            name={["filterOption", "primaryKey"]}
            rules={[{ required: true }]}
          >
            <Select options={serviceFields} />
          </Form.Item>
          <Form.Item
            label="Parent"
            name={["filterOption", "parentKey"]}
            rules={[{ required: true }]}
          >
            <Select options={serviceFields} />
          </Form.Item>
        </>
      )}
      {(element === "Select" ||
        element === "Checkbox" ||
        element === "Radio") && (
        <>
          <Form.Item
            label="Select data source"
            name={["filterOption", "dataSource"]}
          >
            <Radio.Group
              options={[
                { label: "Predefined service", value: 1 },
                { label: "User-entered option", value: 2 },
              ]}
            />
          </Form.Item>
          {dataSource === 1 && (
            <>
              <Form.Item
                label="Service"
                name={["filterOption", "type"]}
                rules={[{ required: true }]}
              >
                <Select options={preDefinedService} />
              </Form.Item>
              <Form.Item
                label="Value"
                name={["filterOption", "valueKey"]}
                rules={[{ required: true }]}
              >
                <Select options={serviceFields} />
              </Form.Item>
              <Form.Item
                label="Label"
                name={["filterOption", "labelKey"]}
                rules={[{ required: true }]}
              >
                <Select options={serviceFields} />
              </Form.Item>
            </>
          )}
          {dataSource === 2 && (
            <>
              <Form.Item label="Options">
                <Form.List name={["filterOption", "options"]}>
                  {(subFields, subOpt) => (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 16,
                      }}
                    >
                      {subFields.map((subField) => (
                        <Space key={subField.key}>
                          <Form.Item noStyle name={[subField.name, "label"]}>
                            <Input placeholder="Label" />
                          </Form.Item>
                          <Form.Item noStyle name={[subField.name, "value"]}>
                            <Input placeholder="Value" />
                          </Form.Item>
                          <CloseOutlined
                            onClick={() => {
                              subOpt.remove(subField.name);
                            }}
                          />
                        </Space>
                      ))}
                      <Button type="dashed" onClick={() => subOpt.add()} block>
                        + Add
                      </Button>
                    </div>
                  )}
                </Form.List>
              </Form.Item>
            </>
          )}
        </>
      )}
    </Form>
  );
});
export default FilterForm;
