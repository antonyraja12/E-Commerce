import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Space,
  Spin,
  Tooltip,
  TreeSelect,
  message,
} from "antd";
import DashboardMasterService from "../../../../services/dynamic-dashboard/dashboard-master-service";
import { forwardRef, useEffect, useState } from "react";
import { baseUrl, rootUrl } from "../../../../helpers/url";
import MenuService from "../../../../services/menu-service";
import {
  InfoCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { add } from "lodash";
import { offset } from "react-tooltip";

const DashboardMasterForm = forwardRef((props, ref) => {
  const [loading, setLoading] = useState(false);
  const [menuTreeData, setMenuTreeData] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const onFinish = (value) => {
    setSaving(true);
    const service = new DashboardMasterService();
    let req;
    if (!props.id) {
      req = service.add(value);
    } else {
      req = service.update(value, props.id);
    }

    req
      .then(({ data }) => {
        message.success("Saved Successfully");

        if (typeof props.afterSave === "function") props?.afterSave(data);
      })
      .finally(() => {
        setSaving(false);
      });
  };
  useEffect(() => {
    if (props.id) {
      setLoading(true);
      const service = new DashboardMasterService();
      service
        .retrieve(props.id)
        .then(({ data }) => {
          if (data.apiUrl.length > 0) form.setFieldsValue(data);
          else form.setFieldsValue({ ...data, apiUrl: [""] });
        })
        .finally(() => {
          setLoading(false);
        });
    }
    loadMenuList();
  }, []);
  const loadMenuList = () => {
    const menuService = new MenuService();
    menuService.list({ status: true }).then(({ data }) => {
      setMenuTreeData(menuService.convertTreeOption(data));
    });
  };
  return (
    <Spin spinning={loading}>
      <Form
        ref={ref}
        form={form}
        layout="horizontal"
        labelAlign="left"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        initialValues={{ status: true }}
      >
        <Form.Item name="menuId" label="Menu">
          <TreeSelect treeData={menuTreeData} />
        </Form.Item>
        <Form.Item name="heading" label="Heading">
          <Input />
        </Form.Item>

        <Space
          style={{
            color: "#9AA6C",
            fontWeight: "200",
            paddingLeft: "80px",
            paddingBottom: "5px",
          }}
        >
          <InfoCircleOutlined />
          <span>Note: {baseUrl}</span>
        </Space>

        <Form.List name="apiUrl" initialValue={[""]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  label={index === 0 ? "API URL" : ""}
                  {...field}
                  rules={[{ message: "Please enter API URL" }]}
                  labelcol={index === 0 ? { span: 4 } : ""}
                  wrapperCol={
                    index === 0 ? { span: 16 } : { span: 16, offset: 4 }
                  }
                  key={field.key}
                >
                  <Input
                    placeholder="Enter API URL"
                    addonAfter={
                      index === 0 ? (
                        // index === fields.length - 1 ? (
                        <Button
                          type="text"
                          size="small"
                          onClick={() => add()}
                          icon={<PlusOutlined />}
                        />
                      ) : (
                        <Button
                          type="text"
                          size="small"
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(field.name)}
                        />
                      )
                    }
                  />
                </Form.Item>
              ))}
            </>
          )}
        </Form.List>

        <Form.Item name="status" label="Status">
          <Radio.Group>
            <Radio value={true}>Active</Radio>
            <Radio value={false}>Inactive</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Spin>
  );
});

export default DashboardMasterForm;
