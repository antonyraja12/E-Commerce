import React from "react";
import PageList from "../../../utils/page/page-list";
import { Row, Col, Result, Spin } from "antd";
import MailConfiguration from "./email-config";
import SmsConfiguration from "./sms-config";
import MailConfigurationService from "../../../services/mail-configuration-service";
import SmsConfigurationService from "../../../services/sms-configuration-service";
import Page from "../../../utils/page/page";
import { withAuthorization } from "../../../utils/with-authorization";
import { withRouter } from "../../../utils/with-router";

class SmsAndMailConfiguration extends PageList {
  constructor(props) {
    super(props);
    this.title = "Sms / Mail Configuration";
    this.service = new MailConfigurationService();
    this.smsservice = new SmsConfigurationService();
  }

  render() {
    // const { update } = this.props;
    const { access, isLoading } = this.props;
    // console.log("access", access[0].length);
    if (isLoading) {
      return <Spin style={{ marginTop: "250px", marginLeft: "600px" }} />;
    }

    return (
      <Spin spinning={isLoading}>
        <Page>
          <Row gutter={[16, 16]}>
            <Col sm={12}>
              <MailConfiguration />
            </Col>

            <Col sm={12}>
              {/* <SmsConfiguration update={update} /> */}
              <SmsConfiguration />
            </Col>
          </Row>
        </Page>
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(SmsAndMailConfiguration));
