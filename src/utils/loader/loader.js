import { Component } from "react";
import { RotatingLines } from "react-loader-spinner";
class Loader extends Component {
  state = { isLoading: false };
  static getDerivedStateFromProps(props, state) {
    return { ...state, ...props };
  }
  render() {
    return (
      <div
        style={{
          minHeight: "20px",
          position: "relative",
        }}
        {...this.props}
      >
        {this.state.isLoading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
              zIndex: 9,
            }}
          >
            <RotatingLines
              strokeColor="grey"
              strokeWidth="5"
              animationDuration="0.75"
              width="30"
              visible={true}
            />
          </div>
        )}

        {this.props.children}
      </div>
    );
  }
}

export default Loader;
