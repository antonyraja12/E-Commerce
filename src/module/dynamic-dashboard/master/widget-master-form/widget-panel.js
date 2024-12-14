import { Collapse } from "antd";
import WidgetMasterForm from "./widget-master-form";
import WidgetCollection from "../widget-collection/widget-collection";
import FilterOption from "../../filter/filter-option";
import { useContext, useEffect, useState } from "react";
import { WidgetContext } from "../../helper/helper";
import { RightOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";

function WidgetPanel() {
  const [activeKey, setActiveKey] = useState(["i1"]); // Change to array with initial active key
  const { selected } = useContext(WidgetContext);

  const CustomCollapsePanel = ({ item }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
      <span style={{color: activeKey.includes(item.key) ? '#233E7F' : '#6C706F'}}>{item.label}</span>
      <div style={{color:"#B2B9B7",size:"14px"}}>{activeKey.includes(item.key) ? <UpOutlined /> : <DownOutlined />}</div>
    </div>
  );

  const items = [
    {
      key: "i1",
      label: "Filter Element Collections",
      children: <FilterOption />,
    },
    {
      key: "i2",
      label: "Widget Collections",
      children: <WidgetCollection />,
    },
    {
      key: "i3",
      label: "Properties",
      children: <WidgetMasterForm />,
    },
  ];

  const onChange = (keys) => { // Update to handle array of keys
    setActiveKey(keys);
  };

  useEffect(() => {
    if (selected) setActiveKey(["i3"]);
  }, [selected]);

  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderRadius: "10px",
        padding: "8px 0px"
      }}
    >
      <Collapse
        defaultActiveKey={["i2"]} // Change to array with initial active key
        activeKey={activeKey}
        size="small"
        accordion
        onChange={onChange}
        ghost
        style={{paddingLeft:"10px"}}
      >
        {items.map((item, index) => (
          <Collapse.Panel
            key={item.key}
            header={<CustomCollapsePanel item={item} />}
            showArrow={false}
          >
            {item.children}
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  );
}

export default WidgetPanel;