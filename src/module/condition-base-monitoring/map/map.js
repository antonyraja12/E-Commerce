import React, { memo, useLayoutEffect } from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import { mapKey, remoteAsset } from "../../../helpers/url";
// import MapHoverService from "../../../services/map-hover-service";
import { CopyOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Drawer,
  Image,
  Row,
  Tooltip,
  message,
} from "antd";
import { Link, BrowserRouter as Router } from "react-router-dom";
import AssetService from "../../../services/asset-service";

let mainUrl;
const text = <span>prompt text</span>;
// const info = () => {
//   message.info('hi');
// };
const handleClick = () => {
  message.info("Button clicked!");
};
const currentPath = window.location.href;

const newPath = currentPath.replace("/building-view", "/fire-dashboard");

class Maps extends React.Component {
  assetService = new AssetService();
  state = {
    showingInfoWindow: false,
    activeMarker: null,
    selectedPlace: null,
    showInfoWIndow: false,
    plantId: null,
    mapHOver: false,
    open: false,
    drawerHeight: 100,
  };
  componentDidMount() {
    // Decrease height every second
    this.decreaseDrawerHeightInterval = setInterval(() => {
      this.setState((prevState) => ({
        drawerHeight: prevState.drawerHeight - 10, // Decreasing height by 10px
      }));
    }, 1000);

    this.intervalId = setInterval(() => {
      this.setState((prevState) => ({
        ...this.state,
        isBlinking: !prevState.isBlinking,
      }));
    }, 800);
  }

  componentWillUnmount() {
    clearInterval(this.decreaseDrawerHeightInterval);
    clearInterval(this.intervalId);
  }

