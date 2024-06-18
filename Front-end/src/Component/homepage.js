import React, { useEffect, useState } from "react";
import { withRouter } from "../Users/prop-router";
import { Button, Card, Carousel, Col, Row } from "antd";
import ProductService from "../service/product-service";
import { HiOutlineShoppingBag, HiShoppingCart } from "react-icons/hi";
import { Meta } from "antd/es/list/Item";
import { Link } from "react-router-dom";

function Homepage() {
  const [state, setState] = useState([]);
  const service = new ProductService();

  useEffect(() => {
    service
      .list()
      .then((res) => {
        setState(res.data);
      })
      .catch((err) => console.log(err, "error"));
  }, []);

  const AddCart = (id) => {};
  console.log(
    "state",
    state.map((e) => e.id)
  );
  return (
    <Row gutter={[10, 10]}>
      {state.map((e) => (
        <Col sm={6}>
          <Link to={e.id}>
            <Card
              cover={
                <img
                  src="/storeLogo.png"
                  style={{ width: "100%", objectFit: "cover" }}
                />
              }
              actions={[
                <Button icon={<HiOutlineShoppingBag />}>Buy Now</Button>,
                <Button
                  onClick={() => {
                    AddCart(e.id);
                  }}
                  icon={<HiShoppingCart />}
                >
                  {" "}
                  Add to Cart
                </Button>,
              ]}
            >
              <Meta title={e.name} description={e.description} />
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
}

export default withRouter(Homepage);
