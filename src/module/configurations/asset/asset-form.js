import { Col, Row, Steps } from "antd";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import AssetService from "../../../services/asset-service";
import Page from "../../../utils/page/page";

function AssetForm(props) {
  const [current, setCurrent] = useState(0);
  const [assetCategory, setAssetCategory] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const { assetId } = params;
  const assetService = new AssetService();
  useEffect(() => {
    if (assetId) {
      assetService.retrieve(assetId).then(({ data }) => {
        setAssetCategory(data.assetCategory);
      });
    }
  }, [assetId]);

  const items1 = [
    {
      // status: "finish",
      title: "General Information",
      path: "basic-details",
    },
    // assetCategory === 1 && {
    //   // status: "finish",
    //   title: "OEE Manual",
    //   path: "oee-manual",
    //   disabled: !!!assetId,
    // },
    {
      // status: "finish",
      title: "Parameters",
      path: "parameters",
      disabled: !!!assetId,
    },
    {
      // status: "process",
      title: "Alerts",
      path: "alerts",
      disabled: !!!assetId,
    },
    {
      title: "Gateway Integration",
      path: "gateway-integration",
      disabled: !!!assetId,
    },
    {
      // status: "process",
      title: "Service",
      path: "service",
      disabled: !!!assetId,
    },
    {
      title: "Subscription",
      path: "subscription",
      disabled: !!!assetId,
    },
    {
      title: "Preview",
      path: "preview",
      disabled: !!!assetId,
    },
  ];
  if (assetCategory === 1) {
    items1.splice(1, 0, {
      title: "OEE Manual",
      path: "oee-manual",
      disabled: !!!assetId,
    });
  }
  const redirect = (index) => {
    const item = items1[index];
    navigate(`${assetId}/${item.path}`);
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
  return (
    <Page title="Asset">
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
      </Row>
    </Page>
  );
}

export default AssetForm;
