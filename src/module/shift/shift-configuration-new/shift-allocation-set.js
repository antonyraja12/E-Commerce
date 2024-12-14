import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  message,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ShiftAllocationService from "../../../services/shift-configuration/shift-allocation-service";
import ShiftMasterAssetWiseService from "../../../services/shift-configuration/shift-master-assetwise-service";

function ShiftAllocationSet() {
  const [form] = Form.useForm();
  const [mainForm] = Form.useForm();
  const date = Form.useWatch("date", form);

  const [dates, setDates] = useState([]);

  const [dataSource, setDataSource] = useState({});

  useEffect(() => {
    const service = new ShiftMasterAssetWiseService();
    service
      .list()
      .then(({ data }) => {
        let dataSrc = {};
        for (let e of data) {
          for (let x of e.shiftDetailAssetWises) {
            let options = { value: x.shiftDetailId, label: x.shiftName };
            if (!dataSrc[x.shiftDay]) dataSrc[x.shiftDay] = [options];
            else dataSrc[x.shiftDay] = [...dataSrc[x.shiftDay], options];
          }
          setDataSource((state) => ({
            ...state,
            [e.shiftMasterAssetWiseId]: dataSrc,
          }));
        }

        mainForm.setFieldsValue({
          data: data?.map((e) => ({
            shiftMasterAssetWiseId: e.shiftMasterAssetWiseId,
            name: e.name,
            sunday: [],
            sundayDate: null,
            monday: [],
            mondayDate: null,
            tuesday: [],
            tuesdayDate: null,
            wednesday: [],
            wednesDate: null,
            thursday: [],
            thursdayDate: null,
            friday: [],
            fridayDate: null,
            saturday: [],
            saturdayDate: null,
          })),
        });
      })
      .finally(() => {});
  }, []);
  const fetchAllocatedShifts = async (startDate, endDate) => {
    const service = new ShiftAllocationService();
    let { data } = await service.list({
      startDate: dayjs(startDate).toISOString(),
      endDate: dayjs(endDate).toISOString(),
    });

    let res = data.reduce((c, e, i, a) => {
      const { shiftDetailId, shiftMasterAssetWiseId, shiftDate } = e;
      if (!c[shiftMasterAssetWiseId]) {
        c[shiftMasterAssetWiseId] = {
          shiftMasterAssetWiseId,
        };
      }
      let day = dayjs(e.shiftDate).format("dddd").toLowerCase();
      if (c[shiftMasterAssetWiseId][day]) {
        c[shiftMasterAssetWiseId] = {
          ...c[shiftMasterAssetWiseId],
          [day]: [...c[shiftMasterAssetWiseId][day], shiftDetailId],
        };
      } else {
        c[shiftMasterAssetWiseId] = {
          ...c[shiftMasterAssetWiseId],
          [day]: [shiftDetailId],
          [`${day}Date`]: shiftDate,
        };
      }

      return c;
    }, {});

    return res;
  };

  useEffect(() => {
    // console.log("Trig", date.toISOString());

    setDates(() => {
      const start = dayjs(date).startOf("w");
      const end = dayjs(date).endOf("w");
      let dates = [];
      let st = start;
      while (st.isBefore(end)) {
        dates.push(st);
        st = st.add(1, "d");
      }
      return dates;
    });
  }, [date]);

  useEffect(() => {
    // for (let i in mainForm.getFieldValue("data")) {
    let obj = {};
    for (let date of dates) {
      let key = `${date.format("dddd").toLowerCase()}Date`;
      obj[key] = date;
      // console.log(["data", i, key], date.format("DD-MM-YYYY"));

      // mainForm.setFieldValue(["data", i, key], date);
    }
    // }
    console.log(obj);

    fetchAllocatedShifts(dates[0], dates[dates.length - 1]).then((data) => {
      let rows = mainForm.getFieldValue("data");
      mainForm.setFieldsValue({
        data: rows?.map((e, index) => {
          let shiftMasterAssetWiseId = e.shiftMasterAssetWiseId;
          let resObj = data[shiftMasterAssetWiseId] ?? [];
          return {
            ...e,
            ...obj,
            sunday: resObj["sunday"],
            monday: resObj["monday"],
            tuesday: resObj["tuesday"],
            wednesday: resObj["wednesday"],
            thursday: resObj["thursday"],
            friday: resObj["friday"],
            saturday: resObj["saturday"],
          };
        }),
      });
    });
  }, [dates]);

  const getValue = (name) => {
    return mainForm.getFieldValue(["data", ...name]);
  };
  const onFinish = (value) => {
    const service = new ShiftAllocationService();
    service.bulkAdd(value.data).then(({ data }) => {
      // resetFilter();
      message.success(data.message);
    });
  };

  return (
    <Card title="Shift Allocation">
      <Form form={form} layout="vertical" initialValues={{ date: dayjs() }}>
        <Row gutter={[10, 10]}>
          <Col sm={6}>
            <Form.Item name="date" label="Date">
              <DatePicker format="DD-MM-YYYY" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Form form={mainForm} onFinish={onFinish}>
        <Row gutter={[10, 10]} justify="end">
          <Col span={24}>
            <Form.List name="data">
              {(fields, { add, remove }) => (
                <table className="parameter-table">
                  <thead>
                    <tr>
                      <th>Set</th>
                      {dates.map((date) => (
                        <th>
                          <>
                            {date.format("dddd")} <br />
                            {date.format("DD-MM-YYYY")}
                          </>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map(({ name }) => (
                      <tr>
                        <td>
                          <Form.Item
                            name={[name, "shiftMasterAssetWiseId"]}
                            noStyle
                            hidden
                          >
                            <Input style={{ width: "100%" }} />
                          </Form.Item>
                          <Form.Item name={[name, "name"]} noStyle hidden>
                            <Input
                              style={{ width: "100%" }}
                              variant="borderless"
                            />
                          </Form.Item>

                          {getValue([name, "name"])}
                        </td>
                        {dates?.map((date) => (
                          <td>
                            <Form.Item
                              name={[
                                name,
                                `${date.format("dddd").toLowerCase()}Date`,
                              ]}
                              hidden
                            >
                              <DatePicker />
                            </Form.Item>
                            <Form.Item
                              name={[name, date.format("dddd").toLowerCase()]}
                              noStyle
                            >
                              <Checkbox.Group
                                options={
                                  dataSource[
                                    getValue([name, "shiftMasterAssetWiseId"])
                                  ][date.format("dddd").toUpperCase()] ?? []
                                }
                              />
                            </Form.Item>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Form.List>
          </Col>

          <Col>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}

export default ShiftAllocationSet;
