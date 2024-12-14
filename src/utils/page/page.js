import { Card, Layout } from "antd";

const { Content } = Layout;
function Page(props) {
  const { title, filter, action, hideFilter, children } = props;
  return (
    <Card title={title} bordered={false} extra={action}>
      {filter && <div style={{ marginBottom: "10px" }}>{filter}</div>}
      {children}
    </Card>
  );
}

export default Page;