  handleClick = () => {
    // console.log("CLicked");
  };
  // copy = (value) => {
  //   navigator.clipboard.writeText(value);
  // };
  copy = (value) => {
    if (value) {
      const textArea = document.createElement("textarea");
      textArea.value = value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };
  handleMarkerClick = (props, marker) => {
    // console.log("onclickprops", props);
    // console.log("onclickmarker", marker);
    this.setState((state) => ({
      ...state,
      open: true,
      customerName: props?.title,
    }));

    if (props.id) {
      this.assetService.list({ aHId: props?.id }).then((response) => {
        // console.log("response", response);
        this.setState((state) => ({ ...state, assetData: response.data }));
      });
    }

    const mapdata = this.state.mapHoverDetail?.map((obj) => {
      if (obj.customerName == props.title) {
        return obj;
      }
    });
    this.setState((state) => ({ ...state, mapcontent: mapdata }));

    const findKey = this.state.marker.find((obj) => {
      return obj.title === props.title;
    });
    this.setState({
      activeMarker: marker,
      selectedPlace: props,
      showInfoWIndow: true,
      plantId: findKey.key,
    });
    // console.log("mapdata", mapdata);
  };

  style = [
    {
      featureType: "administrative",
      elementType: "all",
      stylers: [
        {
          visibility: "simplified",
        },
        {
          gamma: "1.00",
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "labels",
      stylers: [
        {
          weight: "1",
        },
      ],
    },
    {
      featureType: "administrative.locality",
      elementType: "labels",
      stylers: [
        {
          color: "#ba5858",
        },
        {
          visibility: "off",
        },
        {
          weight: "10",
        },
      ],
    },
    // {
    //   featureType: "administrative.neighborhood",
    //   stylers: [
    //     {
    //       visibility: "off",
    //     },
    //   ],
    // },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          visibility: "simplified",
        },
        {
          saturation: "-100",
        },
        {
          lightness: "80",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.attraction",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          visibility: "simplified",
        },
        {
          color: "#dddddd",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [
        {
          visibility: "simplified",
        },
        {
          color: "#dddddd",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "geometry",
      stylers: [
        {
          visibility: "simplified",
        },
        {
          color: "#eeeeee",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#ba5858",
        },
        {
          saturation: "-100",
        },
      ],
    },
    {
      featureType: "transit.station",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#ba5858",
        },
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "transit.station",
      elementType: "labels.icon",
      stylers: [
        {
          hue: "#ff0036",
        },
      ],
    },

    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },

    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#ba5858",
        },
      ],
    },
  ];
  constructor(props) {
    super(props);
  }
  _mapLoaded(mapProps, map) {
    map.setOptions({
      // styles: this.style,
      streetViewControl: false,
      disableDefaultUI: true,
      fullscreenControl: false,
      zoomControl: true,
      maxZoom: 16,
      // mapTypeId: "satellite",
      // scrollwheel: true,
    });
  }
  static getDerivedStateFromProps(props, state) {
    return { ...state, ...props };
  }

  onClose = () => {
    this.setState((state) => ({ ...state, open: false }));
  };
  render() {
    const { drawerHeight } = this.state;

    const bounds = new this.state.google.maps.LatLngBounds();
    if (this.state.marker) {
      for (let x of this.state.marker) {
        if (x.position) bounds.extend(x.position);
      }
    }

    return (
      <>
        <Map
          className="map"
          google={this.props.google}
          // initialCenter={this.state.initialCenter}
          containerStyle={{
            width: "100%",
            height: "65vh",
            position: "absolute",
            top: "3px",
            // width: "100%",
            // height: "68vh",
            // position: "relative",
            // border: "2px solid #fff",
            // zIndex: 0,
          }}
          bounds={bounds}
          onReady={(mapProps, map) => this._mapLoaded(mapProps, map)}
          onClick={this.handleMapClick}
          height={this.state.drawerHeight}
        >
          {this.state.marker?.map((e) => (
            // console.log("eee", e),
            <Marker
              {...e}
              // icon={{
              //   url: e.icon,
              //   anchor: new this.props.google.maps.Point(12, 12),
              //   scaledSize: new this.props.google.maps.Size(24, 24),
              // }}
              onClick={this.handleMarkerClick}
            />
          ))}

          <Drawer
            title={this.state?.customerName}
            placement="right"
            onClose={this.onClose}
            open={this.state?.open}
            width={"30%"}
            height={this.state.drawerHeight}
            // height={100}
            // bodyStyle={{ padding: 0, height: "100%" }}
            // footer={
            //   <div style={{ textAlign: "right" }}>Custom footer content</div>
            // }
          >
            {this.state?.assetData?.length ? (
              this.state?.assetData.map((e, index) => (
                <Card
                  style={{
                    // boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)",
                    marginBottom: "2%",
                    boxShadow: this.state.isBlinking
                      ? "rgba(255, 0, 0, 0.5) 0px 30px 60px -12px inset, rgba(255, 255, 255, 0.3) 0px 18px 36px -18px inset"
                      : "2px 2px 2px 2px #fff",
                    // border: this.state.isBlinking ? "2px solid red" : "2px solid #fff",
                    transition: "box-shadow 0.3s, border 0.5s", // Smooth transition
                  }}
                >
                  <Row gutter={10} style={{ display: "flex" }}>
                    <Col sm={6}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        {/* <Image src={e.appHierarchy.customer?.imageUrl} /> */}
                        <Avatar
                          src={remoteAsset(`images/${e.imagePath}`)}
                          shape="square"
                        />
                      </div>
                    </Col>
                    <Col sm={18}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <p>
                          Asset Name :
                          <Link
                            to={`/cbm/monitoring?ahId=${e.ahid}&assetId=${e.assetId}`}
                          >
                            {e.assetName}
                          </Link>
                        </p>
                      </div>
                    </Col>
                  </Row>
                </Card>
              ))
            ) : (
              <p>No asset data available</p>
            )}
          </Drawer>
        </Map>
      </>
    );
  }
}
export default memo(
  GoogleApiWrapper({
    apiKey: mapKey,
  })(Maps)
);
