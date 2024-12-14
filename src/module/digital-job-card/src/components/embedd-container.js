import { Layout } from "antd";
import { Outlet } from "react-router-dom";

function EmbeddContainer() {
  return (
    <Layout
      style={
        {
          // minHeight: "100vh",
          // padding: "10px",
        }
      }
    >
      <div
      // style={{
      //   padding: "10px",
      // }}
      >
        <Outlet />
      </div>
    </Layout>
  );
}

export default EmbeddContainer;
