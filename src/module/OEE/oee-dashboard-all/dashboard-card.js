import {
  Avatar,
  Card,
  Col,
  Divider,
  Flex,
  Progress,
  Row,
  Space,
  Statistic,
  Typography,
} from "antd";
const { Text, Link } = Typography;

const badgeStyle = {
  fontSize: "100px",
};
const greyBackgroundColor = "#fafafa";
function DashboardCard() {
  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card
            title={
              <Space direction="vertical">
                <Typography.Title level={5}>Name 1</Typography.Title>
              </Space>
            }
            extra={
              <a>
                {" "}
                <Avatar
                  size={15}
                  style={{
                    backgroundColor: "#33D04C",
                    display: "flex",
                    alignItems: "center",
                  }}
                />
              </a>
            }
            bodyStyle={{
              padding: "0px 0px 1px 0px",
              border: "3px ",
            }}
            headStyle={{ border: "none", padding: "0px 12px 0px 12px" }}
            style={{
              width: "100%",
              borderRadius: "5px",
            }}
          >
            <Row justify="space-between" align="middle">
              <Col span={10}>
                <Flex justify="space-evenly" align="center">
                  <Progress
                    size={70}
                    type="circle"
                    strokeWidth={12}
                    strokeColor="#1890ff"
                  />
                  <Typography.Text
                    style={{
                      fontFamily: "Inter",
                      fontWeight: 500,
                      color: "#8B908F",
                    }}
                  >
                    OEE
                  </Typography.Text>
                </Flex>
              </Col>
              <Col span={14}>
                <Flex vertical align="center">
                  <Space>
                    <Typography.Text
                      style={{
                        fontFamily: "Inter",
                        fontWeight: 400,
                        color: "#8B908F",
                      }}
                    >
                      A
                    </Typography.Text>
                    <Progress
                      percent={60}
                      size="small"
                      style={{ width: "100px" }}
                      strokeColor="#FF5353"
                    />
                  </Space>
                  <Space>
                    <Typography.Text
                      style={{
                        fontFamily: "Inter",
                        fontWeight: 400,
                        color: "#8B908F",
                      }}
                    >
                      P
                    </Typography.Text>
                    <Progress
                      percent={60}
                      size="small"
                      style={{ width: "100px" }}
                      strokeColor="#FFD600"
                    />
                  </Space>
                  <Space>
                    <Typography.Text
                      style={{
                        fontFamily: "Inter",
                        fontWeight: 400,
                        color: "#8B908F",
                        fontSize: "14px",
                      }}
                    >
                      Q
                    </Typography.Text>
                    <Progress
                      percent={60}
                      size="small"
                      style={{ width: "100px" }}
                      strokeColor="#33D04C"
                    />
                  </Space>
                </Flex>
              </Col>
            </Row>
            <Row
              justify="space-evenly"
              align="middle"
              style={{ background: greyBackgroundColor }}
            >
              <Statistic
                title="Part Counts"
                value={100}
                valueStyle={{
                  fontSize: "1.1em",
                  color: "#0F1A35",
                  fontWeight: 400,
                }}
              />

              <Divider type="vertical" />
              <Statistic
                title="Runtime"
                value={235}
                valueStyle={{
                  fontSize: "1.1em",
                  color: "#0F1A35",
                  fontWeight: 400,
                }}
                valueRender={(value) => (
                  <>
                    {value}{" "}
                    <Typography.Text
                      style={{
                        fontWeight: 400,
                        color: "#0F1A35",
                        fontSize: ".9em",
                      }}
                    >
                      mins
                    </Typography.Text>
                  </>
                )}
              />
              <Divider type="vertical" />
              <Statistic
                title="Downtime"
                value={235}
                valueStyle={{
                  fontSize: "1.1em",
                  color: "#0F1A35",
                  fontWeight: 400,
                }}
                valueRender={(value) => (
                  <>
                    {value}{" "}
                    <Typography.Text
                      style={{
                        fontWeight: 400,
                        color: "#0F1A35",
                        fontSize: ".9em",
                      }}
                    >
                      mins
                    </Typography.Text>
                  </>
                )}
              />
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default DashboardCard;
