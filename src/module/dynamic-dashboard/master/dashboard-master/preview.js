import { Card, Breadcrumb } from "antd";
import Frame from "../../frame/frame";
import { breadcrumbRender } from "../../../../helpers/constants";
import { useParams } from "react-router-dom";

function Preview() {
  const params = useParams();
  const { id } = params;
  // console.log(params);
  const breadcrumbItem = [
    {
      path: "../../",
      title: "Dashboard Designer",
    },
    {
      path: `../../editor/${id}`,
      title: "Editor",
    },
    {
      path: `../../editor/${id}/preview`,
      title: "Preview",
    },
  ];

  return (
    <Card
      style={{ margin: "auto" }}
      title={
        <Breadcrumb items={breadcrumbItem} itemRender={breadcrumbRender} />
      }
    >
      <Frame />
    </Card>
  );
}

export default Preview;
