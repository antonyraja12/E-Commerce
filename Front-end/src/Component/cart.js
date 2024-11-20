import React, { useEffect, useState } from "react";
import CartService from "../service/cart-service";

const Cart = (props) => {
  const service = new CartService();

  const [data, setData] = useState([]);

  useEffect(() => {
    service.list().then((res) => {
      console.log("res", res);

      setData(res.data);
    });
  }, []);

  return <>Helllo</>;
};
export default Cart;
