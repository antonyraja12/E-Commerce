import React, { useEffect, useState } from "react";
import { withRouter } from "../../../utils/with-router";
import CurrentUserService from "../../../services/user-list-current-user-service";
import OverviewCard from "./user-overview";
import { response } from "msw";
import Page from "../../../utils/page/page";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Tabs,
} from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { withForm } from "../../../utils/with-form";

const service = new CurrentUserService();

function UserProfile() {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    service.getUser().then((response) => {
      setUserData(response.data);
    });
  }, []);

  const onFinish = (val) => {
    console.log("val", val);
  };
  const items = [
    {
      key: "1",
      label: "Overview",
      children: <OverviewCard />,
    },
  ];

  return (
    <Page>
      <Row gutter={20} style={{ padding: "10px" }}>
        <Col span={6}>
          <Avatar
            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
            icon={<UserOutlined />}
          />
          <h1 style={{ marginBottom: "0px" }}>{userData.userName}</h1>
          <h4>{userData.role?.roleName}</h4>
        </Col>
        <Col span={18}>
          <OverviewCard />
        </Col>
      </Row>
    </Page>
  );
}

export default withRouter(withForm(UserProfile));
