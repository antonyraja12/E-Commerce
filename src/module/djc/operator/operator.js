import { Badge, Col, Form, Input, Row, Space, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { OperatorService } from "../../../services/djc/operator-service";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import Page from "../../../utils/page/page";
import { withAuthorization } from "../../../utils/with-authorization";
import { withRouter } from "../../../utils/with-router";
import OperatorForm from "./operator-form";
import { SearchOutlined } from "@ant-design/icons";

const Operator = (props) => {
  const title = "Operator";
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, title: "", id: null });

  const service = new OperatorService();

  useEffect(() => {
    fetchOperator();
  }, []);

  const fetchOperator = async () => {
    setIsLoading(true);
    try {
      const response = await service.list();
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      message.error("Failed to fetch operator");
    } finally {
      setIsLoading(false);
    }
  };

  const add = () => {
    setModal({
      open: true,
      mode: "Add",
      title: `Add ${title}`,
      id: null,
      disabled: false,
    });
  };

  const update = (id) => {
    setModal({
      open: true,
      mode: "Update",
      title: `Edit ${title}`,
      id,
      disabled: false,
    });
  };
  const view = (id) => {
    setModal({
      open: true,
      mode: "View",
      title: `View ${title}`,
      id,
      disabled: true,
    });
  };

  const onClose = () => {
    setModal({ open: false, mode: null, title: "", id: null, disabled: false });
    fetchOperator();
    setSearchValue("");
  };

  const remove = async (id) => {
    try {
      const response = await service.delete(id);
      fetchOperator();
      if (response.status == 200) {
        message.success(`Operator deleted successfully`);
      } else {
        message.success(`Something went wrong, Try again!`);
      }
    } catch (error) {
      message.error("Failed to delete operator");
    }
  };

  const columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: "80px",
      render: (_, __, index) => index + 1,
    },
    {
      dataIndex: "operatorName",
      key: "operatorName",
      title: "Operator Name",
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: "100px",
      render: (value) =>
        value ? (
          <Badge color="green" text="Active" />
        ) : (
          <Badge text="Inactive" color="#cccccc" />
        ),
    },
    {
      dataIndex: "operatorId",
      key: "operatorId",
      title: "Action",
      width: "180px",
      align: "center",
      render: (value) => (
        <Space>
          {props.access[0]?.includes("view") && (
            <ViewButton onClick={() => view(value)} />
          )}
          {props.access[0]?.includes("edit") && (
            <EditButton onClick={() => update(value)} />
          )}
          {props.access[0]?.includes("delete") && (
            <DeleteButton onClick={() => remove(value)} />
          )}
        </Space>
      ),
    },
  ];
  const filter = (event) => {
    let s = event.target.value.toLowerCase();
    let res = data.filter((e) => {
      return e.operatorName?.toLowerCase().includes(s);
    });

    setFilteredData(res);
    setSearchValue(s);
  };
  return (
    <Page
      title={title}
      action={props.access[0]?.includes("add") && <AddButton onClick={add} />}
    >
      <Row justify="space-between">
        <Col span={24}>
          <Form>
            <Form.Item>
              <Input
                prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
                onInput={filter}
                value={searchValue}
                placeholder="Search..."
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <Row gutter={[10, 10]}>
        <Col span={24}>
          <Table
            loading={isLoading}
            bordered
            dataSource={filteredData}
            columns={columns}
            size="small"
            rowKey="operatorId"
          />
          <OperatorForm modal={modal} onClose={onClose} />
        </Col>
      </Row>
    </Page>
  );
};

export default withRouter(withAuthorization(Operator));
