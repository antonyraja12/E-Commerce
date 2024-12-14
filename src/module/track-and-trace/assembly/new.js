import React from "react";

import _, { forIn } from "lodash";

function New(params) {
  const users = [
    { id: 1, name: "Alice", age: 25 },
    { id: 2, name: "Bob", age: 35 },
    { id: 3, name: "Charlie", age: 28 },
  ];

  const items = [
    { name: "Laptop", category: "Electronics" },
    { name: "Shirt", category: "Clothing" },
    { name: "Phone", category: "Electronics" },
  ];
  const numbers = [1, 2, 3, 4, 5, 6];

  const data = [
    { id: 1, status: "inactive" },
    { id: 2, status: "active" },
    { id: 3, status: "inactive" },
  ];
  const products = [
    { name: "Product A", price: 50 },
    { name: "Product B", price: 30 },
    { name: "Product C", price: 40 },
  ];

  console.log(
    "sorting",
    // products.sort((a, b) => a.price - b.price).slice(0, 2)
    _.take(_.orderBy(products, ["price"], ["asc"]), 2)
  );

  const orders = [
    { id: 1, amount: 100, status: "completed" },
    { id: 2, amount: 200, status: "pending" },
    { id: 3, amount: 150, status: "completed" },
  ];

  const value = _.filter(orders, (sta) => sta.status === "completed").map(
    (e) => e.amount
  );

  console.log("com", _.sumBy(value));

  const cloneData = _.cloneDeep(users);
  cloneData[0].name = "Balu";
  console.log("orignal", users);
  console.log("log cloned", cloneData);

  console.log(
    "find first occurence ",
    data.find((f) => f.status == "active")
  );

  console.log("filtr", _.groupBy(items, "category"));
  console.log(
    "filtr",
    numbers.reduce((acc, num) => acc + num, 0)
  );
  console.log("num", _.sumBy(numbers));
  let numberCount = 0;
  for (let index = 0; index < numbers.length; index++) {
    if (numbers[index] % 2 == 0) {
      numberCount += numbers[index];
    }
  }
  console.log("numberCount", numberCount);

  console.log(
    "filtr",
    items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {})
  );

  //   let obj = {};

  //   for (let index = 0; index < items.length; index++) {
  //     obj[index] = items[index];
  //   }

  //   const value = items.map((val) => {
  //     let obj = {};
  //     obj[val.category] = val;
  //     return obj;
  //   });

  console.log(
    users.filter((e) => e.age > 30)?.map((v) => v.name.toLocaleUpperCase())
  );

  const result = _.chain(users)
    .filter((f) => f.age > 30)
    .map((e) => e.name.toUpperCase())
    .value();

  // const result = _.chain(users)
  //   .filter((user) => user.age > 30) // Filter users with age > 30
  //   .map((user) => user.name.toUpperCase()) // Map their names to uppercase
  //   .value(); // Extract the final value
  console.log("result", result);
  return <></>;
}

export default New;
