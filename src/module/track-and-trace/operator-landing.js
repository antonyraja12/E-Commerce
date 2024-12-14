import { ConfigProvider, Flex, Layout, Space, theme } from "antd";
import dayjs from "dayjs";
import { createContext, useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import WorkStationService from "../../services/track-and-trace-service/work-station-service";
import "./operator.css";
const { Header, Sider, Content, Footer } = Layout;
const { defaultAlgorithm, compactAlgorithm, darkAlgorithm } = theme;
export const ContainerContext = createContext();

const RecordingSign = () => {
  return (
    <div className="recording-container">
      <div className="recording-circle"></div>
      <span className="recording-text">Live</span>
    </div>
  );
};

function OperatorLanding() {
  const [time, setTime] = useState(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [collapse, setCollapse] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [workStation, setWorkStation] = useState(null);
  const [title, setTitle] = useState("");
  useState(() => {
    let interval = setInterval(() => {
      setTime(dayjs().format("DD-MM-YYYY | hh:mm:ss A"));
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const { id } = useParams();
  useEffect(() => {
    fetchWorkStation();
  }, [id]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const fetchWorkStation = async () => {
    const service = new WorkStationService();
    if (id) {
      const response = await service.retrieve(id);
      if (response?.data) {
        setWorkStation(response.data);
      }
    }
  };
  // darkAlgorithm
  return (
    <ConfigProvider
      theme={{
        algorithm: [defaultAlgorithm, darkAlgorithm],
        components: {
          Badge: {
            statusSize: 10,
            textFontSize: 8,
            textFontSizeSM: 8,
          },
          Radio: {
            buttonBg: "#c4c4c4",
            buttonSolidCheckedBg: "#ffffff",
            buttonColor: "#333333",
            buttonSolidCheckedColor: "#000000",
            buttonSolidCheckedActiveBg: "#ffffff",
            buttonSolidCheckedHoverBg: "#ffffff",
          },
          Modal: {
            contentBg: "#292A51",
            footerBg: "#292A51",
            headerBg: "#292A51",
          },
        },
        token: {
          // fontSize: 16,
          colorBgElevated: "#1C1E44",
          colorBgContainer: "#1C1E44",
          colorBgLayout: "#292A51",
          // colorPrimary: "#03DAC6",

          Layout: {
            headerBg: "#1C1E44",
            headerPadding: 0,
          },
          colorErrorBg: "#ff4d4f",
          Badge: {
            fontSize: 12,
          },
        },
      }}
    >
      <ContainerContext.Provider value={{ collapse, setCollapse }}>
        <Layout style={{ minHeight: "100vh" }}>
          <Header>
            <Flex
              gap={10}
              align="center"
              style={{
                height: "100%",
              }}
            >
              <div className="opr-logo">
                <img
                  src="/byteFactory.png"
                  style={{ maxWidth: 150, objectFit: "contain" }}
                />
              </div>
              <div>
                <span className="station-detail">{title}</span>
              </div>
              <div className="right-block">
                <Space split="|" size="middle">
                  <span className="clock">{time}</span>
                  <span>***** *****</span>
                  <RecordingSign />
                </Space>
              </div>
              <div className="opr-logo">
                <img src="/TM_LOGO.png" />
              </div>
            </Flex>
          </Header>
          <Content>
            <Outlet
              style={{ width: "100%", overflow: "hidden" }}
              context={{ isFullscreen, toggleFullscreen, title, setTitle }}
            />
          </Content>
        </Layout>
      </ContainerContext.Provider>
    </ConfigProvider>
  );
}

export default OperatorLanding;
