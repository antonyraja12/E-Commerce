import { Col, Row, Steps } from "antd";
import React, { Component } from "react";
import BreakStepper from "./break-stepper";
import ShiftStepper from "./shift-stepper";

class ShiftPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: true,
      currentStep: 0,
    };
  }
  saveShiftData = (shiftMasterDetails, shiftDuration, values) => {
    // console.log("shiftMasterDetails111", shiftMasterDetails,values);
    this.setState((state) => ({
      ...state,
      data: shiftMasterDetails,
      shiftDuration: shiftDuration,
      startTime: values.startTime,
      endTime: values.endTime,
      dayEnd: values.dayEnd,
      dayStart: values.dayStart,
      shiftMasterId: values.shiftMasterId,
      shiftName: values.shiftName,
    }));
  };
  handleNext = () => {
    const { currentStep } = this.state;
    const totalSteps = 1;
    if (currentStep < totalSteps) {
      this.setState((prevState) => ({
        currentStep: prevState.currentStep + 1,
      }));
    }
  };

  previousvalue = (v) => {
    // console.log("prev", v);
    this.setState((state) => ({ ...state, prevvalue: v }));
  };

  handlePrev = () => {
    const { currentStep } = this.state;
    if (currentStep > 0) {
      this.setState((prevState) => ({
        currentStep: prevState.currentStep - 1,
      }));
    }
  };

  renderContent = () => {
    const { currentStep } = this.state;
    switch (currentStep) {
      case 0:
        return (
          <ShiftStepper
            previousvaluefunc={(v) => this.previousvalue(v)}
            previousvalue={this.state.prevvalue}
            onNext={this.handleNext}
            saveShiftData={this.saveShiftData}
            closeModal={this.props.closeModal}
            shiftMasterAssetWiseId={this.props.shiftMasterAssetWiseId}
            open={this.props.open}
            shiftDetailId={this.props.shiftDetailId}
          />
        );
      case 1:
        return (
          <BreakStepper
            shiftMasterAssetWiseId={this.props.shiftMasterAssetWiseId}
            shiftDayEnd={this.state.dayEnd}
            shiftDayStart={this.state.dayStart}
            shiftStartTime={this.state.startTime}
            shiftEndTime={this.state.endTime}
            shiftMasteDetails={this.state.data}
            shiftMasterId={this.state.shiftMasterId}
            shiftDetailId={this.props.shiftDetailId}
            shiftDuration={this.state.shiftDuration}
            shiftName={this.state.shiftName}
            prev={this.handlePrev}
            closeModal={() => {
              this.props.closeModal();
              this.setState({ currentStep: this.props.current });
            }}
            onFinish={this.props.onFinish}
            callBackSave={this.props.callBackSave}
          />
        );
    }
  };

  render() {
    const { isModalOpen, currentStep } = this.state;
    return (
      <div>
        <Row gutter={[20, 10]}>
          <Col sm={24}>
            <Steps progressDot current={currentStep}>
              <Steps.Step title="Shifts" />
              <Steps.Step title="Breaks" />
            </Steps>
          </Col>
          <Col span={24}>{this.renderContent()}</Col>
        </Row>
      </div>
    );
  }
}

export default ShiftPopup;
