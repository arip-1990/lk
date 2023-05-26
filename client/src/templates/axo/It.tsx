import { FC, useState } from "react";
import { Space } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import moment from "moment";

import { IStatement } from "../../models/IStatement";
import {
  useFetchStatementsQuery,
  useDeleteStatementMutation,
} from "../../services/StatementService";
import { Statement } from "../../components";

interface PropsType {
  id: number;
  onEdit: (data: IStatement) => void;
}

const It: FC<PropsType> = ({ id, onEdit }) => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const { data, isLoading: fetchLoading } = useFetchStatementsQuery({
    categoryId: id,
    pagination,
  });
  const [
    deleteStatement,
    { isLoading: deleteLoading },
  ] = useDeleteStatementMutation();

  const columns = [
    {
      title: "№",
      dataIndex: "index",
      align: "center" as "center",
    },
    {
      title: "Дата",
      width: 100,
      align: "center" as "center",
      dataIndex: "createdAt",
      render: (date: moment.Moment) => <p>{date.format("DD MMM YYYY")}</p>,
    },
    {
      title: "Адрес аптеки",
      width: 180,
      align: "center" as "center",
      dataIndex: "store",
      render: (store: { id: string; name: string } | undefined) => (
        <p>{store?.name}</p>
      ),
    },
    {
      title: id === 67 ? "Что необходимо выполнить" : "Описание проблемы",
      dataIndex: "must",
      align: "center" as "center",
      render: (text: string | undefined) => <p>{text}</p>,
    },
    {
      title: "Вложение",
      dataIndex: "media",
      align: "center" as "center",
      render: (media: string | undefined) =>
        media ? (
          <a href={media} style={{ fontSize: "1.5rem" }}>
            <PaperClipOutlined />
          </a>
        ) : null,
    },
    {
      title: "Заявитель",
      dataIndex: "applicant",
      align: "center" as "center",
      render: (user: { id: string; name: string }) => <p>{user.name}</p>,
    },
    {
      title: "Комментарий",
      dataIndex: "comment",
      align: "center" as "center",
      render: (text: string | undefined) => <p>{text}</p>,
    },
    {
      title: "Дата исполнения",
      dataIndex: "doneAt",
      align: "center" as "center",
      render: (date: moment.Moment | undefined) => (
        <p>{date?.format("DD MMM YYYY")}</p>
      ),
    },
    {
      title: "",
      width: 80,
      align: "center" as "center",
      dataIndex: "operation",
      render: (_: any, record: IStatement) => (
        <Space>
          <EditOutlined
            style={{ color: "#2b74b7" }}
            onClick={() => onEdit(record)}
          />
          <DeleteOutlined
            style={{ color: "#dc4234" }}
            onClick={() => deleteStatement(record.id)}
          />
        </Space>
      ),
    },
  ];

  return data ? (
    <Statement
      columns={columns}
      data={data.data}
      loading={fetchLoading || deleteLoading}
    />
  ) : null;
};

export default It;
