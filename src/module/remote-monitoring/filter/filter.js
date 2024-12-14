import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, Row, Select } from "antd";
import React from "react";
import FilterService from "../../../services/filter-service";
import PageList from "../../../utils/page/page-list";
//import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import ContinentService from "../../../services/continent-service";
import CountryService from "../../../services/country-service";
const { Option } = Select;
class Filter extends PageList {
  continent = new ContinentService();

  country = new CountryService();
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      isRegionActive: true,
      iscountryActive: true,
      isStateActive: true,
      isCustomerActive: true,
      isMachineActive: true,
    };
  }

  service = new FilterService();
  title = "Parameter Report";

  static getDerivedStateFromProps(props, state) {
    if (props.layout == "horizontal") {
      return { ...props, col: { sm: 6, md: 4, lg: 4, xs: 24 } };
    } else {
      return { ...props, col: { span: 24 } };
    }
  }

  render() {
    const { country, region } = this.state;

    return (
      <Form size="small" layout="vertical">
        <Row gutter={20} align="bottom">
          {this.state.isRegionActive && (
            <Col {...this.state.col}>
              <Form.Item label="Region">
                <Select>
                  {this.state.continent?.map((e) => (
                    <Select.Option
                      key={`continent${e.continentId}`}
                      value={e.continentName}
                    >
                      {e.continentName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}

          {this.state.iscountryActive && (
            <Col {...this.state.col}>
              <Form.Item label="Country">
                <Select>
                  {this.state.country?.map((e) => (
                    <Option key={`country${e.countryId}`} value={e.countryId}>
                      {e.countryName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}

          {this.state.isStateActive && (
            <Col {...this.state.col}>
              <Form.Item label="State">
                <Select>
                  <Select.Option value="test">Test</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          )}

          {this.state.isCustomerActive && (
            <Col {...this.state.col}>
              <Form.Item label="Customer">
                <Select>
                  <Select.Option value="test">Test</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          )}

          {this.state.isMachineActive && (
            <Col {...this.state.col}>
              <Form.Item label="Machine">
                <Select>
                  <Select.Option value="electricalpump">
                    Electrical Pump
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          )}

          <Col sm={5} md={4} lg={1} xs={24}>
            <Form.Item>
              <Button
                icon={<FilterOutlined />}
                onClick={this.onClickButton}
              ></Button>
              <Modal
                open={this.state.openModal}
                onClose={this.onCloseModal}
              ></Modal>
            </Form.Item>
          </Col>

          <Col sm={10} md={4} lg={3} xs={24}>
            <Form.Item>
              <Button type="primary" icon={<SearchOutlined />}>
                Go
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
export default Filter;
