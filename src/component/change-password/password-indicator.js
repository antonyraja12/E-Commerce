import { useEffect } from "react";
import { useState } from "react";

const COLOR_CODE = ["#ff4033", "#ffd908", "#6ecc3a"];
const PASSWORD_STRENGTH_CODE = ["WEAK", "STRONG", "VERY_STRONG"];
function PasswordIndicator(props) {
  const [level, setLevel] = useState(0);
  const [height, setHeight] = useState(3);

  useEffect(() => {
    setLevel(props.level);
    if (props.height) setHeight(props.height);
  }, [props]);

  const indicatorStyle = (color, height) => {
    return {
      display: "inline-block",
      width: "33.33%",
      backgroundColor: color,
      height: height + "px",
      borderRadius: "2px",
    };
  };

  const [indicator, setIndicator] = useState([]);
  useEffect(() => {
    let ind = [];
    const color = COLOR_CODE[level - 1];
    for (let i = 0; i < level; i++) {
      ind.push(
        <div key={`ikey${i}`} style={indicatorStyle(color, height)}></div>
      );
    }
    setIndicator(ind);
  }, [level, height]);

  const containerStyle = (height) => {
    return {
      display: "flex",
      width: "100%",
      height: height + "px",
      background: "gray",
      marginTop: "5px",
      ...props.style,
    };
  };
  return <div style={containerStyle(height)}>{indicator}</div>;
}

export default PasswordIndicator;
