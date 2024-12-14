import { fieldType } from "../helper/helper";
import { MdDragIndicator } from "react-icons/md";

function FilterCollection() {
  return (
    <>
      <ul className="widget-collection">
        {fieldType.map((el) => (
          <li
            draggable
            key={`fl-${el.value}`}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", "");
              e.dataTransfer.setData("droppablefield", el.value);
              return true;
            }}
            style={{borderRadius:"8px",color:"#6C706F"}}
            onMouseOver={(e) => { // Handle mouse over event
              e.target.style.backgroundColor = "rgba(250, 250, 250, 1)"; // Change background color on hover
            }}
            onMouseOut={(e) => { // Handle mouse out event
              e.target.style.backgroundColor = "transparent"; // Reset background color on mouse out
            }}
          >
            <div
              style={{
                paddingTop: "2px",
                paddingRight: "5px",
                color:"rgba(108, 112, 111, 1)"
              }}
            >
              <MdDragIndicator />
            </div>
            {el.label}
          </li>
        ))}
      </ul>
    </>
  );
}

function FilterOption() {
  return <FilterCollection />;
  return (
    <>
      <div
        className="widgets"
        style={{
          border: "1px solid rgb(221, 221, 221)",
          height: 250,
          overflowY: "scroll",
        }}
      >
        <div className="side-heading">
          <h5>Fields</h5>
        </div>
        <FilterCollection />
      </div>
    </>
  );
}

export default FilterOption;
