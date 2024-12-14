import { ArrowRightOutlined } from "@ant-design/icons";
import { Avatar, Card } from "antd";
import { Link } from "react-router-dom";

const style = {
  borderRadius: "20px",
  boxShadow: "none",
};
export default function Container(props) {
  const { title, children, icon, iconBg, link } = props;
  return (
    <Card
      className="container-card"
      bordered={false}
      style={style}
      styles={{
        body: {
          padding: "20px 15px 10px",
          height: "270px",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Card.Meta
        style={{
          borderRadius: 15,
          background: "#f7f8fd",
          padding: "15px 10px",
          alignItems: "center",
        }}
        avatar={
          <Avatar
            className="container-icon"
            style={{
              background: iconBg,
            }}
            size={50}
            icon={icon}
            link={
              <Link to={link}>
                <ArrowRightOutlined />
              </Link>
            }
          />
        }
        title={title}
      />
      <div
        style={{
          flex: "1 0 auto",
          display: "flex",
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%" }}>{children}</div>
      </div>
    </Card>
  );
}
