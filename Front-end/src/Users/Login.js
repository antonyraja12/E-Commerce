import {
  Button,
  Form,
  Input,
  Flex,
  Layout,
  ConfigProvider,
  Card,
  Row,
  Col,
  Typography,
  message,
} from "antd";
import React from "react";
import { TinyColor } from "@ctrl/tinycolor";
import FormItem from "antd/es/form/FormItem";
import { HiLockClosed, HiOutlineUser } from "react-icons/hi";
import { Link } from "react-router-dom";
import LoginService from "../service/login-service";
import { withRouter } from "./prop-router";

const service = new LoginService();

function LoginPage(props) {
  const onFinish = (values) => {
    service
      .login(values)
      .then((response) => {
        if (response.data.success) {
          service.saveToken(response.data.token);
          service.saveUserName(values.username);
          props.navigate("/home");
        } else {
          console.log(response, "response");
        }
      })
      .catch((err) => {
        message.error(err);
      });
  };

  return (
    <Row justify={"center"}>
      <Col sm={8} xs={24}>
        <Card cover={<img alt="example" src="/shopping.jpg" />}>
          <Form
            layout="vertical"
            name="basic"
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}

            // autoComplete="off"
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input
                type="text"
                prefix={<HiOutlineUser />}
                placeholder="Email or username"
              />
            </Form.Item>
            <br />

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                prefix={<HiLockClosed />}
                placeholder="Password"
              />
            </Form.Item>

            <Row justify={"center"}>
              <Col sm={8}>
                <p> Forgot Password ? </p>
              </Col>
              <Col>
                <p>
                  <Link to="/register"> Create an Account </Link>
                </p>
              </Col>
            </Row>

            <Row justify={"center"}>
              <Col>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Login
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

export default withRouter(LoginPage);
