import React from "react";
import { Table, Space, TablePaginationConfig } from "antd";
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

interface PropsType {
  id: number;
  onEdit: (data: IStatement) => void;
}

const Statement: React.FC<PropsType> = ({ id, onEdit }) => {
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
  });
  const {
    data: statements,
    isLoading: fetchLoading,
  } = useFetchStatementsQuery({ categoryId: id, pagination });
  const [
    deleteStatement,
    { isLoading: deleteLoading },
  ] = useDeleteStatementMutation();

  const tableColumns = [
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
      title: "Что необходимо выполнить",
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
            onClick={handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const handleChange = (pag: TablePaginationConfig) => {
    setPagination({
      current: pag.current || pagination.current,
      pageSize: pag.pageSize || pagination.pageSize,
    });
  };

  const handleDelete = (id: string) => () => {
    deleteStatement(id);
  };

  return (
    <Table
      columns={tableColumns}
      rowClassName={(record) => (record.status ? "disable" : "")}
      loading={fetchLoading || deleteLoading}
      bordered
      dataSource={
        statements?.data && [
          ...statements.data.map((statement, index) => ({
            ...statement,
            index: pagination.current * 10 - 10 + index + 1,
            key: statement.id,
          })),
        ]
      }
      pagination={{
        current: statements?.meta.current_page || pagination.current,
        total: statements?.meta.total || 0,
        pageSize: statements?.meta.per_page || pagination.pageSize,
      }}
      onChange={handleChange}
    />
  );
};

export default Statement;
