import {
  ExclamationCircleOutlined,
  PlusOutlined,
  EditOutlined,
  FileSearchOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  UnorderedListOutlined,
  FundViewOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Tooltip, Button, Modal } from "antd";

const { confirm } = Modal;
const showDeleteConfirm = (okCallBack) => {
  confirm({
    title: "Are you sure to delete this entry?",
    icon: <ExclamationCircleOutlined />,
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    onOk() {
      okCallBack();
    },

    onCancel() {
      // console.log("Cancel");
    },
  });
};
function AddButton(props) {
  return (
    <Button
      // role="button"
      // name="add"
      type="primary"
      icon={<PlusOutlined />}
      {...props}
      hidden={props.hidden}
    >
      Add
    </Button>
  );
}
// function AddButtonSmall(props) {
//   return (
//     <Tooltip title="Add">
//       <Button type="text" icon={<PlusOutlined />} {...props} />
//     </Tooltip>
//   );
// }
function EditButton(props) {
  return (
    <Tooltip title="Edit">
      <Button
        data-testid="edit-button"
        name="edit"
        type="text"
        hidden={props.hidden}
        icon={<EditOutlined />}
        {...props}
      />
    </Tooltip>
  );
}
function open(props) {
  return (
    <Tooltip title="open">
      <Button
        type="text"
        hidden={props.hidden}
        // icon={<EditOutlined />}
        {...props}
      />
    </Tooltip>
  );
}
function ViewButton(props) {
  // console.log("props", props);
  return (
    <Tooltip title="View">
      <Button
        data-testid="view-button"
        name="view"
        type="text"
        hidden={props.hidden}
        icon={<FileSearchOutlined />}
        {...props}
      />
    </Tooltip>
  );
}
function NewViewButton(props) {
  return (
    <Tooltip title="View">
      <Button
        type="text"
        style={{ color: "green" }}
        icon={<FundViewOutlined style={{ color: "green" }} />}
        {...props}
      />
    </Tooltip>
  );
}
function DeleteButton(props) {
  return (
    <Tooltip title="Delete">
      <Button
        data-testid="delete-button"
        type="text"
        icon={<DeleteOutlined />}
        onClick={() => showDeleteConfirm(props.onClick)}
        // {...props}
      />
    </Tooltip>
  );
}
function BackButton(props) {
  return <Button type="text" icon={<ArrowLeftOutlined />} {...props} />;
}

function ListViewButton(props) {
  return (
    <Button type="primary" icon={<UnorderedListOutlined />} {...props}>
      View
    </Button>
  );
}
function UploadButton(props) {
  return (
    <Tooltip title="Upload">
      <Button type="text" icon={<UploadOutlined />} {...props} />
    </Tooltip>
  );
}
export {
  AddButton,
  // AddButtonSmall,
  EditButton,
  ViewButton,
  DeleteButton,
  UploadButton,
  BackButton,
  ListViewButton,
  showDeleteConfirm,
};
