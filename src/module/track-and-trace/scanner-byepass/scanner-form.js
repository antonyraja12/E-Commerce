import { Checkbox, Spin, Table, Typography } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import WorkStationService from "../../../services/track-and-trace-service/work-station-service";
import { withForm } from "../../../utils/with-form";
import Page from "../../../utils/page/page";
import DeviceTypeService from "../../../services/track-and-trace-service/device-type-service";
import BypassService from "../../../services/track-and-trace-service/bypass-service";

const ScannerForm = (props) => {
  const { access } = props;
  const [bypassData, setByPassData] = useState([]);
  const [data, setData] = useState([]);
  const [deviceType, setDeviceType] = useState([]);
  useEffect(() => {
    fetchDeviceType();
    fetchBypass();
    fetchWs().then((data) => {
      setData(data);
    });
  }, []);

  const fetchDeviceType = () => {
    const service = new DeviceTypeService();
    service.list().then(({ data }) => {
      setDeviceType(data);
    });
  };

  const fetchWs = async () => {
    const service = new WorkStationService();
    const wsResponse = await service.list();
    const ws = wsResponse.data
      ?.filter((e) => e.type != "Buffer")
      .sort((a, b) => a.seqNo - b.seqNo);

    let req = ws.map(({ workStationId }) => {
      return service.listDevice(workStationId);
    });
    const response = await Promise.all(req);
    return ws.map((e, i) => {
      return {
        ...e,
        device: response[i].data,
        deviceTypes: response[i].data?.map((el) => {
          return el.device?.deviceType?.deviceTypeName?.toUpperCase();
        }),
      };
    });
  };
  const fetchBypass = () => {
    const service = new BypassService();
    service.list().then(({ data }) => {
      let obj = {};
      for (let x of data) {
        if (!obj[x.workStationId]) obj[x.workStationId] = [];
        if (x.status)
          obj[x.workStationId] = [...obj[x.workStationId], x.deviceType];
      }
      setByPassData(obj);
    });
  };
  const onChangeHandle = (ele, workStationId, deviceType) => {
    const service = new BypassService();
    service
      .save(workStationId, deviceType, ele.target.checked)
      .then(({ data }) => {
        fetchBypass();
      });
  };
  const columns = useMemo(() => {
    return [
      {
        title: "S.No.",
        dataIndex: "workStationId",
        render: (val, rec, index) => {
          return index + 1;
        },
        width: 80,
      },
      {
        title: "Station",
        dataIndex: "workStationName",
      },
      {
        title: "Name",
        dataIndex: "displayName",
      },

      {
        title: "Bypass",
        children: deviceType?.map((e) => {
          return {
            title: e.deviceTypeName,
            dataIndex: "deviceTypes",
            key: e.deviceTypeName,
            align: "center",
            render: (val, record, index) => {
              if (!e.canBypass) {
                return <Checkbox disabled />;
              }
              const str = e.deviceTypeName?.toUpperCase();
              let checked = false;
              checked = bypassData[record.workStationId]?.includes(str);
              return (
                <Checkbox
                  onChange={(e) => onChangeHandle(e, record.workStationId, str)}
                  disabled={!val.includes(str)}
                  checked={checked ?? false}
                />
              );
            },
            width: 80,
          };
        }),
      },
    ];
  }, [data, deviceType, bypassData]);

  return (
    <Page
    //  title="Bypass"
    >
      <Table
        bordered
        columns={columns}
        dataSource={data ?? []}
        pagination={false}
      />
    </Page>
  );
};

export default withForm(ScannerForm);
