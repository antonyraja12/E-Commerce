import {
  CloseOutlined,
  MessageOutlined,
  MoreOutlined,
  SendOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  List,
  Menu,
  Modal,
  Row,
  message,
} from "antd";
import { useEffect, useRef, useState } from "react";
import LoginService from "../../services/login-service";
// import Draggable from "react-draggable";

const chatButton = {
  backgroundColor: "white",
  whiteSpace: "break-spaces",
  fontSize: "8px",
  height: "40px",
  textAlign: "center",
  borderRadius: "30px",
  border: "0.6px solid #1565C0",
  color: "#1565C0",
};

function AdamChatBot({ showChatbot, onCloseChatbot }) {
  const [modelOpen, setModelOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showOtherButtons, setShowOtherButtons] = useState(true);
  const [iframe, setIframe] = useState(false);
  // const [showChatbot, setShowChatbot] = useState(true);

  const [activeButtonIndex, setActiveButtonIndex] = useState(null);

  const [inputValue, setInputValue] = useState(" ");
  const [position, setPosition] = useState({ right: 20, bottom: 20 });

  const imgRef = useRef(null);
  const messageListRef = useRef(null);

  const auth = new LoginService();
  const getUserName = () => {
    return auth.getUserName();
  };

  const handleModel = () => {
    setModelOpen(true);
  };

  // const handleCancel = () => {
  //   setModelOpen(false);
  // };
  const handleCancel = () => {
    setModelOpen(false);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;
    const newMessage = { text: inputValue, sender: "You" };
    setMessages([...messages, newMessage]);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: "Message received!",
        isAutoReply: true,
        sender: "ADAM",
      },
    ]);
    setInputValue("");
    scrollToBottom();
  };
  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleClearChat = () => {
    setMessages([]);
    setShowOtherButtons(true);
    // message.success("Chat cleared successfully");
  };
  const handleMenuClick = ({ key }) => {
    if (key === "clear") {
      handleClearChat();
    }
  };

  const handleDrag = (e) => {
    if (e.clientX === 0 && e.clientY === 0) return;
    const newRight =
      window.innerWidth - e.clientX > 1069
        ? 1069 - 30
        : window.innerWidth - e.clientX - 30;
    console.log(window.innerWidth - e.clientX, "width");
    const newBottom = window.innerHeight - e.clientY - 30;
    setPosition({ right: newRight });
    // onStop();
  };

  const buttons = [
    "What is the Quality of Amanda punching machine?",
    "What is the Quality of Amanda punching machine?",
    "What is the Quality of Amanda punching machine?",
    "What is the Quality of Amanda punching machine?",
  ];

  const handleButtonClick = (index) => {
    const fixedMessageText = "What is the Quality of Amanda punching machine?";
    // setInputValue(fixedMessageText);
    const newMessage = {
      text: fixedMessageText,
      isAutoReply: true,
      sender: "ADAM",
    };
    setMessages([...messages, newMessage]);
    setActiveButtonIndex(index);
    setShowOtherButtons(false);
    setIframe(true);
  };
  const menu = <Menu onClick={handleMenuClick}></Menu>;
  const title = (
    <div
      style={{
        background: "linear-gradient(#2248A4,#0F55FF)",
        display: "flex",
        color: "#fff",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        borderRadius: "7px 7px 0px 0px",
      }}
    >
      <div style={{ display: "flex" }}>
        <img
          src="/Adam Logo 1.svg"
          width="27px"
          height="auto"
          alt="Adam logo"
        />
        <span style={{ paddingLeft: "0.5em" }}>ADAM</span>
      </div>
      <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
        <span style={{ paddingRight: "1.5em" }}>
          <MoreOutlined />
        </span>
      </Dropdown>
    </div>
  );

  return (
    <>
      <div
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          cursor: "pointer",

          zIndex: 99,
        }}
        className="handle"
      >
        {showChatbot && !modelOpen && (
          <div style={{ position: "relative" }}>
            <img
              ref={imgRef}
              src="/chatbot logo.png"
              width="60px"
              height="60px"
              alt="message icon"
              onClick={handleModel}
              draggable="false"
              style={{ display: "block" }}
            />

            <CloseOutlined
              style={{
                position: "absolute",
                top: "-10px",
                right: "-10px",
                fontSize: "16px",
                color: "#000",
                cursor: "pointer",
                backgroundColor: "#fff",
                borderRadius: "50%",
              }}
              onClick={onCloseChatbot}
            />
          </div>
        )}
      </div>
      {/* </Draggable> */}
      <Modal
        className="adam-modal"
        title={title}
        open={modelOpen}
        onCancel={handleCancel}
        onOk={handleCancel}
        style={{
          position: "fixed",
          right: `${position.right}px`,
          bottom: `${position.bottom}px`,
        }}
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              // padding: "1rem",
              visibility: "hidden",
            }}
          >
            <Input
              placeholder="Send message"
              disabled
              style={{ flex: 1, marginRight: "10px", borderRadius: "20px" }}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              onPressEnter={handleSendMessage}
              suffix={
                <Button
                  type="primary"
                  onClick={handleSendMessage}
                  //   shape="round"
                  style={{ borderRadius: "50%" }}
                  icon={
                    <SendOutlined style={{ transform: "rotate(310deg)" }} />
                  }
                />
              }
            />{" "}
          </div>
        }
        closeIcon={
          <div style={{ color: "white", marginTop: "0.15em" }}>
            <CloseOutlined />
          </div>
        }
        width={325}
      >
        <div
          style={{
            height: 400,
            overflowY: "auto",
            marginBottom: "10px",
            overscrollBehavior: "auto",
            scrollbarWidth: "thin", // Set the width of the scrollbar
            scrollbarColor: "rgba(0, 0, 0, 0) transparent", // Set the color of the scrollbar
          }}
          ref={messageListRef}
        >
          <div style={{ padding: "1em 1em 0 2em" }}>
            <div>
              Hello,<h3> {getUserName()} 👋</h3>
            </div>
          </div>

          <Row style={{}}>
            <iframe
              title="ADAM"
              style={{
                border: "none",
              }}
              width={320}
              height={450}
              src="
https://app.powerbi.com/reportEmbed?reportId=004a0152-c660-4a28-8f84-2d07459169f2&autoAuth=true&ctid=cdbb4300-add1-4a07-ab31-8cd6fc0fb3c2"
              frameborder="0"
              allowFullScreen="true"
            ></iframe>
          </Row>
        </div>
      </Modal>
    </>
  );
}
export default AdamChatBot;
