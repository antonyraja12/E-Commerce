import { Button, Form, Input, message } from "antd";
import React from "react";
import UserService from "../service/user-register-service";

import CardPage from "./Card";
import { withRouter } from "./prop-router";

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
function RegisterPage(props) {
  const service = new UserService();

  const onFinish = (value) => {
    service.add(value).then((res) => {
      if (res.status == 200) {
        message.success(res.data.message);
        props.navigate("/login");
      } else {
        message.error(res.data.message);
      }
    });
  };
  console.log("porp", props);
  return (
    <>
      <CardPage title="Sign up ">
        <Form onFinish={onFinish} layout="vertical" className="logForm">
          <Form.Item
            name="username"
            label="UserName"
            rules={[
              {
                required: true,
                message: "Please input your nickname!",
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </CardPage>
    </>
  );
}

export default withRouter(RegisterPage);
