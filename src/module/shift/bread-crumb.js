import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

function BreadcrumbCustom() {
  const items = [
    {
      path: "/settings/shift/configuration",
      title: "Shift Configuration",
      children: [
        {
          path: "/add",
          title: "Add",
        },
        {
          path: "/update",
          title: "Update",
        },
      ],
    },
    // {
    //   path: "/add",
    //   title: "add",
    // },
    // {
    //   path: "/second",
    //   title: "second",
    // },
  ];
  function itemRender(currentRoute, params, items, paths) {
    console.log(currentRoute, params, items, paths);
    const isLast = currentRoute?.path === items[items.length - 1]?.path;

    return isLast ? (
      <span>{currentRoute.title}</span>
    ) : (
      <Link to={`/${paths.join("/")}`}>{currentRoute.title}</Link>
    );
  }

  return <Breadcrumb itemRender={itemRender} items={items} />;
}

export default BreadcrumbCustom;
