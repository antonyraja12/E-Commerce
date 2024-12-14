import React, { useEffect, useState } from "react";
import {
  Upload,
  Button,
  Table,
  Space,
  Input,
  Form,
  Select,
  Badge,
  InputNumber,
  Col,
  Row,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  DownloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Page from "../../../utils/page/page";
import { withRouter } from "../../../utils/with-router";
import { withAuthorization } from "../../../utils/with-authorization";
import DefectChecklistService from "../../../services/track-and-trace-service/defect-checklist-service";
import CustomizeModel from "../utils/customizeModel";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import useCrudOperations from "../utils/useCrudOperation";
import { EditButton } from "../../../utils/action-button/action-button";
import { hasAllDirectives } from "@apollo/client/utilities";

const { Option } = Select;

const DefectChecklist = (props) => {
  const { access } = props;
  const defectChecklistService = new DefectChecklistService();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [defectChecklist, setDefectCheckList] = useState("");

  const {
    data,
    selectedRowKeys,
    setSelectedRowKeys,
    handleDelete,
    handleDownload,
    editingKey,
    setEditingKey,
    form,
    save,
    cancel,
    setData,
    handleUpload,
  } = useCrudOperations(defectChecklistService);
  useEffect(() => {
    setDefectCheckList(data);
  }, [data]);
  const isEditing = (record) => record.defectId === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.defectId);
  };

  const columns = [
    {
      dataIndex: "defectSequence",
      key: "defectSequence",
      title: "Seq.no",
      width: 50,
    },
    {
      dataIndex: "defectName",
      key: "defectName",
      title: "Defect Name",
      width: 250,
      editable: true,
    },
    {
      dataIndex: "defectType",
      key: "defectType",
      title: "Type",
      width: 150,
      editable: true,
      render: (value) => {
        let text =
          value === "VISUAL_INSPECTION"
            ? "Visual Inspection"
            : value === "GOEPEL"
            ? "Goepel"
            : " ";
        return text;
      },
    },

    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: 150,
      editable: true,
      render: (value) => (
        <Badge
          color={value ? "green" : "#cccccc"}
          text={value ? "Active" : "Inactive"}
        />
      ),
    },
    {
      title: "Action",
      key: "actions",
      width: 50,
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button
              icon={<CheckOutlined />}
              type="primary"
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              onClick={() => save(record.defectId)}
            />
            <Button
              icon={<CloseOutlined />}
              type="primary"
              danger
              onClick={cancel}
            />
          </Space>
        ) : (
          <Space>
            {
              <EditButton
                onClick={() => edit(record)}
                disabled={editingKey !== ""}
              />
            }
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "status" ? "select" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    inputType,
    editing,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[{ required: true, message: `Please Input ${title}!` }]}
          >
            {dataIndex === "status" && inputType === "select" ? (
              <Select>
                <Option value={true}>Active</Option>
                <Option value={false}>Inactive</Option>
              </Select>
            ) : dataIndex === "defectSequence" ? (
              <InputNumber min={1} />
            ) : dataIndex === "defectType" ? (
              <Select>
                <Option value={"GOEPEL"}>Goepel</Option>
                <Option value={"VISUAL_INSPECTION"}>Visual Inspection</Option>
              </Select>
            ) : (
              <Input />
            )}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const sortedData = [...defectChecklist].sort(
    (a, b) => a.defectSequence - b.defectSequence
  );

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setData((prevData) => {
        const activeIndex = prevData.findIndex((i) => i.defectId === active.id);
        const overIndex = prevData.findIndex((i) => i.defectId === over?.id);
        const newData = arrayMove(prevData, activeIndex, overIndex);

        const updatedData = newData.map((item, index) => ({
          ...item,
          defectSequence: index + 1,
        }));

        const backendData = updatedData.map((item) => ({
          defectId: item.defectId,
          defectSequence: item.defectSequence,
        }));
        sendToBackend(backendData);

        return updatedData;
      });
    }
  };

  const sendToBackend = (data) => {
    defectChecklistService.updateSequence(data);
  };

  const EditableRow = (props) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: props["data-row-key"],
    });
    const style = {
      ...props.style,
      transform: CSS.Translate.toString(transform),
      transition,
      cursor: "move",
    };
    return (
      <tr
        {...props}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      />
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );
  const filter = (e) => {
    let s = e.target.value.toLowerCase();
    let result = data.filter((e) => {
      return e.defectName?.toLowerCase().includes(s);
    });
    setSearchValue(s);
    setDefectCheckList(result);
  };
  const hasAccess = (permission) => {
    return access?.[0]?.includes(permission);
  };
  return (
    <Page
      action={
        <Space>
          {
            <Button
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              disabled={selectedRowKeys.length === 0}
            >
              Delete
            </Button>
          }
          {
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleDownload("defect checklist")}
            >
              Download
            </Button>
          }
          {
            <Button
              type="primary"
              onClick={() => setIsModalVisible(true)}
              icon={<UploadOutlined />}
            >
              Upload
            </Button>
          }
        </Space>
      }
    >
      <Form form={form} component={false}>
        <Row justify="space-between">
          <Col span={7}>
            <Form>
              <Form.Item>
                <Input
                  prefix={<SearchOutlined style={{ color: "#c4c4c4" }} />}
                  value={searchValue}
                  onChange={filter}
                  placeholder={"Search..."}
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <DndContext
          sensors={sensors}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={sortedData.map((i) => i.defectId)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              components={{
                body: {
                  row: EditableRow,
                  cell: EditableCell,
                },
              }}
              rowKey="defectId"
              columns={mergedColumns}
              dataSource={sortedData}
              bordered
              size="small"
              rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys,
              }}
            />
          </SortableContext>
        </DndContext>
      </Form>

      <CustomizeModel
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        handleUpload={handleUpload}
      />
    </Page>
  );
};

export default withRouter(withAuthorization(DefectChecklist));
