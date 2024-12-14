import { Card, Col, Form, Image, Row, TreeSelect } from "antd";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import AppHierarchyCustomerListService from "../../../services/app-hierarchy/app-hierarchy-customer-list-service";
import AssetService from "../../../services/asset-service";
import FilterFunctions from "../../remote-monitoring/common/filter-functions";

class AssetDashboard extends FilterFunctions {
  customerList = new AppHierarchyCustomerListService();
  assetService = new AssetService();
  state = {
    data: [],
    isDataLoading: false,
    siteList: [],
  };
  componentDidMount() {
    this.getAppHierarchyList();
  }
  getAssetList = (value) => {
    // console.log("value", value);

    if (value) {
      const customerListPromise = this.customerList.list({ id: value });
      const assetServicePromise = this.assetService.list({ aHId: value });

      Promise.all([customerListPromise, assetServicePromise]).then(
        (responses) => {
          const customerListResponse = responses[0];
          const assetServiceResponse = responses[1];

          this.setState({ customerListData: customerListResponse.data });
          this.setState({ assetServiceData: assetServiceResponse.data });
        }
      );
    }
  };

  render() {
    return (
      <>
        <Form layout="vertical" onFinish={this.onSearch} form={this.props.form}>
          <Row gutter={10}>
            <Col sm={6}>
              <Form.Item name="ahId" style={{ minWidth: "250px" }}>
                <TreeSelect
                  onChange={(v) => this.getAssetList(v)}
                  showSearch
                  loading={this.state.isparentTreeListLoading}
                  placeholder="Entity"
                  allowClear
                  treeData={this.state.parentTreeList}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Row gutter={[10, 10]} style={{ marginBottom: "10px" }}>
          {this.state?.assetServiceData?.length ? (
            this.state.assetServiceData.map((e, index) => {
              const customer = this.state.customerListData.find(
                // (x) => {
                //   console.log("x", x);
                // }

                (x) => x.customerId === e.customer?.customerId
              );

              return (
                <Col sm={6} xs={6} key={index}>
                  <Card
                    // title={customer.customer?.customerName}
                    hoverable
                  >
                    <p>
                      {" "}
                      Asset Name :
                      <Link
                        to={`/cbm/monitoring?ahId=${e.ahid}&assetId=${e.assetId}`}
                      >
                        {e.assetName}
                      </Link>
                    </p>
                    <>
                      <Image src={e.imagePath} />
                    </>
                  </Card>
                </Col>
              );
            })
          ) : (
            <p>No asset data available</p>
          )}
        </Row>
      </>
    );
  }
}

export default AssetDashboard;
