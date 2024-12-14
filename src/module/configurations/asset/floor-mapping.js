import React, { Component } from "react";
import { Row, Col, Card, Form, Button, Tooltip } from "antd";

import Page from "../../../utils/page/page";
import Floor from "./floor.png";
import { Link } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import ImageMapper from "react-image-mapper";
class FloorMapping extends Component {
  state = {
    plantId: undefined,
    map: {
      name: "generated",
      areas: [
        {
          id: "1",
          shape: "circle",
          coords: [170, 250, 10],
          preFillColor: "red",
        },
        {
          id: "2",
          shape: "circle",
          coords: [620, 200, 10],
          preFillColor: "red",
        },
        {
          id: "3",
          shape: "circle",
          coords: [610, 355, 10],
          preFillColor: "red",
        },
        {
          id: "4",
          shape: "circle",
          coords: [340, 320, 10],
          preFillColor: "red",
        },
        {
          id: "5",
          shape: "circle",
          coords: [900, 300, 10],
          preFillColor: "red",
        },
      ],
    },
  };
  componentDidMount() {
    let plantId = this.props.searchParams.get("plantId");
    if (plantId) {
      this.setState((state) => ({ ...state, plantId: plantId }));

      // this.props.form?.setFieldValue("plantId", Number(plantId));
      // this.props.form?.submit();
    }
  }
  handleClick = (area, index, event) => {
    console.log(area);
  };
  onImageClick = (event) => {
    this.setState((state) => {
      let map = state.map;
      let x = event.nativeEvent.layerX;
      let y = event.nativeEvent.layerY;
      map.areas.push({
        id: Date.now(),
        shape: "circle",
        coords: [x, y, 10],
        preFillColor: "red",
      });
      return { ...state, map: map };
    });
  };
  render() {
    return (
      <Page title="Floor View">
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Card
              style={{ overflow: "auto" }}
              extra={
                <Link to={`../asset-list?plantId=${this.state?.plantId}`}>
                  <Tooltip title="Asset">
                    <Button type="primary">
                      <MenuOutlined />
                    </Button>
                  </Tooltip>
                </Link>
              }
            >
              <ImageMapper
                onImageClick={this.onImageClick}
                src={Floor}
                width={940}
                onClick={this.handleClick}
                map={this.state.map}
              />
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
}

export default FloorMapping;
