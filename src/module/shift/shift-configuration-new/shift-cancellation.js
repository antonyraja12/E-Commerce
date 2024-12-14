import { Form, Input, message, Button, DatePicker } from "antd";
import ShiftAllocationService from "../../../services/shift-configuration/shift-allocation-service";
import { forwardRef, useEffect, useState } from "react";
import { dateFormat, dateTimeFormat } from "../../../helpers/url";
import dayjs from "dayjs";
function ShiftCancellation(props, ref) {
  const { shiftAllocationId, afterSave } = props;
  const [saving, setSaving] = useState(false);
  const [shift, setShift] = useState({ loading: false, data: null });
  const onFinish = (value) => {
    setSaving(true);
    const service = new ShiftAllocationService();
    service
      .cancel(shiftAllocationId, value)
      .then(({ data }) => {
        message.success("Successfully updated");
        if (afterSave && typeof afterSave === "function") {
          afterSave();
        }
      })
      .finally(() => {
        setSaving(false);
      });
  };
  useEffect(() => {
    const service = new ShiftAllocationService();
    setShift((state) => ({ ...state, loading: true }));
    service
      .retrieve(shiftAllocationId)
      .then(({ data }) => {
        setShift((state) => ({ ...state, data }));
      })
      .finally(() => {
        setShift((state) => ({ ...state, loading: false }));
      });
  }, [shiftAllocationId]);
  return (
    <>
      <Form
        onFinish={onFinish}
        ref={ref}
        labelAlign="left"
        labelCol={{ sm: 24, md: 6 }}
        wrapperCol={{ sm: 24, md: 18 }}
      >
        <Form.Item hidden label="Asset Name">
          <Input value={shift.data?.asset?.assetName} disabled />
        </Form.Item>
        <Form.Item label="Shift Name">
          <Input value={shift.data?.shiftName} disabled />
        </Form.Item>
        <Form.Item label="Shift Date">
          <DatePicker
            value={dayjs(shift.data?.shiftDate)}
            format="DD-MM-YYYY"
            disabled
          />
        </Form.Item>
        <Form.Item label="Duration">
          <DatePicker.RangePicker
            value={[dayjs(shift.data?.startDate), dayjs(shift.data?.endDate)]}
            format="DD-MM-YYYY hh:mm:ss A"
            disabled
          />
        </Form.Item>

        <Form.Item name="reason" label="Reason" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item hidden>
          <Button htmlType="submit" />
        </Form.Item>
      </Form>
    </>
  );
}

export default forwardRef(ShiftCancellation);
