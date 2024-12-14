import {
  ApartmentOutlined,
  HddOutlined,
  ReconciliationOutlined,
  SolutionOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Spin, Statistic } from "antd";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import AssetLibraryService from "../../../services/asset-library-service";
import AssetService from "../../../services/asset-service";
import OrganisationService from "../../../services/organisation-service";
import PlantService from "../../../services/plant-service";
import RoleService from "../../../services/role-service";
import UserService from "../../../services/user-service";
const { Meta } = Card;
class DashBoard extends Component {
  state = {
    total: [
      {
        title: "Organisation",
        value: 0,
        icon: <ApartmentOutlined />,
        url: "organisation",
        loading: true,
      },
      {
        title: "Role",
        value: 0,
        icon: <UsergroupAddOutlined />,
        url: "role",
        loading: true,
      },
      {
        title: "Users",
        value: 0,
        icon: <UserOutlined />,
        url: "user",
        loading: true,
      },
      {
        title: "Site",
        value: 0,
        icon: <SolutionOutlined />,
        url: "plant",
        loading: true,
      },
      {
        title: "Asset Library",
        value: 0,
        icon: <ReconciliationOutlined />,
        url: "asset-library",
        loading: true,
      },
      {
        title: "Assets",
        value: 0,
        icon: <HddOutlined />,
        url: "asset",
        loading: true,
      },
    ],
  };

  componentDidMount() {
    let userService = new UserService();
    let roleService = new RoleService();
    let plantService = new PlantService();
    let organisationService = new OrganisationService();
    let assetLibraryService = new AssetLibraryService();
    let assetService = new AssetService();
    Promise.all([
      organisationService.list(),
      roleService.list(),
      userService.list(),

      plantService.list(),
      assetLibraryService.list(),
      assetService.list(),
    ]).then((r) => {
      let total = this.state.total;
      total[0] = { ...total[0], value: r[0].data?.length, loading: false };
      total[1] = { ...total[1], value: r[1].data?.length, loading: false };
      total[2] = { ...total[2], value: r[2].data?.length, loading: false };
      total[3] = { ...total[3], value: r[3].data?.length, loading: false };
      total[4] = { ...total[4], value: r[4].data?.length, loading: false };
      total[5] = { ...total[5], value: r[5].data?.length, loading: false };
      this.setState((state, props) => ({
        ...state,
        total: total,
      }));
    });
  }

  render() {
    return (
      <Row gutter={[10, 10]}>
        {this.state.total?.map((e, i) => (
          <Col sm={6} md={6} lg={4} xl={4} key={`total${i}`}>
            <Spin spinning={e.loading}>
              <Link to={`../${e.url}`}>
                <Card hoverable size="small">
                  <Statistic title={e.title} value={e.value} prefix={e.icon} />
                </Card>
              </Link>
            </Spin>
          </Col>
        ))}
      </Row>
    );
  }
}

export default DashBoard;
