import { Breadcrumb, Image, Layout, theme } from "antd";
import { useContext, useState, createContext, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import DynamicBreadcrumb from "./dynamic-breadcrumb";
import TatHeader from "./tat-header";
import {
  FileDoneOutlined,
  DashboardOutlined,
  FileSearchOutlined,
  MonitorOutlined,
  ScanOutlined,
  SettingOutlined,
  ReconciliationOutlined,
  FieldTimeOutlined,
  UnlockOutlined,
  TeamOutlined,
  KeyOutlined,
  UserOutlined,
  SlidersOutlined,
  ApiOutlined,
  DeploymentUnitOutlined,
  ClusterOutlined,
} from "@ant-design/icons";
import MainMenu from "./main-menu";
import User from "../configurations/user/user";
import LoginService from "../../services/login-service";
import { PrintOutlined, ReportOutlined } from "@material-ui/icons";
import { LiaToolsSolid } from "react-icons/lia";
import { BiSolidUserAccount, BiSolidUserDetail } from "react-icons/bi";
import { MdReport } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";

const { Header, Sider, Content, Footer } = Layout;

export const MenuItemContext = createContext([
  {
    key: "/tat/dashboard",
    label: "Dashboard",
    icon: <DashboardOutlined />,
  },
  {
    key: "/tat/operator/andon",
    label: "Andon",
    icon: <MonitorOutlined />,
  },
  {
    key: "/tat/configuration/shift",
    label: "User Management",
    icon: <BiSolidUserAccount />,
    children: [
      {
        key: "/user/user",
        label: "User",
        icon: <UserOutlined />,
      },
      {
        key: "/tat/role",
        label: "Role",
        icon: <KeyOutlined />,
      },
      {
        key: "/tat/user-group",
        label: "User Group",
        icon: <TeamOutlined />,
      },
      {
        key: "/tat/user-access",
        label: "User Access",
        icon: <UnlockOutlined />,
      },
    ],
  },

  {
    key: "/tat/configuration",
    label: "Prerequisites",
    icon: <FileDoneOutlined />,
    children: [
      {
        key: "/tat/configuration/device-type",
        label: "Device Type",
      },
      {
        key: "/tat/configuration/device",
        label: "Device Master",
      },
      {
        key: "/tat/configuration/line-master",
        label: "Line Master",
      },
      {
        key: "/tat/configuration/work-station",
        label: "Work Station Master",
      },
      {
        key: "/tat/configuration/product",
        label: "Product",
        children: [
          { key: "/tat/configuration/model", label: "Model" },

          { key: "/tat/configuration/category", label: "Category" },
          {
            key: "/tat/configuration/variant",
            label: "Variant",
          },
          { key: "/tat/configuration/product", label: "Product Master" },
        ],
      },

      {
        key: "/tat/configuration/work-instruction",
        label: "Work Instruction Master",
      },

      {
        key: "/tat/configuration/defect-checklist",
        label: "Defect Checklist",
      },

      {
        key: "/tat/configuration/shift",
        label: "Shift",
        children: [
          {
            key: "/tat/configuration/shift",
            label: "Shift Master",
          },

          {
            key: "/tat/configuration/shift/configuration",
            label: "Shift Configuration",
          },
          {
            key: "/tat/configuration/shift/allocation",
            label: "Shift Allocation",
          },
        ],
      },
    ],
  },

  {
    key: "/tat/job-order",
    label: "Operation Control",
    icon: <LiaToolsSolid />,
    children: [
      {
        key: "/tat/job-order",
        label: "Job Order",
        icon: <DeploymentUnitOutlined />,
      },
      {
        key: "/tat/assembly",
        label: "Assembly",
        icon: <ClusterOutlined />,
      },
      {
        key: "/tat/bypass",
        label: "Bypass",
        icon: <ScanOutlined />,
      },
      {
        key: "/tat/shift-setting",
        label: "Shift Settings",
        icon: <SettingOutlined />,
      },
      {
        key: "/tat/shift-wise-parts",
        label: "Part Count ",
        icon: <ReconciliationOutlined />,
      },
      {
        key: "/tat/reprint",
        label: "Reprint",
        icon: <PrintOutlined />,
      },
      {
        key: "/tat/delay",
        label: "Work Delay",
        icon: <FieldTimeOutlined />,
      },
    ],
  },
  {
    key: "tat/report",
    label: "Report",
    icon: <VscGraph />,
    children: [
      {
        key: "/tat/traceability",
        label: "Traceability",
        icon: <FileSearchOutlined />,
      },
    ],
  },
]);
export const ContainerContext = createContext();
function Container() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [userDetails, setUserDetails] = useState(null);

  const [collapse, setCollapse] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fetchUserDetails = async () => {
    const loginService = new LoginService();
    try {
      const response = await loginService.getUserDetails();
      setUserDetails(response.data);
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };
  return (
    <ContainerContext.Provider value={{ collapse, setCollapse }}>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          breakpoint="lg"
          onBreakpoint={(broken) => {
            setCollapse(broken);
          }}
          onCollapse={(collapsed, type) => {}}
          theme="dark"
          width={220}
          collapsed={collapse}
          style={{
            position: "sticky",
            height: "100vh",
            top: 0,
            left: 0,
            overflow: "auto",
            // backgroundColor: primary,
            // backgroundColor: "#233e7f",
            zIndex: 5,
            width: "100%",
          }}
        >
          <Header style={{ padding: 10, boxShadow: "none" }}>
            {!collapse && (
              <div
                className="demo-logo-vertical"
                style={{
                  //   background: "#132c44",
                  lineHeight: 0,
                  padding: 8,
                  borderRadius: 10,
                  width: "100%",
                  height: "100%",
                }}
              >
                <img
                  src="/byteFactory.png"
                  preview={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}
          </Header>
          <MainMenu mode="inline" />
        </Sider>
        <Layout>
          <TatHeader />
          <Content
            style={{
              margin: "24px 16px 0",
            }}
          >
            <Outlet
              style={{ width: "100%" }}
              context={{ isFullscreen, toggleFullscreen }}
            />
          </Content>
        </Layout>
      </Layout>
    </ContainerContext.Provider>
  );
}

export default Container;
