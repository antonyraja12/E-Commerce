import { Button, DatePicker, Form, Input, Select, TreeSelect } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import OptionService from "../../services/option-service";
const { RangePicker } = DatePicker;
function Filter(props) {
  const [entities, setEntities] = useState([]);
  const [users, setUsers] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    OptionService.getEntities().then((data) => {
      setEntities(data);
    });
    OptionService.getUsers().then((data) => {
      setUsers(data);
    });

    OptionService.getAssets().then((data) => {
      setAssets(data);
    });
  }, []);
  const data = [
    {
      name: "user",
      type: "checkbox",
      filterType: "user",
      label: "Select User",
      filter: true,
    },
    {
      name: "user",
      type: "checkbox",
      filterType: "user",
      label: "Select User",
      filter: true,
    },
  ];

  const renderInput = (val) => {
    // let in
    // switch(val.toLowerCase()){
    //   case "checkbox":
    // }
  };

  return (
    <>
      <Form layout="inline">
        <Form.Item name="appHierarchy" label="Entity">
          <TreeSelect treeData={entities} style={{ minWidth: "250px" }} />
        </Form.Item>
        <Form.Item name="user" label="User">
          <Select options={users} style={{ minWidth: "250px" }} />
        </Form.Item>
        <Form.Item name="asset" label="Asset">
          <Select options={assets} style={{ minWidth: "250px" }} />
        </Form.Item>
        <Form.Item name="range" label="Date Range">
          <RangePicker />
        </Form.Item>
        <Form.Item name="from_data" label="From Date">
          <DatePicker />
        </Form.Item>
        <Form.Item name="to_data" label="To Date">
          <DatePicker />
        </Form.Item>
        <Form.Item>
          <Button icon={<SearchOutlined />} />
        </Form.Item>
      </Form>
    </>
  );
}

export default Filter;
