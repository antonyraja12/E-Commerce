import { Button, Col, Modal, Row, Select, Spin, message } from "antd";
import React from "react";
import ShiftDetailsAssetwiseService from "../../../services/shift-configuration/shift-details-assetwise-service";
import ShiftMasterService from "../../../services/shift-configuration/shift-master-service";
import PageList from "../../../utils/page/page-list";
import ShiftConfigForm from "./shift-config-form";
import ShiftPopup from "./shift-popup";
const { Option } = Select;

class ShiftConfigureTime extends PageList {
  formRef = React.createRef();
  shiftmasterService = new ShiftMasterService();
  service = new ShiftDetailsAssetwiseService();
  constructor(props) {
    super(props);
    this.state = {
      childElements: [],
      keyIndex: 0,
      editStatus: false,
      addStatus: true,
      modalOpen: false,
      modalId: "",
      loading: false,
    };
  }

  componentDidMount() {
    this.shiftmasterService.list().then((res) => {
      this.setState((state) => ({
        ...state,
        shift: res.data,
      }));
    });
    this.list({ shiftMasterAssetWiseId: this.props.id });
  }
  shiftDays = [
    {
      value: "MONDAY",
      label: "Monday",
    },
    {
      value: "TUESDAY",
      label: "Tuesday",
    },
    {
      value: "WEDNESDAY",
      label: "Wednesday",
    },
    {
      value: "THURSDAY",
      label: "Thursday",
    },
    {
      value: "FRIDAY",
      label: "Friday",
    },
    {
      value: "SATURDAY",
      label: "Saturday",
    },
    {
      value: "SUNDAY",
      label: "Sunday",
    },
  ];

  callBackSave = () => {
    this.list({ shiftMasterAssetWiseId: this.props.id });
    this.disableAdd();
  };
  editShiftDetails = (id) => {
    this.setState((state) => {
      return {
        ...state,
        editableId: id,
      };
    });
    this.showModal();
  };
  next = () => {
    if (this.state.res.length) {
      this.props.next();
    } else {
      message.info("Please add atleast one Shift");
    }
  };
  enableAdd = () => {
    this.setState((state) => ({
      ...state,
      isAdd: true,
      editableId: null,
    }));
  };
  disableAdd = () => {
    this.setState((state) => ({
      ...state,
      isAdd: false,
      editableId: null,
    }));
  };
  showModal = (id) => {
    this.setState({
      modalOpen: true,
      modalId: id,
      shiftPopup: true,
    });
  };
  closeModal = () => {
    this.setState({ shiftPopup: false, current: 0 });
    // this.list();
    this.callBackSave();
  };
  render() {
    const { childElements, result, isAdd, editableId, isLoading, shiftPopup } =
      this.state;
    return (
      <div>
        <Row gutter={[10, 10]}>
          <Col span={24}>
            <Spin spinning={this.state.loading}>
              {this.state.res?.map((e, i) => (
                <ShiftConfigForm
                  key={e.shiftDetailId}
                  callBackSave={this.callBackSave}
                  {...e}
                  shiftDetailId={e.shiftDetailId}
                  // disabled={editableId !== e.shiftDetailId}
                  disabled={editableId !== e.shiftDetailId ? true : false}
                  editId={(shiftDetailId) =>
                    this.editShiftDetails(shiftDetailId)
                  }
                  shift={this.state.shift}
                  shiftMasterAssetWiseId={this.props.id}
                  list={this.list}
                  disableAdd={this.disableAdd}
                />
              ))}

              {isAdd && (
                <ShiftConfigForm
                  shift={this.state.shift}
                  callBackSave={this.callBackSave}
                  shiftMasterAssetWiseId={this.props.id}
                  list={this.list}
                  disableAdd={this.disableAdd}
                />
              )}
            </Spin>
          </Col>

          <Col sm={{ span: 24 }} style={{ textAlign: "right" }}>
            {!!!editableId && (
              <Button disabled={isAdd} type="primary" onClick={this.showModal}>
                Add More
              </Button>
            )}
          </Col>
          <Col sm={22}>
            <Button onClick={() => this.props.prevPage()}>Back</Button>
          </Col>
          <Col style={{ marginLeft: "auto" }}>
            {!!!editableId && (
              <Button type="primary" disabled={isAdd} onClick={this.next}>
                Next
              </Button>
            )}
          </Col>
        </Row>
        <Modal
          open={shiftPopup}
          onCancel={this.closeModal}
          width={800}
          footer={null}
          destroyOnClose={true}
        >
          <ShiftPopup
            shiftMasterAssetWiseId={this.props.id}
            closeModal={this.closeModal}
            current={this.state.current}
            open={shiftPopup}
            shiftDetailId={editableId}
          />
        </Modal>
      </div>
    );
  }
}

export default ShiftConfigureTime;
