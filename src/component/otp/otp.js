import { LoginOutlined } from "@ant-design/icons";
import { Button, Form, Input, Layout, message, Spin, Typography } from "antd";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoginService from "../../services/login-service";

import { useEffect } from "react";
const { Text, Title } = Typography;
function Otp() {
  const [msg, setMsg] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [resendOtpLoading, setResendOtpLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const service = new LoginService();
  const Navigation = useNavigate();
  const onFinish = (values) => {
    setLoading(true);
    service
      .validateOtp({
        ...service.getChangePasswordDetail(),
        ...values,
      })
      .then((response) => {
        if (response.data.success) {
          Navigation("/change-password");
        } else message.error(response.data.message);
      })
      .catch((error) => {
        console.log(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setMsg(searchParams.get("msg"));
  }, [searchParams]);

  const resendOtp = () => {
    setResendOtpLoading(true);
    service
      .forgotPassword({
        ...service.getChangePasswordDetail(),
      })
      .then((response) => {
        if (response.data.success) {
          message.success(response.data.message);
        } else message.error(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setResendOtpLoading(false);
      });
  };
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
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
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
            }}
          >
            <Spin spinning={isLoading}>
              <div
                className="login-panel"
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div style={{ textAlign: "center", padding: "16px" }}>
                  <img
                    alt="logo"
                    src="/byteFactory.png"
                    style={{ width: "120px", marginBottom: "10px" }}
                  />
                  <Title level={5} style={{ margin: "0", color: "Black" }}>
                    OTP
                  </Title>
                </div>
                <div
                  style={{
                    height: "180px",
                    background: `url('/5191079.jpg') no-repeat center center`,
                    backgroundSize: "cover",
                  }}
                />
                <div style={{ padding: "24px" }}>
                  <Text
                    type="secondary"
                    style={{
                      display: "block",
                      marginBottom: "16px",
                      textAlign: "center",
                    }}
                  >
                    Enter the OTP that we sent to your phone number or email
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
                    size="large"
                  >
                    <Form.Item
                      label="OTP"
                      name="otp"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input.OTP length={6} />
                    </Form.Item>
                    <Typography.Text
                      type="secondary"
                      // style={{ textAlign: "center", marginTop: "10px" }}
                    >
                      Didn't receive OTP?
                      <Button
                        type="link"
                        onClick={resendOtp}
                        loading={resendOtpLoading}
                      >
                        Click here.
                      </Button>
                    </Typography.Text>

                    <Form.Item>
                      <Button
                        block
                        type="primary"
                        icon={<LoginOutlined />}
                        htmlType="submit"
                        style={{ borderRadius: "8px", fontWeight: "500" }}
                      >
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </Spin>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Otp;
