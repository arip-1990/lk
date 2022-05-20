import React from "react";
import { Card, Table } from "antd";
import { IStore } from "../../models/IStore";

interface PropsType {
  stores: IStore[];
  loading: boolean;
}

const Store: React.FC<PropsType> = ({ stores, loading }) => {
  const tableColumns = [
    {
      title: "№",
      dataIndex: "index",
      align: "center" as "center",
      width: 48,
    },
    {
      title: "Адрес аптеки",
      dataIndex: "store",
      render: (store: IStore | null) => (
        <p style={{ margin: 0 }}>{store?.name}</p>
      ),
    },
    {
      title: "Телефон",
      dataIndex: "phone",
      width: 140,
    },
    {
      title: "Время работы",
      dataIndex: "schedule",
      width: 180,
      render: (text: string) => (
        <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: text }} />
      ),
    },
  ];

  return (
    <Card style={{ padding: "0.25rem" }}>
      <Table
        size="small"
        rowClassName="primary"
        columns={tableColumns}
        loading={loading}
        dataSource={stores.map((store: IStore, i: number) => ({
          key: store.id,
          index: i + 1,
          store: store,
          phone: store.phone || "-",
          schedule: store.schedule,
        }))}
        pagination={false}
        bordered
        style={{
          border: "2px solid #0072ce",
          margin: "auto",
        }}
      />
    </Card>
  );
};

export default Store;
