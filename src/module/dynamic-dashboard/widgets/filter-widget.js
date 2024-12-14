import { Checkbox, Form } from "antd";

function FilterWidget() {
  return (
    <Form>
      <Form.Item name="user[]" label="User">
        <Checkbox.Group />
      </Form.Item>
    </Form>
  );
}

export default FilterWidget;
