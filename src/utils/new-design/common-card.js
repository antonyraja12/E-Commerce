import { Avatar, Col, Row, Space } from "antd";
import Container from "./container";
import InnerStatistic from "./inner-statistic";
function CommonCard({ title, icon, link, iconBg, content, length }) {
  const [item1, item2, item3] = content;

  return (
    <Container iconBg={iconBg} icon={icon} link={link} title={title}>
      <Row
        gutter={[10, 10]}
        style={length <= 2 ? { display: "flex", justifyContent: "center" } : {}}
      >
        <Col span={length >= 3 ? 24 : 8}>
          <Space>
            <Avatar
              className="dashboard-avatar"
              shape="square"
              size={45}
              icon={item1.icon}
            />
            <InnerStatistic title={item1.title} value={item1.value} />
          </Space>
        </Col>
        <Col span={length >= 3 ? 12 : 8}>
          <InnerStatistic
            title={item2.title}
            value={item2.value}
            prefix={
              <Avatar
                className="dashboard-avatar"
                size={25}
                icon={item2.icon}
              />
            }
          />
        </Col>
        <Col span={length >= 3 ? 12 : 8}>
          <InnerStatistic
            title={item3.title}
            value={item3.value}
            prefix={
              <Avatar
                className="dashboard-avatar"
                size={25}
                icon={item3.icon}
              />
            }
          />
        </Col>
      </Row>
    </Container>
  );
}

export default CommonCard;
