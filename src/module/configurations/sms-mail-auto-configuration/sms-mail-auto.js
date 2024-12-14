import RoleService from "../../../services/role-service";
import PageList from "../../../utils/page/page-list";
import {
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../../utils/action-button/action-button";

import Page from "../../../utils/page/page";
import { AddButton } from "../../../utils/action-button/action-button";
import { Table, Checkbox } from "antd";
import { withAuthorization } from "../../../utils/with-authorization";
import { AntDesignOutlined, SearchOutlined } from "@ant-design/icons";
import SmsMailAutoService from "../../../services/module-config-service";
import ModuleNameService from "../../../services/module-name-service";

class SmsMailAuto extends PageList {
  service = new SmsMailAutoService();
  moduleService = new ModuleNameService();
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    try {
      // Fetch module names from the ModuleNameService
      const moduleNames = await this.moduleService.getModuleNames();
      this.setState({ moduleNames });
    } catch (error) {
      // Handle error if any
      console.error("Error fetching module names:", error);
    }

    this.list();
  }

  render() {
    const { moduleNames } = this.state;

    const columns = [
      {
        dataIndex: "sno",
        key: "sno",
        title: "S.No",
        width: 80,
        align: "left",
      },
      {
        dataIndex: "moduleDetailsId",
        key: "moduleDetailsId",
        title: "Module Name",
        render: (record) => {
          // console.log("record",record)
          const { moduleDetailsId } = record;
          const moduleName = moduleNames.find(
            (module) => module.moduleDetailsId === moduleDetailsId
          );
          return moduleName ? moduleName.moduleName : "N/A";
        },
      },
      {
        dataIndex: "smsAuto",
        key: "smsAuto",
        title: "Sms Auto",
        render: (smsAuto) => (
          <Checkbox
            checked={smsAuto}
            onChange={(e) =>
              this.handleCheckboxChange("smsAuto", e.target.checked)
            }
          />
        ),
      },

      {
        dataIndex: "smsManual",
        key: "smsManual",
        title: "Sms Manual",
        render: (smsManual) => (
          <Checkbox
            checked={smsManual}
            onChange={(e) =>
              this.handleCheckboxChange("smsManual", e.target.checked)
            }
          />
        ),
      },
      {
        dataIndex: "mailAuto",
        key: "mailAuto",
        title: "Mail Auto",
        render: (mailAuto) => (
          <Checkbox
            checked={mailAuto}
            onChange={(e) =>
              this.handleCheckboxChange("mailAuto", e.target.checked)
            }
          />
        ),
      },
      {
        dataIndex: "mailManual",
        key: "mailManual",
        title: "Mail Manual",
        render: (mailManual) => (
          <Checkbox
            checked={mailManual}
            onChange={(e) =>
              this.handleCheckboxChange("mailManual", e.target.checked)
            }
          />
        ),
      },
    ];

    return (
      <Page title={this.title}>
        <Table
          rowKey="moduleId"
          pagination={{
            showSizeChanger: true,
            //showQuickJumper: true,
            size: "default",
          }}
          scroll={{ x: 980 }}
          loading={this.state.isLoading}
          dataSource={this.state.rows}
          columns={columns} // Use the updated columns with the 'moduleName' rendering
          size="middle"
        />
      </Page>
    );
  }
}

export default SmsMailAuto;
