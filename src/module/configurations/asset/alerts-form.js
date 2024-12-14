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
// import AssetLibraryService from "../../../services/asset-library-service";
import { validateStringWithUnderscore } from "../../../helpers/validation";
import ModuleSelectionService from "../../../services/preventive-maintenance-services/module-selection-service";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import { log } from "three/examples/jsm/nodes/Nodes.js";
import TicketGenerationService from "../../../services/preventive-maintenance-services/ticket-generation-service";

const { TextArea } = Input;

function AlertsForm(props, ref) {
  const [form] = Form.useForm();
  const aHId = Form.useWatch("aHId", form);
  const { assetId, alertName, afterSave } = props;
  const [parameterOptions, setParameterOptions] = useState([]);
  const [moduleNames, setModuleNames] = useState([]);
  const [isSaving, setSaving] = useState(false);
  const [parameterLoading, setParameterLoading] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [formData, setFormData] = useState({});
  const [filteredModules, setFilteredModules] = useState([]);
  const service = new AssetService();
  const moduleService = new ModuleSelectionService();
  const appHierarchyService = new AppHierarchyService();
  const ticketGenerationService = new TicketGenerationService();
  // const onCheckboxChange = (e) => {
  //   setCheckboxValue(e.target.checked);
  //   props.form.setFieldValue("ticketSt");
  // };
  const onCheckboxChange = (e) => {
    setCheckboxValue(e.target.checked);
    form.setFieldValue("status", e.target.checked);
  };

  const getAppHierarchyList = () => {
    appHierarchyService.list({ active: true }).then(({ data }) => {
      let treeData = appHierarchyService.convertToSelectTree(data);
      form.setFieldValue("aHId", treeData[0]?.value);
      setFormData({
        aHId: treeData[0]?.value,
      });
    });
  };

  // useEffect(() => {
  //   getAppHierarchyList();
  // }, []);

  useEffect(() => {
    setParameterLoading(true);
    getAppHierarchyList();

    service
      .retrieve(assetId)
      .then(({ data }) => {
        const assetData = data;
        let params = Object.values(assetData.parameters);
        setParameterOptions(
          params.map((e) => ({
            label: e.parameterName,
            value: e.parameterName,
          }))
        );

        if (alertName) {
          ticketGenerationService
            .getTicketGeneration(alertName, assetId)
            .then(({ data }) => {
              setCheckboxValue(data.status);
              form.setFieldsValue({
                ...assetData.alerts[alertName],
                moduleName: data?.moduleName?.map((e) => e),
                status: data.status,
              });
            });
          form.setFieldsValue(assetData.alerts[alertName]);
        }
        moduleService.basedOnAhid(assetData?.ahid).then(({ data }) => {
          const moduleNamesArray = data?.moduleName
            ?.filter((value) => desiredModules.includes(value))
            .map((name) => ({
              label: name,
              value: name,
            }));
          setModuleNames(moduleNamesArray);
        });
        const desiredModules = [
          "preventivemaintenance",
          "qualityinspection",
          "inspectionmanagement",
        ];
      })
      .finally(() => {
        setParameterLoading(false);
      });
  }, []);

  const onFinish = (v) => {
    setSaving(true);
    const service = new AssetService();
    service
      .addorUpdateAlert(assetId, v)
      .then(({ data }) => {
        afterSave(data);
        if (alertName) {
          console.log("status", v);
          service.alertTicket({
            assetId: assetId,
            alertName: v?.alertName,
            status: form.getFieldValue("status"),
            moduleName: v?.moduleName,
          });
          message.success("Updated successfully");
        } else {
          if (v?.status) {
            service.alertTicket({
              assetId: assetId,
              alertName: v?.alertName,
              status: form.getFieldValue("status"),
              moduleName: v?.moduleName,
            });
          }

          message.success("Added Successfully");
        }
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
      initialValues={{ assetId: assetId }}
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

      <Form.Item name="status" valuePropName="checked">
        <label style={{ marginRight: 8 }}>Ticket Generation</label>

        <Checkbox
          checked={checkboxValue}
          onChange={(e) => onCheckboxChange(e)}
        />
      </Form.Item>
      {checkboxValue && (
        <Form.Item
          label="Module Name"
          name={"moduleName"}
          rules={[{ required: true, message: "Please input module Name!" }]}
        >
          <Select
            // onChange={getParameter}
            // loading={parameterLoading}

            autoFocus
            mode="multiple"
            options={moduleNames}
          />
        </Form.Item>
      )}

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

export default forwardRef(AlertsForm);
