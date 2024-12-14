import {
  Table,
  message,
  Button,
  Row,
  Col,
  Input,
  Form,
  Result,
  Spin,
} from "antd";
import { Link } from "react-router-dom";
import {
  AddButton,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";
import moment from "moment";
import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";
import { withAuthorization } from "../../../utils/with-authorization";
import StockJournalService from "../../../services/inventory-services/stock-journal-service";
import InventoryConfigurationService from "../../../services/inventory-services/inventory-configuration-service";
import { withRouter } from "../../../utils/with-router";

class StockJournal extends PageList {
  service = new StockJournalService();
  inventoryService = new InventoryConfigurationService();
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
    };
  }

  componentDidMount() {
    this.list();
  }

  // fetchData = () => {
  //   this.setState({ isLoading: true });

  //   this.service
  //     .list()
  //     .then((response) => {
  //       this.handleData(response.data);
  //     })
  //     .catch((error) => {
  //       message.error("Error fetching data");
  //       this.setState({ isLoading: false });
  //     });
  // };

  title = "Stock Journal";
  columns = [
    {
      dataIndex: "sno",
      key: "sno",
      title: "S.No",
      width: "50px",
      align: "left",
      // render: (val, text, index) => {
      //   return index + 1;
      // },
    },
    {
      dataIndex: "date",
      key: "ahname",
      title: "Date",
      width: "150px",
      render: (value) => {
        return value ? moment(value).format("DD-MM-YYYY") : "-";
      },
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      align: "left",
    },
    {
      dataIndex: "stockJournalNumber",
      key: "stockJournalNumber",
      title: "S.J.No",
      render: (value) => {
        return value ? value : "-";
      },

      align: "left",
    },

    {
      dataIndex: "refNo",
      key: "refNo",
      title: "Ref.No",
      align: "left",
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      align: "left",
    },

    {
      dataIndex: "stockJournalId",
      key: "stockJournalId",
      title: "Action",
      width: "140px",
      align: "left",
      render: (value, record, index) => {
        return (
          <>
            {/* {this.props.view || <ViewButton onClick={() => this.view(value)} />} */}
            {this.props.access[0]?.includes("view") && (
              <Link to={`view/${value}`}>
                <ViewButton onClick={() => this.view(value)} />
              </Link>
            )}
            {/* <Link to={`edit/${value}`}>
              <EditButton onClick={() => this.edit(value)} />
            </Link> */}
            {this.props.access[0]?.includes("delete") && (
              <DeleteButton onClick={() => this.delete(value)} />
            )}
          </>
        );
      },
    },
  ];

  render() {
    const { access, isLoading } = this.props;

    if (isLoading) {
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
      <Spin spinning={isLoading}>
        <Page
          title={this.title}
          action={
            <div>
              {this.props.access[0]?.includes("add") && (
                <Link to="/spare-parts/stock-journal/add">
                  <AddButton onClick={() => this.add()} />{" "}
                </Link>
              )}
            </div>
          }
        >
          <Form.Item>
            <Row>
              <Col md={6}>
                <Input
                  onChange={(v) => this.search(v, "stockJournalNumber")}
                  placeholder="Search S.J.No"
                />
              </Col>
            </Row>
          </Form.Item>
          <Table
            onRow={(record, index) => {
              return {
                "data-testid": "row",
              };
            }}
            rowKey="stockJournalId"
            pagination={{
              showSizeChanger: true,

              //showQuickJumper: true,

              size: "default",
            }}
            scroll={{ x: 980 }}
            loading={this.state.isLoading}
            dataSource={this.state.rows}
            columns={this.columns}
            size="small"
            bordered
          />
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(StockJournal));
