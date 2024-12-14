import {
  Badge,
  Button,
  Checkbox,
  Col,
  Drawer,
  Form,
  Result,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
  TreeSelect,
} from "antd";
import moment from "moment";
import React from "react";
import InventoryRequestService from "../../../services/inventory-services/inventory-request-service";
import InventoryCategoryService from "../../../services/inventory-services/inventory-category-service";
import Page from "../../../utils/page/page";
import PageList from "../../../utils/page/page-list";
import InventoryRequestForm from "./inventory-request-form";
import { withAuthorization } from "../../../utils/with-authorization";
import { withRouter } from "../../../utils/with-router";
import { AddButton } from "../../../utils/action-button/action-button";
import PurchaseRequestForm from "../purchase-request/purcahse-request-form";
import DateTabs from "../../../helpers/data";
import { withForm } from "../../../utils/with-form";
import { FilterFilled, SearchOutlined } from "@ant-design/icons";
import FilterFunctions from "../../remote-monitoring/common/filter-functions";
import CustomCollapsePanel from "../../../helpers/collapse";
import DateFilter from "../../remote-monitoring/common/date-filter";
import InventoryResolutionForm from "../inventory-resolution/inventory-resolution-form";
const style = {
  formItem: {
    minWidth: "120px",
  },
};
class InventoryRequest extends FilterFunctions {
  constructor(props) {
    super(props);
    this.state = {
      isDateTabsOpen: false,
      selectedCategoryCount: 0,
      selectedStatusCount: 0,
    };
  }
  service = new InventoryRequestService();
  inventoryCategoryService = new InventoryCategoryService();
  title = "Spare Request";
  componentDidMount() {
    this.appHierarchyService.list().then(({ data }) => {
      const parentTreeList = this.appHierarchyService.convertToSelectTree(data);
      const startOfWeek = moment().startOf("week").toDate();
      const endOfWeek = moment().endOf("week").toDate();
      this.props.form.setFieldsValue({
        startDate: startOfWeek,
        endDate: endOfWeek,
        aHId: parentTreeList[0].value,
      });

      this.props.form.submit();
      this.setState((state) => ({ ...state, parentTreeList }));
    });

    // this.list();
    this.getCategoryList();
  }
  openOrderPopup = (id) => {
    this.setState((state) => ({
      ...state,
      orderPopup: {
        open: true,
        mode: "Update",
        title: `Dispatch Spare`,
        id: id,
        disabled: false,
      },
    }));
  };

  openOrderPopupAdd = () => {
    this.setState((state) => ({
      ...state,
      orderPopup: {
        open: true,
        mode: "Add",
        title: `Dispatch Spare`,
        disabled: false,
      },
    }));
  };
  openPurchasePopup = (id) => {
    this.setState((state) => ({
      ...state,
      purchasePopup: {
        open: true,
        id: id,
        mode: "Add",
        title: `Purchase Request`,
        disabled: false,
        isLoading: false,
      },
    }));
  };
  closeOrderPopup = () => {
    this.setState((state) => ({
      ...state,
      orderPopup: {
        open: false,
      },
    }));
    // this.list();
    this.props.form.submit();
  };
  setDatefield = (v) => {
    this.props?.form.setFieldsValue({
      startDate: new Date(v.startDate),
      endDate: new Date(v.endDate),
    });
    this.setState((state) => state);
  };
  handleDateTabsModeChange = (mode) => {
    this.setState({ mode }, () => {
      this.props.form.submit();
    });
  };
  handleDateTabsOpen = () => {
    this.setState({ isDateTabsOpen: !this.state.isDateTabsOpen });
  };
  splitCamelCase = (str) => {
    return str.replace(/([a-z])([A-Z])/g, "$1 $2");
  };
  onFinish = (value) => {
    console.log("value", value);
    this.list(value);
  };
  handleApplyFilter = () => {
    this.onCloseDrawer();
    // const anyFieldSelected = Object.values(this.state.selectedFields).some(
    //   (selected) => selected
    // );
    // this.setState({ isAnyFieldSelected: anyFieldSelected });
    this.setState({ isFilterApplied: true });
    this.setState({ isSelectAllIndeterminate: false });
    const selectedCategoryCount = this.props.form.getFieldValue(
      "sparePartTypeId"
    )
      ? this.props.form.getFieldValue("sparePartTypeId").length
      : 0;
    const selectedStatusCount = this.props.form.getFieldValue("status")
      ? this.props.form.getFieldValue("status").length
      : 0;

    this.setState({
      selectedCategoryCount,
      selectedStatusCount,
    });
  };

