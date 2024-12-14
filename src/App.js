import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import { Provider } from "react-redux";
import "./App.css";
import "./App.less";
import AppRoutes from "./AppRoutes";
import "./index.css";
import store from "./store/store";
import { StompSessionProvider } from "react-stomp-hooks";
import { webSocketUrl } from "./helpers/url";
import { useEffect } from "react";
import { theme } from "antd";
const { darkAlgorithm, compactAlgorithm } = theme;
function App() {
  const token = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    // const client = new Client();
    // client.brokerURL = webSocketUrl;
    // client.connectHeaders = {
    //   Authorization: `Bearer ${token ? token.token : ""}`,
    // };
    // client.activate();
    // client.subscribe(
    //   "topic/notification",
    //   (message) => {
    //     console.log(message);
    //   },
    //   client.connectHeaders
    // );
  }, []);

  return (
    <ConfigProvider
      theme={{
        components: {
          Badge: {
            statusSize: 12,
          },
        },
        token: {
          fontFamily: "Inter",
          // colorPrimary: "#172975",
          Layout: {
            siderBg: "#2e48c9",
            headerBg: "#2e48c9",
          },
          Menu: {
            darkItemBg: "#2e48c9",
            darkSubMenuItemBg: "#2941b8",
            darkItemSelectedBg: "#172975",
            itemMarginInline: 8,
          },
        },
        algorithm: [compactAlgorithm],
      }}
    >
      {/* <StompSessionProvider url={webSocketUrl}> */}
      <Provider store={store}>
        <AppRoutes />
      </Provider>
      {/* </StompSessionProvider> */}
    </ConfigProvider>
  );
}
export default App;
