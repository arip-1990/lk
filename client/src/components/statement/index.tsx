import { FC } from "react";
import { Table, TablePaginationConfig } from "antd";
import { IStatement } from "../../models/IStatement";

interface IProps {
  columns: any[];
  data: IStatement[];
  loading?: boolean;
  pagination?: {
    currentPage: number;
    pageSize: number;
    total: number;
    onChange: (currentPage: number, pageSize: number) => void;
  };
}

const Statement: FC<IProps> = ({ columns, data, loading, pagination }) => {
  const handleChange = (pag: TablePaginationConfig) => {
    pagination &&
      pagination.onChange(
        pag.current || pagination.currentPage,
        pag.pageSize || pagination.pageSize
      );
  };

  return (
    <Table
      columns={columns}
      rowClassName={(record) => (record.status ? "disable" : "")}
      loading={loading}
      bordered
      dataSource={data.map((statement, index) => ({
        ...statement,
        index: pagination ? pagination.currentPage * 10 - 10 + index + 1 : 0,
        key: statement.id,
      }))}
      pagination={
        pagination && {
          current: pagination.currentPage || 1,
          total: pagination.total || 0,
          pageSize: pagination.pageSize || 10,
        }
      }
      onChange={handleChange}
    />
  );
};

export default Statement;
