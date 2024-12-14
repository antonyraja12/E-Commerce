import { Button, Flex, Form } from "antd";
import { useEffect, useState } from "react";
import { getOptionFn, renderField } from "./filter-render-fn";

function FilterBuilder(props) {
  const { filters } = props;
  const [fields, setFields] = useState([]);
  const [option, setOption] = useState({});

  useEffect(() => {
    setFields(filters);
  }, [filters]);

  useEffect(() => {
    let apiMode = new Set();
    for (let x of fields) {
      if (x.filterOption?.type) apiMode.add(x.filterOption.type);
    }
    let api = [];
    for (let x of apiMode) {
      api.push(getOptionFn(x));
    }
    let opt = {};
    Promise.all(api).then((response) => {
      let i = 0;
      for (let x of apiMode) {
        opt[x] = response[i];
        ++i;
      }
      setOption(opt);
    });
  }, [fields]);
  const onFinish = (value) => {
    if (value) {
      if (value.startDate && value.startDate) {
        value.startDate = value.startDate?.startOf("D").toISOString();
        value.endDate = value.endDate?.endOf("D").toISOString();
      }
    }
    // console.log("value", value);
    props.onFinish(value);
  };
  return (
    <Form layout="vertical" onFinish={onFinish} size="small">
      <Flex gap={10} align="baseline">
        {fields?.map((e) => renderField(e, option))}
        <Form.Item label=" ">
          <Button htmlType="submit" type="primary">
            Go
          </Button>
        </Form.Item>
      </Flex>
    </Form>
  );
}

export default FilterBuilder;
