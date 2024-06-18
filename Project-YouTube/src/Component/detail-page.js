import React, { useEffect, useState } from "react";
import { withRouter } from "../Users/prop-router";
import ProductService from "../service/product-service";
import { Button, Col, Row, Typography } from "antd";
import { HiShoppingBag } from "react-icons/hi";

function ProductDetailsPage(props) {
  console.log("props", props);
  const service = new ProductService();
  const [state, setState] = useState([]);
  useEffect(() => {
    service
      .retrieve(props.params.id)
      .then((res) => {
        setState(res.data);
      })
      .catch((err) => console.log("catch error", err));
  }, [props.params.id]);
  console.log("state", state);
  return (
    <>
      {" "}
      <Row>
        <Col sm={8}>
          {" "}
          <img
            width={"100%"}
            height={"550px"}
            src="/storeLogo.png" //
            alt="no preview"
          />
        </Col>
        <Col sm={16}>
          <Typography.Title level={4}>{state.name}</Typography.Title>
          <Typography.Title level={5}>Category :{state.name}</Typography.Title>
          <Typography.Text>{state.description}</Typography.Text>
          <Typography.Title level={4}>
            {" "}
            Price :{state.price} Rs.
          </Typography.Title>

          <Button size="large" type="primary" icon={<HiShoppingBag />}>
            {" "}
            Buy Now
          </Button>
        </Col>
      </Row>
    </>
  );
}
export default withRouter(ProductDetailsPage);
