import {
  Button,
  Typography,
  Form,
  Input,
  Layout,
  Card,
  message,
  Spin,
  Progress,
  Statistic,
  Col,
  Row,
} from "antd";
import {
  CheckCircleFilled,
  LikeOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  LoginOutlined,
  CloseCircleOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import { Alert } from "antd";

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoginService from "../../services/login-service";

import { useEffect } from "react";

import PasswordIndicator from "./password-indicator";
import color from "../../module/configurations/color/color";

const { Text } = Typography;
// function ChangePassword() {
//   const [level, setLevel] = useState(0);
//   const [input, setInput] = useState("");
//   const minLevel = 3;
//   const [msg, setMsg] = useState(null);
//   const [isLoading, setLoading] = useState(false);
//   const [searchParams] = useSearchParams();
//   const service = new LoginService();
//   const Navigation = useNavigate();
//   const onFinish = (values) => {
//     setLoading(true);
//     service
//       .changePassword({ ...service.getChangePasswordDetail(), ...values })
//       .then((response) => {
//         if (response.data.success) {
//           service.saveToken(response.data.token);
//           service.saveUserName(service.getChangePasswordDetail()?.userName);
//           Navigation("../");
//         } else message.error(response.data.message);
//       })
//       .catch((error) => {
//         console.log(error);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };
//   const [requirements, setRequirements] = useState({
//     characters: false,
//     uppercase: false,
//     lowercase: false,
//     number: false,
//     symbol: false,
//   });

//   useEffect(() => {
//     setMsg(searchParams.get("msg"));
//   }, [searchParams]);
//   const passwordStrength = (passwordValue) => {
//     const passwordLength = passwordValue.length;
//     const capsRegExp = /[A-Z]/;
//     const poorRegExp = /[a-z]/;
//     const weakRegExp = /(?=.*?[0-9])/;
//     const strongRegExp = /(?=.*?[#?!@$%^&*-])/;
//     const whitespaceRegExp = /^$|\s+/;

//     const capsCheck = capsRegExp.test(passwordValue);

//     const poorPassword = poorRegExp.test(passwordValue);
//     const weakPassword = weakRegExp.test(passwordValue);
//     const strongPassword = strongRegExp.test(passwordValue);
//     const whiteSpace = whitespaceRegExp.test(passwordValue);
//     let lvl = 0;

//     let trueCount = checkTrueCount(
//       capsCheck && poorPassword,
//       weakPassword,
//       strongPassword
//     );
//     if (passwordLength === 0) {
//       lvl = 0;
//     } else if (
//       (passwordLength > 0 && passwordLength <= 3) ||
//       trueCount === 1 ||
//       trueCount === 0
//     ) {
//       lvl = 1;
//     } else if ((passwordLength > 3 && passwordLength <= 6) || trueCount === 2) {
//       lvl = 2;
//     } else if (passwordLength > 6 && trueCount === 3) {
//       lvl = 3;
//     } else;

//     setLevel(lvl);
//   };
//   const checkTrueCount = (a, b, c) => {
//     return Number(a) + Number(b) + Number(c);
//   };
//   return (
//     <>
//       <Layout
//         style={{
//           height: "100vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           background: "#f0f2f5",
//           backgroundImage: "url(/manufacturing.png)",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <Spin spinning={isLoading}>
//           <Card
//             bordered={false}
//             className="login-panel"
//             style={{
//               width: "100%",
//               maxWidth: 400,
//               borderRadius: 10,
//               boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//               overflow: "hidden",
//             }}
//           >
//             <div style={{ textAlign: "center", marginBottom: 20 }}>
//               <img
//                 alt="logo"
//                 src="/byteFactory.png"
//                 style={{
//                   width: "80%",
//                   maxWidth: "150px",
//                   marginBottom: "20px",
//                 }}
//               />
//               <h3>Password Requirements</h3>
//               <Row gutter={[16, 16]} justify="center">
//                 <Col>
//                   <CheckCircleOutlined
//                     style={{
//                       color: requirements.characters ? "green" : "gray",
//                     }}
//                   />
//                   <Text> 6+ Characters</Text>
//                 </Col>
//                 <Col>
//                   <CheckCircleOutlined
//                     style={{ color: requirements.uppercase ? "green" : "gray" }}
//                   />
//                   <Text> Uppercase</Text>
//                 </Col>
//                 <Col>
//                   <CheckCircleOutlined
//                     style={{ color: requirements.lowercase ? "green" : "gray" }}
//                   />
//                   <Text> Lowercase</Text>
//                 </Col>
//                 <Col>
//                   <CheckCircleOutlined
//                     style={{ color: requirements.number ? "green" : "gray" }}
//                   />
//                   <Text> Number</Text>
//                 </Col>
//                 <Col>
//                   <CheckCircleOutlined
//                     style={{ color: requirements.symbol ? "green" : "gray" }}
//                   />
//                   <Text> Symbol</Text>
//                 </Col>
//               </Row>
//             </div>
//             <div
//               className="login-form"
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 width: "100%",
//                 padding: "24px",
//                 backgroundColor: "#fff",
//                 borderRadius: "8px",
//               }}
//             >
//               {msg && (
//                 <Text type="danger" style={{ marginBottom: "16px" }}>
//                   {msg}
//                 </Text>
//               )}
//               <Form
//                 name="basic"
//                 initialValues={{ remember: true }}
//                 onFinish={onFinish}
//                 autoComplete="off"
//                 layout="vertical"
//                 style={{ width: "100%" }}
//               >
//                 <div style={{ position: "relative" }}>
//                   <Form.Item
//                     name="newPassword"
//                     rules={[
//                       { required: true, message: "Please enter password!" },
//                       {
//                         validator: async (_, value) => {
//                           return !value || level >= minLevel
//                             ? Promise.resolve()
//                             : Promise.reject("Password is too weak");
//                         },
//                         message: "Password is too weak",
//                       },
//                     ]}
//                     hasFeedback
//                   >
//                     <Input.Password
//                       placeholder="Enter new password"
//                       onChange={(e) => passwordStrength(e.target.value)}
//                     />
//                   </Form.Item>
//                   <PasswordIndicator
//                     level={level}
//                     style={{ position: "relative", bottom: 0 }}
//                   />
//                 </div>
//                 <br />
//                 <Form.Item
//                   name="confirmPassword"
//                   dependencies={["newPassword"]}
//                   hasFeedback
//                   rules={[
//                     { required: true, message: "Please re-enter password!" },
//                     ({ getFieldValue }) => ({
//                       validator(_, value) {
//                         if (!value || getFieldValue("newPassword") === value) {
//                           return Promise.resolve();
//                         }
//                         return Promise.reject(
//                           new Error(
//                             "The new password that you entered does not match!"
//                           )
//                         );
//                       },
//                     }),
//                   ]}
//                 >
//                   <Input.Password
//                     onPaste={(e) => e.preventDefault()}
//                     visibilityToggle={false}
//                     placeholder="Re-enter password"
//                   />
//                 </Form.Item>

//                 <Form.Item>
//                   <Button
//                     block
//                     type="primary"
//                     icon={<LoginOutlined />}
//                     htmlType="submit"
//                   >
//                     Change Password and Login
//                   </Button>
//                 </Form.Item>
//               </Form>
//             </div>
//           </Card>
//         </Spin>
//       </Layout>
//     </>
//   );
// }

// export default ChangePassword;

const ChangePassword = () => {
  const [level, setLevel] = useState(0);
  const [input, setInput] = useState("");
  const minLevel = 3;
  const [msg, setMsg] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const service = new LoginService();
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    service
      .changePassword({ ...service.getChangePasswordDetail(), ...values })
      .then((response) => {
        if (response.data.success) {
          service.saveToken(response.data.token);
          service.saveUserName(service.getChangePasswordDetail()?.userName);
          navigate("../");
        } else {
          message.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [requirements, setRequirements] = useState({
    characters: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false,
  });

  useEffect(() => {
    setMsg(searchParams.get("msg"));
  }, [searchParams]);

  const passwordStrength = (passwordValue) => {
    const passwordLength = passwordValue.length;
    const capsRegExp = /[A-Z]/;
    const poorRegExp = /[a-z]/;
    const weakRegExp = /(?=.*?[0-9])/;
    const strongRegExp = /(?=.*?[#?!@$%^&*-])/;

    const capsCheck = capsRegExp.test(passwordValue);
    const poorPassword = poorRegExp.test(passwordValue);
    const weakPassword = weakRegExp.test(passwordValue);
    const strongPassword = strongRegExp.test(passwordValue);

    let lvl = 0;
    let trueCount = checkTrueCount(
      capsCheck && poorPassword,
      weakPassword,
      strongPassword
    );

    if (passwordLength === 0) {
      lvl = 0;
    } else if (
      (passwordLength > 0 && passwordLength <= 3) ||
      trueCount === 1 ||
      trueCount === 0
    ) {
      lvl = 1;
    } else if ((passwordLength > 3 && passwordLength <= 6) || trueCount === 2) {
      lvl = 2;
    } else if (passwordLength > 6 && trueCount === 3) {
      lvl = 3;
    }

    setRequirements({
      characters: passwordLength >= 6,
      uppercase: capsCheck,
      lowercase: poorPassword,
      number: weakPassword,
      symbol: strongPassword,
    });

    setLevel(lvl);
  };

  const checkTrueCount = (a, b, c) => {
    return Number(a) + Number(b) + Number(c);
  };

  return (
    // <Layout
    //   style={{
    //     height: "100vh",
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     background: "#f0f2f5",
    //     backgroundImage: "url(/manufacturing.png)",
    //     backgroundSize: "cover",
    //     backgroundPosition: "center",
    //   }}
    // >
    //   <Spin spinning={isLoading}>
    //     <Card
    //       bordered={false}
    //       className="login-panel"
    //       style={{
    //         width: "100%",
    //         maxWidth: 400,
    //         borderRadius: 10,
    //         boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    //         overflow: "hidden",
    //       }}
    //     >
    //       <div style={{ textAlign: "center", marginBottom: 20 }}>
    //         <img
    //           alt="logo"
    //           src="/byteFactory.png"
    //           style={{
    //             width: "80%",
    //             maxWidth: "150px",
    //             marginBottom: "20px",
    //           }}
    //         />
    //         <h3>Reset Password</h3>
    //         <Row gutter={[16, 16]} justify="center">
    //           <Col span={8} style={{ textAlign: "center" }}>
    //             <CheckCircleFilled
    //               style={{
    //                 color: requirements.characters ? "#6ecc3a" : "gray",
    //               }}
    //             />

    //             <div style={{ fontSize: 14, lineHeight: 1.2 }}>
    //               <span
    //                 style={{
    //                   display: "block",
    //                   fontSize: 14,
    //                   fontWeight: "bold",
    //                 }}
    //               >
    //                 6+
    //               </span>
    //               <span
    //                 style={{
    //                   fontSize: 12,
    //                 }}
    //               >
    //                 Characters
    //               </span>
    //             </div>
    //           </Col>
    //           <Col span={8} style={{ textAlign: "center" }}>
    //             <CheckCircleFilled
    //               style={{ color: requirements.uppercase ? "#6ecc3a" : "gray" }}
    //             />

    //             <div style={{ fontSize: 14, lineHeight: 1.2 }}>
    //               <span
    //                 style={{
    //                   display: "block",
    //                   fontSize: 14,
    //                   fontWeight: "bold",
    //                 }}
    //               >
    //                 AA
    //               </span>
    //               <span
    //                 style={{
    //                   fontSize: 12,
    //                 }}
    //               >
    //                 Uppercase
    //               </span>
    //             </div>
    //           </Col>
    //           <Col span={8} style={{ textAlign: "center" }}>
    //             <CheckCircleFilled
    //               style={{ color: requirements.lowercase ? "#6ecc3a" : "gray" }}
    //             />

    //             <div style={{ fontSize: 14, lineHeight: 1.2 }}>
    //               <span
    //                 style={{
    //                   display: "block",
    //                   fontSize: 14,
    //                   fontWeight: "bold",
    //                 }}
    //               >
    //                 aa
    //               </span>
    //               <span
    //                 style={{
    //                   fontSize: 12,
    //                 }}
    //               >
    //                 Lowercase
    //               </span>
    //             </div>
    //           </Col>
    //           <Col span={8} style={{ textAlign: "center" }}>
    //             <CheckCircleFilled
    //               style={{ color: requirements.number ? "#6ecc3a" : "gray" }}
    //             />
    //             <div style={{ fontSize: 14, lineHeight: 1.2 }}>
    //               <span
    //                 style={{
    //                   display: "block",
    //                   fontSize: 14,
    //                   fontWeight: "bold",
    //                 }}
    //               >
    //                 123
    //               </span>
    //               <span
    //                 style={{
    //                   fontSize: 12,
    //                 }}
    //               >
    //                 Number
    //               </span>
    //             </div>
    //           </Col>
    //           <Col span={8} style={{ textAlign: "center" }}>
    //             <CheckCircleFilled
    //               style={{ color: requirements.symbol ? "#6ecc3a" : "gray" }}
    //             />
    //             <div style={{ fontSize: 14, lineHeight: 1.2 }}>
    //               <span
    //                 style={{
    //                   display: "block",
    //                   fontSize: 14,
    //                   fontWeight: "bold",
    //                 }}
    //               >
    //                 @$#
    //               </span>
    //               <span
    //                 style={{
    //                   fontSize: 12,
    //                 }}
    //               >
    //                 Symbol
    //               </span>
    //             </div>
    //           </Col>
    //         </Row>
    //       </div>
    //       <div
    //         className="login-form"
    //         style={{
    //           display: "flex",
    //           flexDirection: "column",
    //           alignItems: "center",
    //           width: "100%",
    //           padding: "24px",
    //           backgroundColor: "#fff",
    //           borderRadius: "8px",
    //         }}
    //       >
    //         {msg && (
    //           <Text type="danger" style={{ marginBottom: "16px" }}>
    //             {msg}
    //           </Text>
    //         )}
    //         <Form
    //           name="basic"
    //           initialValues={{ remember: true }}
    //           onFinish={onFinish}
    //           autoComplete="off"
    //           layout="vertical"
    //           style={{ width: "100%" }}
    //         >
    //           <div style={{ position: "relative" }}>
    //             <Form.Item
    //               name="newPassword"
    //               rules={[
    //                 { required: true, message: "Please enter password!" },
    //                 {
    //                   validator: async (_, value) => {
    //                     return !value || level >= minLevel
    //                       ? Promise.resolve()
    //                       : Promise.reject("Password is too weak");
    //                   },
    //                   message: "Password is too weak",
    //                 },
    //               ]}
    //               hasFeedback
    //             >
    //               <Input.Password
    //                 placeholder="Enter new password"
    //                 onChange={(e) => passwordStrength(e.target.value)}
    //               />
    //             </Form.Item>
    //             <PasswordIndicator
    //               level={level}
    //               style={{ position: "relative", bottom: 0 }}
    //             />
    //           </div>
    //           <br />
    //           <Form.Item
    //             name="confirmPassword"
    //             dependencies={["newPassword"]}
    //             hasFeedback
    //             rules={[
    //               { required: true, message: "Please re-enter password!" },
    //               ({ getFieldValue }) => ({
    //                 validator(_, value) {
    //                   if (!value || getFieldValue("newPassword") === value) {
    //                     return Promise.resolve();
    //                   }
    //                   return Promise.reject(
    //                     new Error(
    //                       "The new password that you entered does not match!"
    //                     )
    //                   );
    //                 },
    //               }),
    //             ]}
    //           >
    //             <Input.Password
    //               onPaste={(e) => e.preventDefault()}
    //               visibilityToggle={false}
    //               placeholder="Re-enter password"
    //             />
    //           </Form.Item>

    //           <Form.Item>
    //             <Button
    //               block
    //               type="primary"
    //               icon={<LoginOutlined />}
    //               htmlType="submit"
    //             >
    //               Change Password and Login
    //             </Button>
    //           </Form.Item>
    //         </Form>
    //       </div>
    //     </Card>
    //   </Spin>
    // </Layout>
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
          }}
        >
          <Spin spinning={isLoading}>
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
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <img
                  alt="logo"
                  src="/byteFactory.png"
                  style={{
                    width: "80%",
                    maxWidth: "150px",
                    marginBottom: "20px",
                  }}
                />
                <h3>Change Password</h3>
                <Row gutter={[16, 16]} justify="center">
                  <Col span={8} style={{ textAlign: "center" }}>
                    <CheckCircleFilled
                      style={{
                        color: requirements.characters ? "#6ecc3a" : "gray",
                      }}
                    />

                    <div style={{ fontSize: 14, lineHeight: 1.2 }}>
                      <span
                        style={{
                          display: "block",
                          fontSize: 14,
                          fontWeight: "bold",
                        }}
                      >
                        6+
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                        }}
                      >
                        Characters
                      </span>
                    </div>
                  </Col>
                  <Col span={8} style={{ textAlign: "center" }}>
                    <CheckCircleFilled
                      style={{
                        color: requirements.uppercase ? "#6ecc3a" : "gray",
                      }}
                    />

                    <div style={{ fontSize: 14, lineHeight: 1.2 }}>
                      <span
                        style={{
                          display: "block",
                          fontSize: 14,
                          fontWeight: "bold",
                        }}
                      >
                        AA
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                        }}
                      >
                        Uppercase
                      </span>
                    </div>
                  </Col>
                  <Col span={8} style={{ textAlign: "center" }}>
                    <CheckCircleFilled
                      style={{
                        color: requirements.lowercase ? "#6ecc3a" : "gray",
                      }}
                    />

                    <div style={{ fontSize: 14, lineHeight: 1.2 }}>
                      <span
                        style={{
                          display: "block",
                          fontSize: 14,
                          fontWeight: "bold",
                        }}
                      >
                        aa
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                        }}
                      >
                        Lowercase
                      </span>
                    </div>
                  </Col>
                  <Col span={8} style={{ textAlign: "center" }}>
                    <CheckCircleFilled
                      style={{
                        color: requirements.number ? "#6ecc3a" : "gray",
                      }}
                    />
                    <div style={{ fontSize: 14, lineHeight: 1.2 }}>
                      <span
                        style={{
                          display: "block",
                          fontSize: 14,
                          fontWeight: "bold",
                        }}
                      >
                        123
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                        }}
                      >
                        Number
                      </span>
                    </div>
                  </Col>
                  <Col span={8} style={{ textAlign: "center" }}>
                    <CheckCircleFilled
                      style={{
                        color: requirements.symbol ? "#6ecc3a" : "gray",
                      }}
                    />
                    <div style={{ fontSize: 14, lineHeight: 1.2 }}>
                      <span
                        style={{
                          display: "block",
                          fontSize: 14,
                          fontWeight: "bold",
                        }}
                      >
                        @$#
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                        }}
                      >
                        Symbol
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>
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
                // }}
              >
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
                  style={{ width: "100%" }}
                >
                  <div style={{ position: "relative" }}>
                    <Form.Item
                      name="newPassword"
                      rules={[
                        { required: true, message: "Please enter password!" },
                        {
                          validator: async (_, value) => {
                            return !value || level >= minLevel
                              ? Promise.resolve()
                              : Promise.reject("Password is too weak");
                          },
                          message: "Password is too weak",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input.Password
                        placeholder="Enter new password"
                        onChange={(e) => passwordStrength(e.target.value)}
                      />
                    </Form.Item>
                    <PasswordIndicator
                      level={level}
                      style={{
                        position: "relative",
                        bottom: 0,
                      }}
                    />
                  </div>
                  <br />
                  <Form.Item
                    name="confirmPassword"
                    dependencies={["newPassword"]}
                    hasFeedback
                    rules={[
                      { required: true, message: "Please re-enter password!" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("newPassword") === value
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "The new password that you entered does not match!"
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      onPaste={(e) => e.preventDefault()}
                      visibilityToggle={false}
                      placeholder="Re-enter password"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      block
                      type="primary"
                      icon={<LoginOutlined />}
                      htmlType="submit"
                    >
                      Change Password and Login
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </Spin>
        </div>
      </div>
    </Layout>
  );
};

export default ChangePassword;
