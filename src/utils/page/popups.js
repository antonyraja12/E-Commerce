import { Modal } from "antd";

function Popups(props) {
  return (
    <Modal destroyOnClose {...props}>
      {props.children}
    </Modal>
  );
}

export default Popups;
