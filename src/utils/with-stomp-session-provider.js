import React from "react";
import { StompSessionProvider } from "react-stomp-hooks";
import { webSocketUrl } from "../helpers/url";
const withStompSessionProvider = (WrappedComponent) => {
  return (props) => (
    <StompSessionProvider url={webSocketUrl()}>
      <WrappedComponent {...props} />
    </StompSessionProvider>
  );
};
export default withStompSessionProvider;
