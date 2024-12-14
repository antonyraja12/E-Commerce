import { LockOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Layout, Typography } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./login.css";
const { Meta } = Card;
const { Text, Title } = Typography;
function Login() {
  const [isLoading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [message, setMessage] = useState("Sign and try again");
  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values, "/tat");
    } catch (e) {
      setMessage(e.response?.data?.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    setMessage(searchParams.get("msg"));
  }, [searchParams]);

  return (
    <Layout
      style={{
        height: "100vh",
        position: "relative",
        // display: "flex",
        // alignItems: "center",
        // justifyContent: "center",
        backgroundColor: "#e0e2f2",
        // backgroundImage: "url(/assembly-line2.png)",
        // backgroundSize: "contain",
        // backgroundPosition: "center",
        // backgroundRepeat: "no-repeat",
      }}
    >
      <div className="login-container">
        <div className="message">
          <Typography.Text type="danger" strong>
            {message}
          </Typography.Text>
        </div>
        <div className="logo">
          <img alt="logo" src="/byteFactory.png" />
        </div>

        <div
          className="image-panel"
          style={{
            backgroundImage: "url(/assembly-line2.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <div className="login-panel" bordered={false}>
          <Typography.Title level={5} className="title">
            Login
          </Typography.Title>

          <Form
            // size="large"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Username"
              name="userName"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                variant="filled"
                prefix={<UserOutlined />}
                placeholder="Enter username"
                autoComplete="off"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                variant="filled"
                prefix={<LockOutlined />}
                placeholder="Enter Password"
                autoComplete="new-password"
              />
            </Form.Item>
            <br />
            <Form.Item noStyle>
              <Button
                loading={isLoading}
                block
                type="primary"
                icon={<LoginOutlined />}
                htmlType="submit"
                style={{ borderRadius: 5 }}
              >
                Login
              </Button>
            </Form.Item>
            <div
              className="forgot-password"
              style={{ textAlign: "right", fontWeight: "500" }}
            >
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </Form>
          <footer>Powered by byteFactory</footer>
        </div>
      </div>
    </Layout>
  );
}
export default Login;
