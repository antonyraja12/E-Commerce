import React, { useEffect, useState } from "react";

import { SearchOutlined } from "@ant-design/icons";
import { Input, Spin, Table, message } from "antd";
import { Link } from "react-router-dom";
import { useAccess } from "../../../../hooks/useAccess";
import WorkInstructionService from "../../../../services/digital-work-instruction-service/work-order-details-service";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../../utils/action-button/action-button";
import Page from "../../../../utils/page/page";
import PageList from "../../../../utils/page/page-list";
import { withAuthorization } from "../../../../utils/with-authorization";
import { withRouter } from "../../../../utils/with-router";

function WorkinstructionList(props) {
  const [data, setData] = useState([]);
  const [state, setState] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [access, loading] = useAccess();

  const service = new WorkInstructionService();
  const listService = new PageList();

  const getListData = () => {
    service.list().then((response) => {
      setData(listService.handleData(response.data));
      setState(listService.handleData(response.data));
      setLoading(false);
    });
  };

  // console.log("data", data);
  const column = [
    {
      key: "sno",
      title: "S.No",
      dataIndex: "sno",

      // render: (_, record, index) => index + 1, // Use index as serial number
    },
    {
      key: "title",
      title: "Work Instruction",
      dataIndex: "title",
      sorter: (a, b) => a.title?.localeCompare(b.title),
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "description",
    },
    {
      key: "task",
      title: "No of Tasks",
      dataIndex: "task",
      align: "center",
      render: (value, index) => {
        const numberOfTasks = Array.isArray(value) ? value.length : 0;
        return <span>{numberOfTasks}</span>;
      },
    },
    {
      key: "workInstructionId",
      title: "Action",
      dataIndex: "workInstructionId",
      align: "center",
      render: (value) => {
        return (
          <>
            {props.access[0]?.includes("view") && (
              <Link to={`view/${value}`}>
                <ViewButton />
              </Link>
            )}

            {props.access[0]?.includes("edit") && (
              <Link to={`edit/${value}`}>
                <EditButton />
              </Link>
            )}
            {props.access[0]?.includes("delete") && (
              <DeleteButton
                onClick={() => {
                  deleteInstruction(value);
                }}
              />
            )}
          </>
        );
      },
    },
  ];
  useEffect(() => {
    getListData();
  }, []);

  const deleteInstruction = (id) => {
    service.delete(id).then((response) => {
      message.success(response.data.message);

      getListData();
    });
  };

  const filter = (search) => {
    let s = search.target.value.toLowerCase().trim();
    let res = data.filter((e) => {
      return e.title?.toLowerCase().includes(s);
    });
    setData(s ? res : state);
  };

  console.log("data", props);
  // const { access } = props;
  // console.log("access", access[0].length);
  if (props.isLoading) {
    return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
  }

  // if (!access[0] || access[0].length === 0) {
  //   return (
  //     <Result
  //       status={"403"}
  //       title="403"
  //       subTitle="Sorry You are not authorized to access this page"
  //     />
  //   );
  // }

  return (
    <Spin spinning={isLoading || props.isLoading}>
      <Page
        title="Configuration"
        action={
          <>
            {props.access[0]?.includes("add") && (
              <Link to="add">
                <AddButton />
              </Link>
            )}
          </>
        }
      >
        <Input
          prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
          onInput={filter}
          placeholder="Search..."
          bordered={true}
        />
        <br /> <br></br>
        <Table
          rowKey="workInstructionId"
          pagination={{
            showSizeChanger: true,
            //showQuickJumper: true,
            size: "default",
          }}
          size="middle"
          dataSource={data}
          columns={column}
        />
      </Page>
    </Spin>
  );
}
export default withRouter(withAuthorization(WorkinstructionList));
