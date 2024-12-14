import React from "react";
import { Modal, Button } from "antd";
import { ChromePicker } from "react-color";

const ColorPickerModal = ({ visible, color, onCancel, onColorChange }) => {
  return (
    <Modal
      title="Pick a Color"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="ok"
          type="primary"
          onClick={() => {
            onColorChange(color);
            onCancel();
          }}>
          OK
        </Button>,
      ]}>
      <ChromePicker
        color={color}
        onChange={(newColor) => onColorChange(newColor.hex)}
      />
    </Modal>
  );
};

export default ColorPickerModal;
