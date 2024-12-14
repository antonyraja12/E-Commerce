import {
  Button,
  Typography,
  Form,
  Input,
  Layout,
  Card,
  message,
  Spin,
  Image,
} from "antd";
import {
  UserOutlined,
  MobileOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoginService from "../../services/login-service";

import { useEffect } from "react";

const { Meta } = Card;
const { Text, Title } = Typography;
function ForgotPassword() {
  const [msg, setMsg] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const service = new LoginService();
  const Navigation = useNavigate();
  const onFinish = (values) => {
    setLoading(true);
    service
      .forgotPassword(values)
      .then((response) => {
        if (response.data.success) {
          Navigation("/otp");
        } else message.error(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setMsg(searchParams.get("msg"));
  }, [searchParams]);

  return (
    <>
      <Layout
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f0f2f5",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              flex: 1.3,
              backgroundImage: "url(/manufacturing.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            style={{
              flex: 0.7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // background: "rgba(255, 255, 255, 0.7)",
            }}
          >
            {/* <Card
              bordered={false}
              style={{
                width: 400,
                borderRadius: 10,
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                overflow: "hidden",
                position: "relative",
              }}
            > */}
            <div
              className="login-panel"
              style={{
                width: "100%",
                maxWidth: "400px",
                overflow: "hidden",
                position: "relative",
                // Removed background color

                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  color: "#fff",
                  textAlign: "center",
                  padding: "16px",
                }}
              >
                <img
                  alt="logo"
                  src="/byteFactory.png"
                  style={{
                    width: "120px",
                    marginBottom: "10px",
                  }}
                />
                <Title level={5} style={{ margin: "0", color: "Black" }}>
                  Forgot Password
                </Title>
              </div>

              {/* Card Background Image */}
              <div
                style={{
                  height: "180px",
                  background: `url('/3985678.jpg') no-repeat center center`,
                  backgroundSize: "cover",
                }}
              ></div>

              {/* Card Content */}
              <Spin spinning={isLoading} tip="Processing...">
                <div style={{ padding: "24px" }}>
                  <Text
                    type="secondary"
                    style={{
                      display: "block",
                      marginBottom: "16px",
                      textAlign: "center",
                    }}
                  >
                    Enter your username to receive an OTP for password reset.
                  </Text>
                  {msg && (
                    <Text
                      type="danger"
                      style={{
                        display: "block",
                        marginBottom: "16px",
                        fontSize: "14px",
                        textAlign: "center",
                      }}
                    >
                      {msg}
                    </Text>
                  )}
                  <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                  >
                    <Form.Item
                      name="userName"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your username!",
                        },
                      ]}
                    >
                      <Input
                        suffix={<UserOutlined />}
                        placeholder="Enter username"
                        style={{ borderRadius: "8px" }}
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        block
                        type="primary"
                        icon={<MobileOutlined />}
                        htmlType="submit"
                        style={{ borderRadius: "8px", fontWeight: "500" }}
                      >
                        Send OTP
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </Spin>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default ForgotPassword;
