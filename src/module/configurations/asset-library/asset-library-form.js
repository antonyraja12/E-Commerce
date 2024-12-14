import { Button, Col, Row, Space, Steps } from "antd";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import Page from "../../../utils/page/page";

const { Step } = Steps;

function AssetLibraryForm(props) {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const params = useParams();
  const { assetLibraryId } = params;
  const items1 = [
    {
      // status: "finish",
      title: "General Information",
      path: "basic-details",
    },
    {
      // status: "finish",
      title: "Parameters",
      path: "parameters",
      disabled: !!!assetLibraryId,
    },
    {
      // status: "process",
      title: "Alerts",
      path: "alerts",
      disabled: !!!assetLibraryId,
    },
    {
      title: "Service",
      path: "service",
      disabled: !!!assetLibraryId,
    },
    {
      title: "Subscription",
      path: "subscription",
      disabled: !!!assetLibraryId,
    },

    {
      title: "Preview",
      path: "preview",
      disabled: !!!assetLibraryId,
    },
  ];

  const redirect = (index) => {
    const item = items1[index];
    navigate(`${assetLibraryId}/${item.path}`);
  };
  const path = params["*"];
  useEffect(() => {
    for (let i in items1) {
      if (path.includes(items1[i].path)) {
        setCurrent(i);
        break;
      }
    }
  }, [path]);

  const buttonLabel = () => {
    return current > 2 ? (
      <Link to="/settings/asset-library">
        <Button type="primary">Finish</Button>
      </Link>
    ) : (
      <Button type="primary">Next</Button>
    );
  };
  return (
    <Page title="Asset Library">
      <Row>
        <Col lg={4}>
          <Steps
            size="small"
            current={current}
            items={items1}
            onChange={(c) => {
              redirect(c);
            }}
            direction="vertical"
            type="default"
            progressDot
          />
        </Col>
        <Col lg={20}>
          <Outlet></Outlet>
        </Col>
        <Space></Space>
      </Row>
      <br></br>
      <Row></Row>
    </Page>
  );
}

export default AssetLibraryForm;
