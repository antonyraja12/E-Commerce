import { ExportOutlined } from "@ant-design/icons";
import { Button, Col, Popover, Row, Table, message } from "antd";
import Column from "antd/es/table/Column";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../../../services/user-service";
import TagsCell from "../../../component/TagCell";

function UserUploadPreview(props) {
  const { data, file, handleCurrentDecrease } = props;
  const [isVisible, setVisible] = useState(false);
  const service = new UserService();
  const navigate = useNavigate();

  const handleUpload = () => {
    service.uploadFile(file).then((response) => {
      // console.log("log1", response);
      if (response.data?.success) {
        message.success(response.data?.message);
        navigate("../");
      } else {
        message.error(response.data?.message);
      }
    });
  };

  const arrData = data && typeof data === "object" ? Object.values(data) : "";

  const columns = [
    {
      title: "S.No.",
      dataIndex: "sno",
      key: "sno",
      width: 100,
      render: (text, record, index) => index + 1,
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      width: 150,
    },
    {
      title: "Entity",
      dataIndex: "entity",
      key: "entity",
      width: 150,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
    },
    {
      title: "Mobile No",
      dataIndex: "mobileNo",
      key: "mobileNo",
      width: 150,
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
      width: 150,
    },
    {
      title: "Group",
      dataIndex: "userGroup",
      key: "userGroup",
      width: 150,
      render: (value, record) => {
        return (
          <TagsCell
            tags={value?.map((groupName) => {
              return { userGroupName: groupName };
            })}
            keyName="userGroupName"
            valueName="userGroupName"
          />
        );
      },
    },
  ];

  return (
    <Row gutter={[10, 10]} justify="end">
      <Row>
        <Col>
          <Table
            className="virtual-table"
            rowKey="userId"
            dataSource={arrData}
            columns={columns}
            size="middle"
            pagination={{
              showSizeChanger: true,

              //showQuickJumper: true,

              size: "default",
            }}
            scroll={{
              y: 330,
            }}
          />
        </Col>
      </Row>
      <Row justify="end" gutter={[10, 10]}>
        <Col>
          <Button
            onClick={() => {
              handleCurrentDecrease();
            }}
          >
            Cancel
          </Button>
        </Col>
        <Col>
          <Button onClick={handleUpload} type="primary">
            Submit
          </Button>
        </Col>
      </Row>
    </Row>
  );
}
export default UserUploadPreview;
