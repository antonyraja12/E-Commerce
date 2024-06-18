import {
  Button,
  Card,
  Col,
  Drawer,
  Dropdown,
  Form,
  Input,
  Layout,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import SideMenu from "./side-menu";
import Icon from "@ant-design/icons/lib/components/Icon";

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;
const MainLayout = (props) => {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("left");

  return (
    <>
      <Layout>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            background: "#83B4FF",
          }}
        >
          <img src="/storeLogo1.png" alt="preview" />
          <Content>
            <Row style={{ paddingTop: "2%" }} justify={"center"}>
              <Col sm={16}>
                <Form>
                  <Form.Item>
                    <Input
                      prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
                      // onInput={this.filter}
                      // value={this.state.searchValue}
                      placeholder="Search..."
                    />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Content>
          <Space>
            {" "}
            <Tooltip title={"user"}>
              <Button icon={<UserOutlined />} />
            </Tooltip>
            <Button icon={<ShoppingCartOutlined />} />
          </Space>
        </Header>

        <Content
          style={
            {
              // padding: "0 48px",
            }
          }
        >
          <div
            style={{
              padding: 24,
              minHeight: 380,
              background: "#09472",
              borderRadius: "5px",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
      <Drawer
        title="Basic Drawer"
        placement={"left"}
        onClose={() => setOpen(false)}
        open={open}
        key={placement}
      >
        <SideMenu />
      </Drawer>
    </>
  );
};

export default MainLayout;
