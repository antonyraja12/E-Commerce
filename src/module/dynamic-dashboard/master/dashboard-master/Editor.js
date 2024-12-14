import { Card, Col, Row } from "antd";
import { EditableWidget } from "../../render-widget/render-widget-fn";
import WidgetMasterService from "../../../../services/dynamic-dashboard/widget-master-service";
import { useContext } from "react";
import { WidgetContext } from "../../helper/helper";
function Editor(props) {
  const { widgets, setWidgets, setSelected } = useContext(WidgetContext);
  const onDragStart = (ele, widgetId) => {
    ele.dataTransfer.setData("text/plain", "");
    ele.dataTransfer.setData("sortingWidget", widgetId);
    return true;
  };
  const reOrder = (id, orderNo) => {
    const service = new WidgetMasterService();
    service.rearrange(id, orderNo).then(({ data }) => {
      setWidgets(
        data.widgets?.sort((a, b) => Number(a.orderNo) - Number(b.orderNo))
      );
    });
  };
  const onDrop = (el, i) => {
    let widgetId = el.dataTransfer.getData("sortingWidget");
    if (widgetId) {
      reOrder(widgetId, i);
    }
  };
  return (
    <Row gutter={[10, 10]}>
      {widgets?.map((e, i) => (
        <Col span={e.col} key={`widget_${e.widgetId}`}>
          <div
            onDoubleClick={() => {
              setSelected(e.widgetId);
            }}
            draggable
            onDragEnter={(e) => {
              e.preventDefault();
            }}
            onDragLeave={(e) => {}}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDragStart={(el) => onDragStart(el, e.widgetId)}
            onDrop={(el) => onDrop(el, i)}
          >
            <EditableWidget e={e} />
          </div>
        </Col>
      ))}
    </Row>
  );
}

export default Editor;
