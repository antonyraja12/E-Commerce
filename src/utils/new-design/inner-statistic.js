import { Flex, Space, Statistic, Typography } from "antd";

export default function InnerStatistic({ value, title, prefix }) {
  return (
    <Flex vertical={true} >
      <Typography.Text style={{ color: "#9aa6c4" }}>{title}</Typography.Text>

      <Space>
        {prefix}
        <Typography.Title
          level={3}
          style={{ fontWeight: 600, color: "#0f1a35", margin: 0 }}
        >
          {value}
        </Typography.Title>
      </Space>
    </Flex>
  );
}
