import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Input, message, Row, Table, Tag, Typography } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import React, { Component } from "react";
import CheckService from "../../../../services/inspection-management-services/check-service";
import CheckTypeService from "../../../../services/inspection-management-services/check-type-service";
import CheckForm from "../check/check-form";
const selectedRowKey = [];
class ChecksSelection extends Component {
  checkService = new CheckService();

  checkTypeService = new CheckTypeService();
  columns = [
    {
      title: "Check Items",
      dataIndex: "checkName",
      key: "checkName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (value) => {
        return (
          <Paragraph
            ellipsis={{ rows: 2, expandable: true }}
            style={{ width: "100%" }}
          >
            {value}
          </Paragraph>
        );
      },
    },
  ];
  state = {
    checkIds: [],
    selectedChecks: [],
    selectedRowKey: [],
    open: false,
    popup: {
      open: false,
    },
  };
  constructor(props) {
    super(props);
  }

  onClose = (data) => {
    this.setState(
      (state) => ({
        ...this.state,
        popup: { open: false },
        checkIds: [...state.checkIds, data.checkId],
      }),
      () => {
        if (data) {
          this.list();
        }
      }
    );
  };
  add() {
    this.setState({
      ...this.state,
      popup: {
        open: true,
        mode: "Add",
        title: `Add Check Item`,
        id: undefined,
        disabled: false,
      },
    });
  }
  componentDidMount() {
    this.setState(
      (prevState) => ({
        ...prevState.checkIds,
        checkIds: this.props.checks,
      }),
      () => {
        this.list();
      }
    );
  }
  list() {
    this.setState((state) => ({
      ...state,
      isLoading: true,
    }));
    Promise.all([this.checkService.list({ active: true })])
      .then((response) => {
        this.setState((state) => ({
          ...state,
          checks: response[0].data,
          res: response[0].data,
          selectedChecks: response[0].data?.filter((e) => {
            return this.state.checkIds?.some((el) => el === e.checkId);
          }),
        }));
      })
      .catch((error) => {
        console.log(message);
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
      });
  }
  filter = (search) => {
    let s = search.target.value.toLowerCase().trim();
    let res = this.state.checks.filter((e) => {
      return (
        e.checkName?.toLowerCase().includes(s) ||
        e.description?.toLowerCase().includes(s)
      );
    });
    this.setState((state) => ({ ...state, res: res }));
  };
  render() {
    const { isLoading, res, selectedChecks, checkIds } = this.state;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState((state) => ({
          ...state,
          checkIds: [...selectedRowKeys],
          selectedChecks: selectedRows,
        }));
      },
      selectedRowKeys: this.state.checkIds,
    };
    return (
      <>
        <Row justify="space-between" gutter={[10, 10]}>
          <Col span={24}>
            <Typography.Title level={5} style={{ display: "inline-block" }}>
              Selected Checks :
            </Typography.Title>
            &nbsp;
            {selectedChecks?.map((e) => (
              <Tag
                style={{ marginBottom: "5px" }}
                color="cyan"
                key={`sel${e.checkId}`}
              >
                {e.checkName}
              </Tag>
            ))}
          </Col>
          <Col span={18}>
            <Input
              prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
              onInput={this.filter}
              placeholder="Search..."
            />
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={() => this.add()}
              icon={<PlusOutlined />}
            >
              Add New Check Items
            </Button>
          </Col>

          <Col span={24}>
            <Table
              scroll={{ y: "350px" }}
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
              }}
              loading={isLoading}
              columns={this.columns}
              dataSource={res}
              rowKey="checkId"
              size="small"
              pagination={false}
            />
          </Col>
        </Row>
        <CheckForm {...this.state.popup} close={this.onClose} />
      </>
    );
  }
}

export default ChecksSelection;
