import { BarChartOutlined } from "@ant-design/icons";
import { AiFillAlert } from "react-icons/ai";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import CommonCard from "./common-card";
import { iconStyle } from "./variable";

function DiCard(props) {
  return (
    <CommonCard
      title="Condition Monitoring"
      icon={<BarChartOutlined style={iconStyle} />}
      link="./machine/qi"
      iconBg="linear-gradient(to bottom right, #f5f5f5, #4f00a8, #4f00a8)"
      content={[
        {
          title: "Total Count",
          icon: <AiFillAlert style={{ color: "#ebd300" }} />,
          value: 125,
        },
        {
          title: "Total Resolved",
          icon: (
            <FiArrowUpRight style={{ color: "#6ab13f", fontSize: "1.5em" }} />
          ),
          value: 101,
        },
        {
          title: "Total Yet Resolved",
          icon: (
            <FiArrowDownLeft style={{ color: "#f84343", fontSize: "1.5em" }} />
          ),
          value: 24,
        },
      ]}
    />
  );
}

export default DiCard;
