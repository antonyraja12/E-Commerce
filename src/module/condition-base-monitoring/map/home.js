import { Button, Col, Form, Row, Select, Table, TreeSelect } from "antd";
import React, { Component } from "react";
import Page from "../../../utils/page/page";
import TileCard from "./tile-card";
import Maps from "./map";
import { MdWifi, MdWifiOff } from "react-icons/md";
import { AiOutlineUser, AiTwotoneFire } from "react-icons/ai";
import { HiBellAlert } from "react-icons/hi2";
import FilterFunctions from "../../remote-monitoring/common/filter-functions";
import AppHierarchyCustomerListService from "../../../services/app-hierarchy/app-hierarchy-customer-list-service";
import LocationService from "../../../services/location-service";
import AssetService from "../../../services/asset-service";
import AppHierarchyService from "../../../services/app-hierarchy/app-hierarchy-service";
import { withForm } from "../../../utils/with-form";

class Home extends FilterFunctions {
  customerList = new AppHierarchyCustomerListService();
  appHierarchyService = new AppHierarchyService();
  locationService = new LocationService();
  assetService = new AssetService();
  state = {
    // siteList: [],
    siteList: [],
  };
  columns = [
    {
      dataIndex: "appHierarchy",
      key: "appHierarchy",
      title: "Site",
      align: "left",
      render: (value) => {
        return value?.ahname;
      },
    },
    {
      dataIndex: "assetName",
      key: "assetName",
      title: "Asset Name",
      align: "left",
    },
    {
      dataIndex: "assetId",
      key: "assetId",
      title: "Alert",
      align: "left",
      render: (value) => {
        return "false";
      },
    },
  ];
  columns1 = [
    {
      dataIndex: "assetName",
      key: "assetName",
      title: "Asset Name",
      align: "left",
    },
    {
      dataIndex: "parameterName",
      key: "parameterName",
      title: "Parameter Name",
      align: "left",
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
      align: "left",
    },
    {
      dataIndex: "duration",
      key: "duration",
      title: "Duration",
      align: "left",
    },
    {
      dataIndex: "time",
      key: "time",
      title: "Occurance Time",
      align: "left",
    },
  ];
  componentDidMount() {
    this.getLocation();
    // this.getAppHierarchyList()
    // this.getCustomerList();
  }
  getLocation = () => {
    this.setState((state) => ({
      ...state,
      isLocationLoading: true,
    }));
    this.locationService
      .list()
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          locationData: this.locationService.convertToSelectTree(data),
        }));
      })
      .finally(() => {
        this.setState((state) => ({
          ...state,
          isLocationLoading: false,
        }));
      });
  };
  getAppHierarchyList = (id) => {
    this.props.form.setFieldsValue({
      id: null,
    });
    if (id) {
      this.setState((state) => ({
        ...state,
        isparentTreeListLoading: true,
      }));
      this.appHierarchyService
        .getLocation({ locationId: id })
        .then(({ data }) => {
          this.setState((state) => ({
            ...state,
            parentTreeList: this.appHierarchyService.convertToSelectTree(data),
          }));
        })
        .finally(() => {
          this.setState((state) => ({
            ...state,
            isparentTreeListLoading: false,
          }));
        });
    } else {
      this.setState((state) => ({
        ...state,
        parentTreeList: [],
      }));
    }
  };
  calcPercent(value, total) {
    return Number((value / total) * 100);
  }
  onSearch = (value) => {
    // console.log("vtgrrgt", value);
  };
  mapData(data) {
    return data?.map((e) => {
      let icon;
      switch (e.mode) {
        default:
          icon = "http://maps.google.com/mapfiles/ms/micons/green.png";
          break;
      }

      return {
        // label: e.customerName,
        title: e.ahname,
        // key: e.customerId,
        id: e.ahid,
        icon: icon,
        mode: e.mode,
        // onClick: () => this.getCustomerDetail(e.customerId, e.customerName),
        position: { lat: e.customer.latitude, lng: e.customer.longitude },
      };
    });
  }
  compareData(oldObject, newObject) {
    // console.log(oldObject, newObject, "newObject");
    let check = false;
    if (true) {
      // if (oldObject && newObject) {
      setTimeout(() => {
        this.setState((state) => ({ ...state, siteList: newObject }));
      }, 500);
    } else {
      let emptyArray = [];
      for (let x of oldObject) {
        let i = newObject.findIndex((e) => e.key === x.key);
        if (oldObject[i].mode != newObject[i].mode) {
          check = true;
          emptyArray.push(newObject[i]);
        } else {
          emptyArray.push(oldObject[i]);
        }
      }
      if (check == true) {
        this.setState((state) => ({ ...state, siteList: emptyArray }));
      }
    }
  }
  getAssetList = (value) => {
    this.assetService.list({ aHId: value }).then(({ data }) => {
      this.setState((state) => ({
        ...state,
        assetList: data,
      }));
    });
  };
  getCustomerList = (value = null) => {
    // if(value){
    Promise.all([
      // this.customerList.getCustomerData({id:value})
      this.customerList.getCustomerData(value),
    ]).then((response) => {
      // console.log("resss", response[0]);
      this.compareData(this.state.siteList, this.mapData(response[0].data));
    });
    // }
    this.getAssetList(value.id);
  };
  render() {
    return (
      <>
        <Form
          layout="vertical"
          onFinish={this.getCustomerList}
          form={this.props.form}
        >
          <Row gutter={10}>
            <Col sm={6}>
              <Form.Item name="location" style={{ minWidth: "250px" }}>
                <TreeSelect
                  onChange={(v) => this.getAppHierarchyList(v)}
                  showSearch
                  loading={this.state.isLocationLoading}
                  placeholder="Location"
                  allowClear
                  treeData={this.state?.locationData}
                  treeNodeFilterProp="title"
                ></TreeSelect>
              </Form.Item>
            </Col>
            <Col sm={6}>
              <Form.Item name="id" style={{ minWidth: "250px" }}>
                <TreeSelect
                  // onChange={(v) => this.getCustomerList(v)}
                  showSearch
                  loading={this.state.isparentTreeListLoading}
                  placeholder="Entity"
                  allowClear
                  treeData={this.state.parentTreeList}
                  treeNodeFilterProp="title"
                ></TreeSelect>
              </Form.Item>
            </Col>
            <Col sm={6}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Go
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Row gutter={[10, 10]} className="responsiveAlign">
          <Col span={24}>
            <Row gutter={[10, 10]}>
              {[
                {
                  label: "Total Sites",
                  // value:2,
                  value: this.state.status?.total ?? 0,
                  class: "total",
                  mode: null,
                  icon: <AiOutlineUser />,
                  color: "#2196f3",
                  shadow: "rgb(33 150 243 / 15%)",
                  percentage: this.calcPercent(
                    2,
                    0
                    // this.state.status?.total ?? 0,
                    // this.state.status?.total ?? 0
                  ),
                },
                {
                  label: "Online Sites",
                  value: this.state.status?.online ?? 0,
                  // value:1,
                  class: "online",
                  mode: 4,
                  icon: <MdWifi />,
                  shadow: "rgb(0 128 0 / 15%)",
                  color: "green",

                  percentage: this.calcPercent(
                    1,
                    2
                    // this.state.status?.online ?? 0,
                    // this.state.status?.total ?? 0
                  ),
                },

                {
                  label: "Asset Alert Sites",
                  // value: this.state.status?.pumpAlarm ?? 0,
                  class: "pumpAlarm",
                  mode: 2,
                  icon: <HiBellAlert />,
                  color: "orange",
                  shadow: "rgb(255 165 0 / 10%)",
                },
                {
                  label: "Offline Sites",
                  // value: this.state.status?.offline ?? 0,
                  class: "offline",
                  mode: 3,
                  icon: <MdWifiOff />,
                  color: "grey",
                  shadow: "rgb(128 128 128 / 15%)",
                },
              ].map((e, i) => {
                return (
                  <Col flex={1} key={i}>
                    <TileCard
                      // style={{ boxShadow: style }}
                      {...e}
                      onCardClick={() => this.customerSummary(e.mode, e.value)}
                    />
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
        <Row gutter={[10, 10]} style={{ top: "3px" }}>
          <Col xs={24} sm={24} md={24} lg={12}>
            <Maps marker={this.state.siteList} />
          </Col>
          <Col xs={24} sm={24} md={24} lg={12}>
            <Row gutter={[10, 10]}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Table
                  columns={this.columns}
                  dataSource={this.state?.assetList}
                />
              </Col>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Table columns={this.columns1} />
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  }
}
export default withForm(Home);
