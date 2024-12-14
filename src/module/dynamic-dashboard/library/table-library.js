import { Table } from "antd";
import { useEffect, useState } from "react";

export function TableLibrary(props) {
  const [_column, setColumn] = useState([]);
  const {
    loading,
    dataSource,
    bordered,
    pagination,
    showHeader,
    size,
    sticky,
    tableLayout,
    scroll,
    columns,
  } = props;

  useEffect(() => {
    setColumn(
      columns?.map((e) => {
        let obj = { ...e };
        let key = e.dataIndex;
        if (e.sorting) {
          obj.sorter = (a, b) => {
            let type = typeof a[key];
            let val;
            switch (type) {
              case "string":
                val = a[key]?.localeCompare(b[key]);
                break;
              default:
                val = a[key] - b[key];
                break;
            }
            return val;
          };
        }
        if (e.filter) {
          obj.onFilter = (value, record) => record.name.indexOf(value) === 0;
          obj.filterSearch = true;
        }
        delete obj.render;
        if (e.render) {
          obj.render = new Function("text", "record", "index", e.render);
        }

        return obj;
      })
    );
  }, [columns]);
  return (
    <Table
      columns={_column}
      dataSource={dataSource}
      loading={loading}
      bordered={bordered}
      pagination={pagination}
      showHeader={showHeader}
      size={size}
      sticky={sticky}
      tableLayout={tableLayout}
      scroll={scroll}
    />
  );
}
