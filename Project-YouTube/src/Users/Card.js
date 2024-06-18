import { Card, Col, Layout, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import React from "react";

function CardPage(props) {
  const { title, filter, action, hideFilter } = props;
  return (
    <>
      <Layout>
        <Content>
          <Row
            justify={"center"}
            style={{ paddingTop: "5%", background: "white" }}
          >
            <Col span={8}>
              <Card title={props.title ? props.title : null} extra={action}>
                {props.filter && (
                  <div style={{ marginBottom: "10px" }}>{props.filter}</div>
                )}
                {props.children}
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
}
export default CardPage;
