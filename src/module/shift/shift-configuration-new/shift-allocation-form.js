import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Form,
  Input,
  message,
  Select,
} from "antd";
import dayjs from "dayjs";
// import { useAsset } from "../../../hooks/useAsset";
import { useShift } from "../../../hooks/useShift";
import ShiftAllocationService from "../../../services/shift-configuration/shift-allocation-service";
import { forwardRef, useEffect, useState } from "react";
import ShiftMasterAssetWiseService from "../../../services/shift-configuration/shift-master-assetwise-service";

function ShiftAllocationForm(props, ref) {
  // const [assetLoading, assetData] = useAsset();
  const [shiftLoading, shiftData] = useShift();
  const [shiftMasterAssetId, setShiftMasterAssetId] = useState(null);

  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const getShiftMasterAssetId = () => {
    const service = new ShiftMasterAssetWiseService();
    service.list().then((response) => {
      const data = response?.data[0]?.shiftMasterAssetWiseId;
      setShiftMasterAssetId(data);
      form.setFieldValue({ shiftMasterAssetWiseId: data });
    });
  };
  useEffect(() => getShiftMasterAssetId(), []);
  const onFinish = (value) => {
    const service = new ShiftAllocationService();
    const shiftMasterAssetWiseId = form.setFieldValue("shiftMasterAssetWiseId");
    const values = { ...value, shiftMasterAssetWiseId: shiftMasterAssetId };
    setSaving(true);
    service
      .add(values)
      .then((res) => {
        props.afterSave();
        if (res.status == 200) {
          message.success("Shift allocated successfully");
        }
      })
      .finally(() => {
        setSaving(false);
      });
  };
  return (
    <Form
      ref={ref}
      form={form}
      layout="horizontal"
      labelAlign="left"
      labelCol={{ md: 8 }}
      wrapperCol={{ md: 16 }}
      onFinish={onFinish}
      initialValues={{
        nextDay: false,
      }}
    >
      {/* <Form.Item
        name="assetIds"
        label="Assets"
        // rules={[{ required: true }]}
      >
        <Select
          mode="tags"
          loading={assetLoading}
          options={assetData.options}
        />
      </Form.Item> */}
      <Form.Item name="shiftMasterAssetWiseId" hidden>
        <Input />
      </Form.Item>
      <Form.Item
        name="shiftMasterId"
        label="Shift"
        rules={[{ required: true }]}
      >
        <Select loading={shiftLoading} options={shiftData.options} />
      </Form.Item>

      <Form.Item name="date" label="Date" rules={[{ required: true }]}>
        <DatePicker format="DD-MM-YYYY" />
      </Form.Item>
      <Form.Item
        name="nextDay"
        label="Start On Next Day"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
      <Form.Item hidden>
        <Button htmlType="submit">Save</Button>
      </Form.Item>
    </Form>
  );
}

export default forwardRef(ShiftAllocationForm);
