import { EllipsisOutlined, FullscreenOutlined, MoreOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Dropdown,
  Modal,
  Space,
  Tooltip,
  Typography,
  message,
} from "antd";
import { WidgetContext, getData } from "../helper/helper";
import {
  BarChartWidget,
  CardWidget,
  GaugeWidget,
  GraphWidget,
  TableWidget,
} from "../widgets";
import { ChartWidget } from "../widgets/chart-widget";
import PropertyBuilder from "./property-builder";
import SeriesBuilder from "./series-builder";
import { useContext, useEffect, useState } from "react";
import WidgetMasterService from "../../../services/dynamic-dashboard/widget-master-service";
export const renderWidgetFn = (e, data, editable = false) => {
  let renderData;
  let key = e.key;
  let propertyKey = e.propertyKey;
  let properties;

  switch (e.widgetType?.toLowerCase()) {
    case "card":
      properties = { title: e.title };
      if (data && propertyKey) properties.value = getData(data, propertyKey);
      renderData = (
        <CardWidget
          key={key}
          properties={properties}
          style={{
            backgroundColor: e.cardProperty?.backgroundColor ?? "#ffffff",
            color: e.cardProperty?.fontColor ?? "#333333",
          }}
        />
      );
      break;

    case "gauge":
      properties = e.gaugeProperty;
      if (data && propertyKey) properties.value = getData(data, propertyKey);
      renderData = <GaugeWidget key={key} properties={properties} />;
      break;
    case "graph":
      properties = {
        series: e.graphProperties?.map((el) => ({
          name: el.name,
          type: el.type,
          data:
            data && propertyKey
              ? getData(data, propertyKey)?.map((ele) => ({
                  x: getData(ele, el["xaxis"]),
                  y: getData(ele, el["yaxis"]),
                }))
              : [],
        })),
      };

      // if (data) properties.series = data[properties.key];
      renderData = <GraphWidget key={key} {...e} properties={properties} />;
      break;
    case "piechart":
    case "donutchart":
    case "polarareachart":
    case "chart":
      properties = PropertyBuilder.chart(e, data, propertyKey);
      renderData = <ChartWidget key={key} {...e} properties={properties} />;
      break;
    case "table":
      properties = {
        ...e.tableProperty,
        dataSource: data && propertyKey ? getData(data, propertyKey) : [],
        size: "small",
        scroll: { y: e.height - 120 + "px" },
        sorter: e.sorting,
      };

      renderData = <TableWidget key={key} {...e} properties={properties} />;
      break;
    case "areachart":
    case "linechart":
    case "radarchart":
    case "barchart":
      properties = PropertyBuilder.graph(e, data, propertyKey);
      let series = SeriesBuilder.graph(e, data, propertyKey);
      renderData = <BarChartWidget series={series} properties={properties} />;
      break;
    default:
      // properties = e.properties;
      renderData = <CardWidget key={key} />;
      break;
  }
  return renderData;
};

export function Widget(props) {
  const { e, data } = props;
  return <Container {...e}>{renderWidgetFn(e, data)}</Container>;
}

export function EditableWidget(props) {
  const { e, data } = props;
  const [loading, setLoading] = useState(false);
  const { selected, setSelected, setWidgets } = useContext(WidgetContext);
  const items = [
    {
      key: "delete",
      label: "Delete",
    },
  ];
  const handleMenuClick = (el) => {
    if (el.key === "delete") {
      Modal.confirm({
        title: "Delete",
        content: "Are you sure to delete this widget ?",
        onOk: () => deleteWidget(e.widgetId),
        okText: "Yes",
        cancelText: "No",
      });
    }
  };

  const deleteWidget = (id) => {
    const service = new WidgetMasterService();
    setLoading(true);
    service
      .delete(id)
      .then(({ data }) => {
        setWidgets((state) => {
          let list = [...state];
          let index = list.findIndex((e) => e.widgetId === id);
          list.splice(index, 1);
          return list;
        });
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onSelect = (el) => {
    // setSelected(e.widgetId)
    if (el.target.checked === true) setSelected(e.widgetId);
    else setSelected(null);

  };

  const onChange = (value) => {
    onTitleUpdate(value);
  };
  const onTitleUpdate = (value) => {
    const service = new WidgetMasterService();
    service.patch({ title: value }, e.widgetId).then(({ data }) => {
      setWidgets((state) => {
        let list = [...state];
        let index = list.findIndex((e) => e.widgetId === data.widgetId);
        list[index] = data;
        return list;
      });
    });
  };
  const title = (
    <Typography.Text
      style={{ color: "inherit" }}
      editable={{
        onChange: onChange,
        text: e.title,
        autoSize: true,
      }}
    >
      {e.title}
    </Typography.Text>
  );
  return (
    <Card
      loading={loading}
      size="small"
      title={
        <Space style={{padding:"5px"}}>
          <Checkbox checked={selected === e.widgetId} onChange={onSelect} />
          <Typography.Text>{e.widgetType}</Typography.Text>
        </Space>
      }
      className={`widget ${selected === e.widgetId ? "selected" : ""}`}
      styles={{
        body: { borderRadius: 0, padding: 0 },
        header: {
          backgroundColor: "rgba(250, 250, 250, 1)",
          borderRadius: 0,
          minHeight: "auto",
          padding: "0px 5px",
          marginTop: 0,
          borderTopLeftRadius:"10px",
          borderTopRightRadius:"10px",
        },
        overflow:"hidden",
        borderRadius: "10px",
      }}
      extra={
        <>
          <Dropdown
            menu={{
              items,
              onClick: handleMenuClick,
            }}
          >
            <Button size="small" type="text" icon={<EllipsisOutlined />} />
          </Dropdown>
        </>
      }
    >
      <Container {...e} title={title}>
        {renderWidgetFn(
          {
            ...e,
            title: title,
          },
          data
        )}
      </Container>
    </Card>
  );
}

function Container({ widgetType, title, height, children }) {
  if (["card"].some((str) => str === widgetType?.toLowerCase())) {
    return children;
  }

  return (
    <Card
      size="small"
      title={title}
      styles={{
        body: {
          height: height,
          overflow: "auto",
        },
        header: {
          position: "relative",
        },
      }}
    >
      {children}
    </Card>
  );
}