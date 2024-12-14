import { Button, Card, Dropdown, Flex, Modal, Typography, message } from "antd";
import { EllipsisOutlined, MoreOutlined } from "@ant-design/icons";
import { renderElement } from "./filter-render-fn";
import { createRef, useState } from "react";
import FilterForm from "./filter-form";
import FilterService from "../services/filter-service";

function FilterElementPanel(props) {
  const ref = createRef();
  const [open, setOpen] = useState(false);
  const items = [
    {
      key: "properties",
      label: "Properties",
    },
    {
      key: "delete",
      label: "Delete",
    },
  ];
  const closeModel = () => {
    setOpen(false);
  };
  const handleMenuClick = (e) => {
    if (e.key === "properties") setOpen(true);
    else if (e.key === "delete")
      Modal.confirm({
        title: "Delete Field",
        content: "Are you sure to delete this field ?",
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
          const service = new FilterService();
          return service
            .delete(props.filterId)
            .then(() => {
              props.refresh();
            })
            .catch((err) => {
              message.error(err.message);
            });
        },
      });
  };
  const afterSubmit = () => {
    props.refresh();
    closeModel();
  };
  const submitForm = () => {
    ref.current?.submit();
  };

  const onChange = (value) => {
    const service = new FilterService();
    service.patch({ label: value }, props.filterId).then(({ data }) => {
      props.refresh();
    });
  };
  return (
    <>
      <Card
        size="small"
        // extra={
        //   <>
        //     <Dropdown
        //       menu={{
        //         items,
        //         onClick: handleMenuClick,
        //       }}
        //     >
        //       <Button size="small" type="text" icon={<MoreOutlined />} />
        //     </Dropdown>
        //   </>
        // }
        // title={<Typography.Text>{props.element}</Typography.Text>}
        styles={{
          body: { borderRadius: 0, padding: 0 },
          header: {
            backgroundColor: "#eeeeee",
            borderRadius: 0,
            // height: 25,
            minHeight: "auto",
            padding: "0px 5px",
            marginTop: 5,
          },
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: props.width,
          }}
        >
          <Flex>
          <div style={{borderRight:"solid rgba(238, 238, 238, 1) 1px",padding:"10px"}}>
            <Typography.Text
              editable={{
                onChange: onChange,

                text: props.label,
                // editing:true,
                autoSize: true,
              }}
            >
              {props.label}
            </Typography.Text>

            {renderElement(props.element)}
          </div>
          <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}><Dropdown
            menu={{
              items,
              onClick: handleMenuClick,
            }}
            
          >
            <Button size="small" type="text" icon={<EllipsisOutlined />} />
          </Dropdown></div>
          </Flex>
        </div>
      </Card>

      <Modal
        title="Properties"
        onOk={submitForm}
        open={open}
        onCancel={closeModel}
        destroyOnClose
      >
        <FilterForm
          afterSubmit={afterSubmit}
          ref={ref}
          data={props}
          id={props.filterId}
        />
        {/* {JSON.stringify(props)} */}
      </Modal>
    </>
  );
}

export default FilterElementPanel;
