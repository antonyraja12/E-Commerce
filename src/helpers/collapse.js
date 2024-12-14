import React, { Component } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Checkbox, Input, Space, Typography } from "antd";
const { Text } = Typography;

class CustomCollapsePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };
  }

  handleToggleCollapse = () => {
    this.setState((prevState) => ({
      collapsed: !prevState.collapsed,
    }));
  };

  render() {
    const { title, children, style } = this.props;
    const { collapsed } = this.state;

    const panelContainerStyle = {
      // border: '1px solid #ccc',
      borderRadius: "4px",
      marginBottom: "10px",
      overflow: "hidden",
    };

    const panelHeaderStyle = {
      // backgroundColor: '#f0f0f0',
      padding: "10px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      // borderRadius: '4px',
    };

    const panelContentStyle = {
      padding: "10px",
      display: collapsed ? "none" : "block",
    };

    return (
      <div style={{ ...panelContainerStyle, ...style }}>
        <div style={panelHeaderStyle} onClick={this.handleToggleCollapse}>
          <span>{title}</span>
          <span>
            {collapsed ? (
              <DownOutlined style={{ border: "0px solid #ccc" }} />
            ) : (
              <UpOutlined style={{ border: "0px solid #ccc" }} />
            )}
          </span>
        </div>
        <div style={panelContentStyle}>{children}</div>
      </div>
    );
  }
}

export default CustomCollapsePanel;
