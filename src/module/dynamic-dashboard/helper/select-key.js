import { Divider, Modal, Tree, Typography } from "antd";
import { useEffect, useState } from "react";

function SelectKey(props) {
  const { data, open, onClose, onOk } = props;
  const [list, setList] = useState("");
  const [selectedKey, setSelectedKey] = useState([]);

  const buildTree = (data, key = "", prefix = "") => {
    let type = typeof data;
    let obj;
    let pre;
    if (!prefix) pre = key;
    else pre = prefix + "." + key;
    switch (type) {
      case "object":
        let children = [];

        for (let x in data) {
          children.push(buildTree(data[x], x, pre));
        }
        obj = {
          key: pre,
          title: (
            <>
              {key}{" "}
              {/* : <Typography.Text type="success">{data}</Typography.Text>{" "} */}
              <Typography.Text
                type="secondary"
                italic
                style={{ fontSize: "10px" }}
              >
                {type?.toUpperCase()}
              </Typography.Text>
            </>
          ),
          children: children,
        };

        break;

      default:
        obj = {
          key: pre,
          title: (
            <>
              {key} : <Typography.Text type="success">{data}</Typography.Text>{" "}
              <Typography.Text
                type="secondary"
                italic
                style={{ fontSize: "10px" }}
              >
                {type?.toUpperCase()}
              </Typography.Text>
            </>
          ),
          //   children: [],
        };

        break;
    }
    return obj;
  };

  useEffect(() => {
    setList(buildTree(data, ""));
  }, [data]);

  return (
    <>
      <Modal
        open={open}
        title="Select Key"
        okButtonProps={{ disabled: selectedKey.length !== 1 }}
        onCancel={() => onClose()}
        onOk={() => onOk(selectedKey[0])}
        destroyOnClose
      >
        <Tree
          onSelect={(selectedKeys) => {
            setSelectedKey(selectedKeys);
          }}
          showLine
          treeData={list?.children}
        />
        <Divider />
        <div
          style={{
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Selected : {selectedKey.length === 1 ? selectedKey[0] : ""}
        </div>
      </Modal>
    </>
  );
}

export default SelectKey;
