import logo from "./logo.svg";
import "./App.css";
import { ConfigProvider } from "antd";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <ConfigProvider>
      <AppRoutes />
    </ConfigProvider>
  );
}

export default App;
