import { useState } from "react";
import { Result, Steps, Tabs } from "antd";
import ProductMaster from "../product-master/product-master";
import ComponentMaster from "../component-master/component-master";
import ComponentRouting from "../component-routing/component-routing";
import ProductAssemblyRouting from "../product-assembly-routing/product-assembly-routing";
import {
  Routes,
  Route,
  Link,
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";
function ProductModule() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const items = [
    {
      key: 0,
      label: `Product`,
      children: <ProductMaster />,
    },
    {
      key: 1,
      label: `BOM`,
      children: <ComponentMaster />,
    },
    // {
    //   key: 2,
    //   label: `Component Routing`,
    //   children: <ComponentRouting />,
    // },
    {
      key: 3,
      label: `Product Assembly Routing`,
      children: <ProductAssemblyRouting />,
    },
  ];
  const onChangeStep = (c) => {
    setCurrent(c);
  };
  const renderContent = (c) => {
    let page;
    switch (c) {
      case 0:
        page = <ProductMaster />;
        break;
      case 1:
        page = <ComponentMaster />;
        break;
      case 2:
        page = <ComponentRouting />;
        break;
      case 3:
        page = <ProductAssemblyRouting />;
        break;
      case 4:
        page = <Result status={404} />;
        break;
      default:
        page = <ProductMaster />;
        break;
    }
    return page;
  };
  const handleTabChange = (key) => {
    const paths = {
      product: "./master",
      bom: "/digital-job-card/embedd/product-module/bom",
      productAssemblyRouting:
        "/digital-job-card/embedd/product-module/product-assembly-routing",
    };
    if (paths[key]) {
      navigate(paths[key]);
    }
  };

  return (
    <>
      {/* <Tabs items={items} /> */}
      {/* <div className="navTab">
        <nav>
          <NavLink to="./master">Product</NavLink>
          <NavLink to="/digital-job-card/embedd/product-module/bom">
            BOM
          </NavLink>
          <NavLink to="/digital-job-card/embedd/product-module/component-routing">
            Component Routing
          </NavLink>
          <NavLink to="/digital-job-card/embedd/product-module/product-assembly-routing">
            Product Assembly Routing
          </NavLink>
        </nav>
        <div className="nav-content">
          <Outlet />
          <Routes>
            <Route path="master" element={<ProductMaster />} index />
            <Route path="bom" element={<ComponentMaster />} />
            <Route path="component-routing" element={<ComponentRouting />} />
          </Routes>
        </div>
      </div> */}
      <Tabs type="card" defaultActiveKey="product" onChange={handleTabChange}>
        <Tabs.TabPane
          tab={
            <NavLink
              // to="./master"
              style={{ color: "black", textDecoration: "none" }}
            >
              Product
            </NavLink>
          }
          key="product"
        >
          <div className="tab-body">
            {/* <ProductMaster /> */}
            <Outlet />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <NavLink
              // to="/digital-job-card/embedd/product-module/bom"
              style={{ color: "black", textDecoration: "none" }}
            >
              BOM
            </NavLink>
          }
          key="bom"
        >
          <div className="tab-body">
            {/* <ComponentMaster /> */}
            <Outlet />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <NavLink
              // to="/digital-job-card/embedd/product-module/product-assembly-routing"
              style={{ color: "black", textDecoration: "none" }}
            >
              Product Assembly Routing
            </NavLink>
          }
          key="productAssemblyRouting"
        >
          <div className="tab-body">
            {/* <ProductAssemblyRouting /> */}
            <Outlet />
          </div>
        </Tabs.TabPane>
      </Tabs>
      {/* <Steps
        onChange={onChangeStep}
        current={current}
        type="navigation"
        items={[
          {
            title: "Product",
          },
          {
            title: "BOM",
          },
          {
            title: "Component Routing",
          },
          {
            title: "Product Routing",
          },
        ]}
      />
      {renderContent(current)} */}
    </>
  );
}

export default ProductModule;
