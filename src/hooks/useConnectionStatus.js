import { Flex, Typography } from "antd";
import { PiPlugsConnected, PiPlugsLight } from "react-icons/pi";
export const useConnectionStatus = (connected) => {
  if (connected) {
    return (
      <Typography.Text type="success" strong>
        <Flex align="center" gap={10}>
          <PiPlugsConnected
            style={{
              fontSize: "2em",
              transform: "rotate(45deg)",
            }}
          />
          Connected
        </Flex>
      </Typography.Text>
    );
  } else {
    return (
      <Typography.Text type="danger" strong>
        <Flex align="center" gap={10}>
          <PiPlugsLight
            style={{
              fontSize: "2em",
              transform: "rotate(45deg)",
            }}
          />
          Disconnected
        </Flex>
      </Typography.Text>
    );
  }
};

export const useConnectionStatusIcon = (connected, name) => {
  if (connected) {
    return (
      <Typography.Text strong>
        <Flex align="center" gap={10}>
          <Typography.Text style={{ lineHeight: 0 }} type="success">
            <PiPlugsConnected
              style={{
                fontSize: "2em",
                transform: "rotate(45deg)",
              }}
            />
          </Typography.Text>
          {name}
        </Flex>
      </Typography.Text>
    );
  } else {
    return (
      <Typography.Text strong>
        <Flex align="center" gap={10}>
          <Typography.Text style={{ lineHeight: 0 }} type="danger">
            <PiPlugsLight
              style={{
                fontSize: "2em",
                transform: "rotate(45deg)",
              }}
            />
          </Typography.Text>
          {name}
        </Flex>
      </Typography.Text>
    );
  }
};
