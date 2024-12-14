import { Form } from "antd";

export const withForm = WrappedComponentForm => props => {
    const [form] = Form.useForm()
    return (
      <WrappedComponentForm
        {...props}
        form={form}
      />
    );
  };
  

  
  