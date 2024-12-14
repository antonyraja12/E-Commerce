import { Avatar } from "antd";
import { widgetTypeOption } from "../../helper/helper";

function WidgetCollection() {
  const handleMouseOver = (e) => {
    const listItem = e.currentTarget; // Target the <li> element
    listItem.style.backgroundColor = "rgba(250, 250, 250, 1)";
  };

  const handleMouseOut = (e) => {
    const listItem = e.currentTarget; // Target the <li> element
    listItem.style.backgroundColor = "transparent";
  };

  return (
    <ul className="widget-collection">
      {widgetTypeOption.map((el) => (
        <li
          key={el.value} // Add a unique key
          style={{ borderRadius: "8px",color:"#6C706F" }}
          onMouseOver={handleMouseOver} // Use the new event handler functions
          onMouseOut={handleMouseOut} // Use the new event handler functions
        >
          <div
            draggable
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", "");
              e.dataTransfer.setData("droppableWidget", el.value);
              return true;
            }}
          >
            <Avatar
              shape="square"
              size={30}
              style={{ background: "rgba(250, 250, 250, 1)", color: "#233E7F" }}
              icon={el.icon}
            />
            {el.label}
          </div>
        </li>
      ))}
    </ul>
  );
}


export default WidgetCollection;
