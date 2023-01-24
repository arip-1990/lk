import React from "react";
import { Table } from "antd";
import { useFetchContactsQuery } from "../../services/ContactService";

const columns = [
  {
    title: "№",
    dataIndex: "index",
    width: 48,
    align: "center" as "center",
    render: (_: number, row: any, index: number) => {
      if (row.length > 1) {
        return {
          children: <span>{index + 1}</span>,
          props: {
            rowSpan: row.key.split("-")[1] == "0" ? row.length : 0,
          },
        };
      }
      return <span>{index + 1}</span>;
    },
  },
  {
    title: "Описание проблемы (ситуаций)",
    dataIndex: "description",
    width: 520,
    render: (text: string, row: any, index: number) => {
      if (row.length > 1) {
        return {
          children: <span>{text}</span>,
          props: {
            rowSpan: row.key.split("-")[1] == "0" ? row.length : 0,
          },
        };
      }
      return <span>{text}</span>;
    },
  },
  {
    title: "К кому обращаться",
    dataIndex: "contact",
    width: 240,
    render: (contact: string) => <span>{contact}</span>,
  },
  {
    title: "Номер телефона",
    dataIndex: "phone",
    width: 180,
    render: (phone: { mobile: string | null; internal: string[] }) => (
      <div>
        {phone?.internal.length ? (
          <p>вн. № {phone.internal.join(",")}</p>
        ) : null}
        {phone?.mobile ? <p>моб. {phone.mobile}</p> : null}
      </div>
    ),
  },
];

const Contact: React.FC = () => {
  const { data: contacts, isLoading: fetchLoading } = useFetchContactsQuery();
  const [rows, setRows] = React.useState<any>();

  React.useEffect(() => {
    if (contacts) {
      const data: any[] = [];
      contacts?.forEach((contact, i) => {
        contact.contacts.forEach((item, j) => {
          data.push({
            key: `${i}-${j}`,
            index: i + 1,
            length: contact.contacts.length,
            description: contact.description,
            contact: item.firstName,
            phone: { mobile: item.mobilePhone, internal: item.internalPhones },
          });
        });
      });
      setRows(data);
    }
  }, [contacts]);

  return (
    <Table
      size="small"
      rowClassName="primary"
      columns={columns}
      loading={fetchLoading}
      dataSource={rows}
      pagination={false}
      bordered
      style={{
        border: "2px solid #0072ce",
        margin: "auto",
      }}
    />
  );
};

export default Contact;
