import React from "react";

import { withRouter } from "../../utils/with-router";
import { Link } from "react-router-dom";

function MachinePage() {
  return (
    <>
      <Link to="../dashboard">
        <img width={"100%"} src="/daifuku-machine.png" alt="No preview" />
      </Link>
    </>
  );
}
export default withRouter(MachinePage);
