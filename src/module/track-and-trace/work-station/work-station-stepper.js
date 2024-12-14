import React, { useEffect, useState } from "react";
import { Card, Col, Row, Steps } from "antd";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { withRouter } from "../../../utils/with-router";

function WorkstationStepper(props) {
  const [current, setCurrent] = useState(0);
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;
  const items = [
    {
      title: "Basic details",
      path: "basic-details",
    },
    {
      title: "Properties",
      path: "properties",
      disabled: !!!id,
    },
    {
      title: "Device",
      path: "device",
      disabled: !!!id,
    },
    {
      title: "Service",
      path: "service",
      disabled: !!!id,
    },
    {
      title: "Subscription",
      path: "subscription",
      disabled: !!!id,
    },
    {
      title: "Preview",
      path: "preview",
      disabled: !!!id,
    },
  ];

  const redirect = (index) => {
    const item = items[index];
    navigate(`${id}/${item.path}`);
  };
  const path = params["*"];
  useEffect(() => {
    for (let i in items) {
      if (path.includes(items[i].path)) {
        setCurrent(i);
        break;
      }
    }
  }, [path]);
  return (
    <>
      <Card //</>title={"Work Station"}
      >
        <Row>
          <Col lg={4}>
            <Steps
              current={current}
              direction="vertical"
              progressDot
              onChange={(c) => {
                redirect(c);
              }}
              items={items}
              type="default"
              size="small"
            />
          </Col>
          <Col lg={20}>
            <Outlet />
          </Col>
        </Row>
      </Card>
    </>
  );
}
export default withRouter(WorkstationStepper);
