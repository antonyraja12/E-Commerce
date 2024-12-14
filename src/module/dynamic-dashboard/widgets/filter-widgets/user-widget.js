import { Form, Radio } from "antd";

function UserWidget() {
  return (
    <Form.Item name="user[]">
      <Radio.Group options={[]} />
    </Form.Item>
  );
}

export default UserWidget;
