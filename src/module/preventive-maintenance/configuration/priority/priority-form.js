import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Spin,
} from "antd";

import ColorPickerModal from "./color-picker-popup";

import React from "react";
import { validateName } from "../../../../helpers/validation";
import PriorityService from "../../../../services/preventive-maintenance-services/priority-service";
import PageForm from "../../../../utils/page/page-form";
import Popups from "../../../../utils/page/popups";
import { withForm } from "../../../../utils/with-form";

class PriorityForm extends PageForm {
  service = new PriorityService();

  constructor(props) {
    super(props);
    this.state = {
      selectedColor: "",
      colorPickerVisible: false,
      fields: [{ key: 0 }],
    };
  }
  formRef = React.createRef();
  handleAdd = () => {
    const { fields } = this.state;
    const newFields = [...fields, { key: fields.length }];
    this.setState({ fields: newFields });
  };

  handleRemove = (key) => {
    let { fields } = this.state;
    fields = fields.filter((field) => field.key !== key);
    if (fields.length > 0) {
      this.setState({ fields });
    }
  };
  closePopup = (data = false) => {
    this.props.form.resetFields();
    this.props.close(data);
  };
  onSuccess(data) {
    super.onSuccess(data);
    this.closePopup(true);
  }

  patchForm = (data) => {
    this.props.form.setFieldsValue({
      priorityGroupId: data.priorityGroupId,
      priorityGroupName: data.priorityGroupName,
      priorityMappingList: data.priorityMappingList,
      description: data.description,
    });
  };
  handleColorPickerClose = () => {
    this.setState({ colorPickerVisible: false });
  };

  handleColorChange = (color, index) => {
    this.setState({ selectedColor: color });
  };

  handleColorPickerClose = () => {
    this.setState({ colorPickerVisible: false });
  };

  handleColorPickerOpen = () => {
    this.setState({ colorPickerVisible: true });
  };

  componentDidMount(prevState) {
    const { form } = this.props;
    form.setFieldsValue({
      priorityMappingList: [{ color: "" }], // Set a default value if needed
    });

    super.componentDidMount();
    if (prevState?.selectedColor !== this.state.selectedColor) {
      // Access the updated colorValues and perform any necessary actions
      console.log("Updated Color Values:", this.state.selectedColor);
    }
  }

  render() {
    return (
      <Popups
        footer={[
          <Row justify="end">
            <Space>
              <Col>
                {(this.props.mode === "Add" ||
                  this.props.mode === "Update") && (
                  <Button key="close" onClick={this.closePopup}>
                    Cancel
                  </Button>
                )}
              </Col>
              <Col>
                {(this.props.mode === "Add" ||
                  this.props.mode === "Update") && (
                  <Button
                    key="submit"
                    type="primary"
                    onClick={this.props.form.submit}
                    htmlType="submit"
                  >
                    {this.props.mode === "Add" ? "Save" : "Update"}
                  </Button>
                )}
              </Col>
            </Space>
          </Row>,
        ]}
        title={this.state?.title}
        open={this.state?.open}
        onCancel={this.closePopup}
      >
        <Spin spinning={!!this.state.isLoading}>
          {
            <Form
              ref={this.formRef}
              size="small"
              labelAlign="left"
              className="form-horizontal"
              colon={false}
              layout="horizontal"
              form={this.props.form}
              labelCol={{ sm: 8, xs: 24 }}
              wrapperCol={{ sm: 16, xs: 24 }}
              onFinish={this.onFinish}
              disabled={this.state.disabled}
              // initialValues={this.state.initialValues}
            >
              <Form.Item hidden name="priorityGroupId">
                <Input />
              </Form.Item>
              <Form.Item
                label="Priority Set"
                name="priorityGroupName"
                rules={[
                  {
                    required: true,
                    message: "Enter priority set name",
                  },
                  {
                    validator: validateName,
                  },
                ]}
              >
                <Input placeholder="" />
              </Form.Item>

              <Form.List name="priorityMappingList" initialValue={[{ key: 0 }]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields?.map((field, i) => (
                      <Form.Item label="PrioritySet Values" key={field.key}>
                        <Row align="bottom" gutter={10} key={field.key}>
                          <Col span={7}>
                            <Form.Item
                              style={{ margin: 0 }}
                              {...field}
                              // label="Value"
                              name={[field.name, "valueNumber"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Enter Values",
                                },
                              ]}
                            >
                              <Input placeholder="ex : 1,2" />
                            </Form.Item>
                          </Col>
                          <Col span={7}>
                            <Form.Item
                              style={{ margin: 0 }}
                              {...field}
                              name={[field.name, "value"]}
                              rules={[
                                {
                                  required: true,
                                  message: " `",
                                },
                              ]}
                            >
                              <Input placeholder="Display Name" />
                            </Form.Item>
                          </Col>
                          <Col span={7}>
                            <Form.Item
                              style={{ margin: 0 }}
                              {...field}
                              name={[field.name, "color"]}
                              rules={[
                                {
                                  required: true,
                                  message: "` ",
                                },
                              ]}
                            >
                              <Select
                                placeholder="Colors"
                                onChange={(value) =>
                                  this.setState({ selectedColor: value })
                                }
                                allowClear
                              >
                                <Select.Option value="Red">Red</Select.Option>
                                <Select.Option value="Amber">
                                  Amber
                                </Select.Option>
                                <Select.Option value="Orange">
                                  Orange
                                </Select.Option>
                                <Select.Option value="Yellow">
                                  Yellow
                                </Select.Option>
                                <Select.Option value="Green">
                                  Green
                                </Select.Option>
                                <Select.Option value="Blue">Blue</Select.Option>
                                <Select.Option value="Brown">
                                  Brown
                                </Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={3}>
                            <Button
                              type="text"
                              icon={<MinusCircleOutlined />}
                              onClick={() => {
                                this.handleRemove(field.key);
                                remove(field.name);
                              }}
                              disabled={
                                this.props.mode === "View" ||
                                fields.length === 1
                              }
                            />
                          </Col>
                        </Row>
                      </Form.Item>
                    ))}

                    <Form.Item label=" ">
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Value
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              <Form.Item name="description" label="Description">
                <Input autoFocus maxLength={200} />
              </Form.Item>
              <Form.Item name="status" label="Status" initialValue={true}>
                <Radio.Group>
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>Inactive</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
            // </Col>
            // </Row>
          }
        </Spin>
        <ColorPickerModal
          visible={this.state.colorPickerVisible}
          color={this.state.selectedColor}
          onCancel={this.handleColorPickerClose}
          onOK={this.handleColorPickerClose}
          onColorChange={this.handleColorChange}
        />
      </Popups>
    );
  }
}
export default withForm(PriorityForm);
