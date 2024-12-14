import { Component } from "react";
import { InfinitySpin } from "react-loader-spinner";
class PageLoader extends Component {
  state = {};

  render() {
    return (
      <div
        style={{
          height: "80vh",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <InfinitySpin width="200" color="grey" />
      </div>
    );
  }
}

export default PageLoader;
