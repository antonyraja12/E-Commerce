import {
  Card,
  DatePicker,
  Form,
  Row,
  Col,
  Select,
  Checkbox,
  Input,
  Button,
  Dropdown,
  Popover,
  message,
} from "antd";
import { useEffect, useState } from "react";
import ShiftMasterAssetWiseService from "../../../services/shift-configuration/shift-master-assetwise-service";
import dayjs from "dayjs";
import ShiftAllocationService from "../../../services/shift-configuration/shift-allocation-service";

function ShiftAllocation() {
  const [form] = Form.useForm();
  const [mainForm] = Form.useForm();
  const date = Form.useWatch("date", form);
  const [shiftDetailAssetWises, setShiftDetailAssetWises] = useState([]);
  const [shiftMasterAssetWiseOption, setShiftMasterAssetWiseOption] = useState({
    loading: false,
    options: [],
  });
  const [dates, setDates] = useState([]);
  const [asset, setAsset] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [assetIds, setAssetIds] = useState([]);
  const [selectAll, setSelectAll] = useState({
    assetIds: null,
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  });

  useEffect(() => {
    const service = new ShiftMasterAssetWiseService();
    setShiftMasterAssetWiseOption((state) => ({ ...state, loading: true }));
    service
      .list()
      .then(({ data }) => {
        const options = data.map((e) => ({
          label: e.name,
          value: e.shiftMasterAssetWiseId,
        }));
        setShiftMasterAssetWiseOption((state) => ({
          ...state,
          options: options,
        }));
      })
      .finally(() => {
        setShiftMasterAssetWiseOption((state) => ({
          ...state,
          loading: false,
        }));
      });
  }, []);
  const fetchAllocatedShifts = async (assetId, startDate, endDate) => {
    const service = new ShiftAllocationService();
    let { data } = await service.list({
      assetId,
      startDate: dayjs(startDate).toISOString(),
      endDate: dayjs(endDate).toISOString(),
    });

    let res = data.reduce((c, e, i, a) => {
      const { shiftDetailId, assetId, shiftDate } = e;
      if (!c[assetId]) {
        c[assetId] = {
          assetId,
        };
      }
      let day = dayjs(e.shiftDate).format("dddd").toLowerCase();
      if (c[assetId][day]) {
        c[assetId] = {
          ...c[assetId],
          [day]: [...c[assetId][day], shiftDetailId],
        };
      } else {
        c[assetId] = {
          ...c[assetId],
          [day]: [shiftDetailId],
          [`${day}Date`]: shiftDate,
        };
      }

      return c;
    }, {});

    return res;
  };
  const fetchShiftMaster = (id) => {
    const service = new ShiftMasterAssetWiseService();
    service.retrieve(id).then(({ data }) => {
      setAsset(
        data.shiftAssetMappingList?.map((e) => ({
          value: e.assetId,
          label: e.assetName,
        }))
      );

      mainForm.setFieldsValue({
        data: data.shiftAssetMappingList?.map((e) => ({
          assetId: e.assetId,
          assetName: e.assetName,
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

      setShiftDetailAssetWises(data.shiftDetailAssetWises);
    });
  };

  useEffect(() => {
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
    let dataSrc = {};
    let allocated = {};
    fetchAllocatedShifts(
      asset.map((e) => e.value),
      dates[0],
      dates[6]
    ).then((data) => {
      allocated = data;
      for (let x of shiftDetailAssetWises) {
        let options = { value: x.shiftDetailId, label: x.shiftName };
        if (!dataSrc[x.shiftDay]) dataSrc[x.shiftDay] = [options];
        else dataSrc[x.shiftDay] = [...dataSrc[x.shiftDay], options];
      }
      setDataSource(dataSrc);

      mainForm.setFieldsValue({
        data: asset?.map((e) => {
          let resObj = allocated[e.value] ?? [];
          let obj = {
            assetId: e.value,
            assetName: e.label,
            sunday: resObj["sunday"],
            monday: resObj["monday"],
            tuesday: resObj["tuesday"],
            wednesday: resObj["wednesday"],
            thursday: resObj["thursday"],
            friday: resObj["friday"],
            saturday: resObj["saturday"],
          };
          for (let date of dates) {
            let key = `${date.format("dddd").toLowerCase()}Date`;
            obj[key] = date;
          }
          return obj;
        }),
      });
    });
  }, [dates, shiftDetailAssetWises, asset]);
  const getValue = (name) => {
    return mainForm.getFieldValue(["data", ...name]);
  };
  const onFinish = (value) => {
    const service = new ShiftAllocationService();
    service.bulkAdd(value.data).then(({ data }) => {
      resetFilter();
      message.success(data.message);
    });
  };
  const resetFilter = () => {
    setSelectAll({
      assetIds: [],
      sunday: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
    });
  };
  useEffect(() => {
    let data = mainForm.getFieldValue("data");

    data = data?.map((e) => {
      if (
        !selectAll.assetIds ||
        selectAll.assetIds?.length == 0 ||
        selectAll.assetIds?.includes(e.assetId)
      ) {
        return {
          ...e,
          sunday: selectAll.sunday,
          monday: selectAll.monday,
          tuesday: selectAll.tuesday,
          wednesday: selectAll.wednesday,
          thursday: selectAll.thursday,
          friday: selectAll.friday,
          saturday: selectAll.saturday,
        };
      }
      return e;
    });

    mainForm.setFieldValue("data", data);
  }, [selectAll]);

  const selection = (name, value) => {
    setSelectAll((state) => ({ ...state, [name]: value }));
  };
  return (
    <Card title="Shift Allocation">
      <Form form={form} layout="vertical" initialValues={{ date: dayjs() }}>
        <Row gutter={[10, 10]}>
          <Col sm={6}>
            <Form.Item name="shiftMasterAssetWiseId" label="Set">
              <Select
                {...shiftMasterAssetWiseOption}
                onChange={fetchShiftMaster}
              />
            </Form.Item>
          </Col>
          {/* <Col sm={6}>
            <Form.Item name="assetIds" label="Assets">
              <Select options={asset} />
            </Form.Item>
          </Col> */}
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
                      <th>Asset</th>
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
                    <tr style={{ backgroundColor: "#eeeeee" }}>
                      <td>
                        <Form.Item noStyle>
                          <Select
                            value={selectAll.assetIds}
                            onChange={(value) => selection("assetIds", value)}
                            mode="tags"
                            showSearch
                            options={asset}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </td>
                      {dates?.map((date) => (
                        <td>
                          <Form.Item noStyle>
                            <Checkbox.Group
                              value={
                                selectAll[date.format("dddd").toLowerCase()]
                              }
                              options={
                                dataSource[date.format("dddd").toUpperCase()] ??
                                []
                              }
                              onChange={(val) =>
                                selection(
                                  date.format("dddd").toLowerCase(),
                                  val
                                )
                              }
                            />
                          </Form.Item>
                        </td>
                      ))}
                    </tr>
                    {fields.map(({ name }) => (
                      <tr>
                        <td>
                          <Form.Item name={[name, "assetId"]} noStyle hidden>
                            <Input style={{ width: "100%" }} />
                          </Form.Item>
                          <Form.Item name={[name, "assetName"]} noStyle hidden>
                            <Input
                              style={{ width: "100%" }}
                              variant="borderless"
                            />
                          </Form.Item>

                          {getValue([name, "assetName"])}
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
                                    date.format("dddd").toUpperCase()
                                  ] ?? []
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

export default ShiftAllocation;
