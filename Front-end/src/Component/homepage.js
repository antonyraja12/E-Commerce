import React, { useEffect, useState } from "react";
import { withRouter } from "../Users/prop-router";
import { Button, Card, Carousel, Col, message, Row } from "antd";
import ProductService from "../service/product-service";
import { HiOutlineShoppingBag, HiShoppingCart } from "react-icons/hi";
import { Meta } from "antd/es/list/Item";
import { Link } from "react-router-dom";
import CartService from "../service/cart-service";

function Homepage(props) {
  const [state, setState] = useState([]);
  const service = new ProductService();
  const cartService = new CartService();

  useEffect(() => {
    service
      .list()
      .then((res) => {
        setState(res.data);
      })
      .catch((err) => console.log(err, "error"));
  }, []);

  const AddCart = (id) => {
    console.log("idd", id);
    cartService
      .add({ productId: id, quantity: 5, totalPrice: 50 })
      .then((res) => {
        if (res.status == 200) {
          message.success("Product Added to cart");
        }
        message.success("Product Added to cart");
      })
      .catch((err) => {
        message.error(err);
      })
      .finally(() => {
        props.navigate("/home/cart");
      });
  };
  console.log(
    "state",
    state.map((e) => e.id)
  );
  return (
    <Row gutter={[10, 10]}>
      {state.map((e) => (
        <Col sm={6}>
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
        </Col>
      ))}
    </Row>
  );
}

export default withRouter(Homepage);