  handleResetFilter = () => {
    this.setState({
      selectedFields: {
        status: false,
      },
      isAnyFieldSelected: false,
      isFilterApplied: false,
    });
    this.props.form.resetFields();
    this.onCloseDrawer();
    this.setState({
      selectedCategoryCount: 0,
      selectedStatusCount: 0,
    });
  };
  reset = () => {
    this.onFinish();
    this.props.form.resetFields();
  };
  onCloseDrawer = () => {
    this.setState({ open: false, isDateTabsOpen: false });
  };
  openSparePop = () => {
    this.setState((state) => ({
      ...state,
      sparePopup: {
        open: true,
        mode: "Add",
        title: `Add ${this.title}`,
      },
    }));
  };
  onSpareClose = () => {
    this.setState((state) => ({
      ...state,
      sparePopup: {
        open: false,
      },
    }));
    // this.list();
    this.props.form.submit();
  };
  render() {
    // console.log("this.state.res", this.state.res);
    const columns = [
      {
        dataIndex: "sno",
        key: "sno",
        title: "S.No",
        align: "left",
        width: 50,
      },
      {
        dataIndex: "spareRequestNumber",
        key: "spareRequestNumber",
        title: <Tooltip title="Spare Request Number">SR No</Tooltip>,
        align: "left",
        width: 150,
      },
      {
        dataIndex: "resolutionWorkOrder",
        key: "resolutionWorkOrder",
        title: <Tooltip title="Resolution Work Order No">RW No</Tooltip>,
        align: "left",
        width: 100,
        render: (record, value) => {
          return value?.pmResolutionWorkOrder?.rwoNumber;
        },
      },
      // {
      //   dataIndex: "initiatedBy",
      //   key: "initiatedBy",
      //   title: "Initiated By",
      //   align: "left",
      //   width: 160,
      //   render: (value) => {
      //     return value?.userName;
      //   },
      // },
      {
        dataIndex: "spareRequestSubList",
        key: "spareRequestSubList",
        title: <Tooltip title="Number Of Spares Requested">No.of SR</Tooltip>,
        align: "center",
        width: 100,
        render: (value, rec) => {
          return value ? value.length : null;
        },
      },
      {
        dataIndex: "createdOn",
        key: "createdOn",
        title: "Date",
        align: "left",
        width: 120,
        render: (value) => {
          return value ? moment(value).format("DD-MM-YYYY") : "-";
        },
        // defaultSortOrder: 'desc',
        sorter: (a, b) =>
          moment(a.createdOn).unix() - moment(b.createdOn).unix(),
      },
      // {
      //   dataIndex: "condition",
      //   key: "condition",
      //   title: "Condition",
      //   align: "left",
      //   width: 100,
      // },

      {
        dataIndex: "status",
        key: "status",
        title: "Status",
        align: "left",
        width: 150,
        render: (value) => {
          return this.splitCamelCase(value);
        },
      },

      {
        dataIndex: "spareRequestId",
        key: "spareRequestId",
        title: "Action",
        width: 160,
        align: "left",
        render: (value, record) => {
          return record.status !== "Dispatched" &&
            record.status !== "Acknowledged" ? (
            <Row>
              <Col span={24}>
                {this.props.access[0]?.includes("add") && (
                  <Button
                    // size="small"
                    type="primary"
                    style={{ marginRight: "8px" }}
                    onClick={() => this.openOrderPopup(value)}
                  >
                    Dispatch
                  </Button>
                )}
              </Col>
              {/* <Col span={12}>
                {this.props.access[0]?.includes("add") && (
                  <Button
                    size="small"
                    disabled={record.purchased}
                    type="primary"
                    style={{ marginRight: "8px" }}
                    onClick={() => this.openPurchasePopup(value)}
                  >
                    Purchase
                  </Button>
                )}
              </Col> */}
            </Row>
          ) : (
            "-"
          );
        },
      },
    ];

    const { isLoading } = this.props;
    // console.log("access", access[0].length);
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }
    const {
      open,
      status,
      selectedFields,
      isAnyFieldSelected,
      isFilterApplied,
      selectedCategoryCount,
      selectedStatusCount,
    } = this.state;
    console.log("statree", this.state);
    const totalCount = selectedCategoryCount + selectedStatusCount;
    return (
      <Spin spinning={isLoading}>
        {console.log(totalCount, "totalCount")}
        <Page
          title={this.title}
          filter={
            <Form
              hidden={this.props.hideFilter}
              onFinish={this.onFinish}
              form={this.props.form}
              layout="inline"
              // initialValues={{ mode: 2 }}
              preserve={true}
              // size="small"
              // mode={mode}
            >
              <Form.Item name="mode" hidden></Form.Item>
              <Form.Item name="startDate" hidden></Form.Item>
              <Form.Item name="endDate" hidden></Form.Item>
              <Form.Item name="aHId" style={{ minWidth: "250px" }}>
                <TreeSelect
                  onChange={(v) => {
                    // this.getDashboardDetails(v);
                    this.getCategoryList();
                  }}
                  showSearch
                  loading={this.state.isparentTreeListLoading}
                  placeholder="Entity"
                  allowClear
                  treeDefaultExpandAll={false}
                  treeData={this.state.parentTreeList}
                ></TreeSelect>
              </Form.Item>

              <Form.Item hidden>
                <DateFilter />
              </Form.Item>
              <Badge count={totalCount} color="hwb(205 6% 9%)">
                <Button
                  onClick={() => this.setState({ open: true })}
                  style={{
                    backgroundColor: isFilterApplied ? "#c9cccf	" : "inherit",
                  }}
                >
                  <FilterFilled />
                </Button>
              </Badge>

              <Drawer
                title={<div style={{ fontSize: "20px" }}>Filter</div>}
                placement="right"
                onClose={this.onCloseDrawer}
                visible={open}
              >
                <Form
                  onFinish={this.onFinish}
                  form={this.props.form}
                  layout="vertical"
                  //initialValues={{ mode: 2 }}
                  preserve={true}
                >
                  <CustomCollapsePanel title="Category">
                    <Form.Item
                      name="sparePartTypeId"
                      style={{ minWidth: "250px" }}
                    >
                      <Select
                        // onChange={this.getUserList}
                        showSearch
                        loading={this.state.isisCategoryListLoading}
                        placeholder="Category"
                        allowClear
                        filterOption={(input, option) =>
                          option.label
                            .toLowerCase()
                            .includes(input.toLowerCase()) || input === ""
                        }
                        mode="multiple"
                        options={this.state.categoryList}
                      ></Select>
                    </Form.Item>
                  </CustomCollapsePanel>
                  <CustomCollapsePanel title="Status">
                    <Form.Item
                      name="status"
                      style={style.formItem}
                      initialValue={status}
                    >
                      <Checkbox.Group>
                        <Space direction="vertical">
                          <Checkbox value={0}>Requested</Checkbox>
                          <Checkbox value={1}>Partically Dispatched</Checkbox>
                          <Checkbox value={2}>Dispatched</Checkbox>
                        </Space>
                      </Checkbox.Group>
                    </Form.Item>
                  </CustomCollapsePanel>
                  <CustomCollapsePanel title="Range">
                    <div>
                      {/* <DateFilter /> */}
                      <DateTabs
                        open={this.state.isDateTabsOpen}
                        setOpen={this.handleDateTabsOpen}
                        change={(data) => this.setDatefield(data)}
                      />
                    </div>
                  </CustomCollapsePanel>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: "100%" }}
                      onClick={() => {
                        this.handleApplyFilter();
                      }}
                    >
                      <SearchOutlined /> Apply
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      onClick={() => {
                        this.reset();
                        this.handleResetFilter();
                      }}
                      style={{ width: "100%" }}
                    >
                      Reset
                    </Button>
                  </Form.Item>
                </Form>
              </Drawer>
            </Form>
          }
          action={<AddButton type="primary" onClick={this.openSparePop} />}
        >
          {/* <Form
            layout="horizontal"
            onFinish={this.Filter}
            form={this.props.form}
          >
            <Row gutter={[10, 10]}>
              <Col sm={6}>
                <Form.Item name="startDate" hidden></Form.Item>
                <Form.Item name="endDate" hidden></Form.Item>
                <Form.Item name="spare" style={{ minWidth: "250px" }}>
                  <Select
                    showSearch
                    allowClear
                    placeholder="Select Category"
                    optionFilterProp="label"
                    options={this.state.spareCategoryList?.map((e) => ({
                      label: e.sparePartTypeName,
                      value: e.sparePartTypeId,
                    }))}
                    onChange={this.handleChange}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <DateTabs
                    change={(data) => this.setDatefield(data)}
                    onChangeMode={this.handleDateTabsModeChange}
                    open={this.state.isDateTabsOpen}
                    setOpen={this.handleDateTabsOpen}
                    energy={true}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Button
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  type="primary"
                >
                  Go
                </Button>
              </Col>
            </Row>
          </Form> */}

          <Table
            bordered
            rowKey="spareRequestId"
            loading={this.state.isLoading}
            dataSource={this.state.res}
            columns={columns}
            scroll={{ x: 980 }}
            size="small"
            pagination={{
              showSizeChanger: true,
              //showQuickJumper: true,
              size: "default",
            }}
          />
          <InventoryRequestForm
            {...this.state.orderPopup}
            closeOrderPopup={this.closeOrderPopup}
          />
          {/* <PurchaseRequestForm
            {...this.state.purchasePopup}
            close={this.closeOrderPopup}
          /> */}
          <InventoryResolutionForm
            {...this.state.sparePopup}
            resolutionWorkOrderId={this.props.id}
            spareClose={this.onSpareClose}
            assetFamilyId={this.props.assetFamilyId}
          />
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withForm(withAuthorization(InventoryRequest)));
