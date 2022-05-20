import React from "react";
import { Row, Col, Table } from "antd";
import { ICategory } from "../../models/ICategory";
import { Link } from "react-router-dom";

type Props = {
  store: string;
  categories: ICategory[];
};

const Category: React.FC<Props> = ({ store, categories }) => {
  const tableColumns = [
    {
      dataIndex: "index",
      align: "center" as "center",
      width: 48,
    },
    {
      dataIndex: "category",
      render: (category: ICategory) => (
        <Link to={`/media/${store}/${category.id}`} state={{ category }}>
          {category.name}
        </Link>
      ),
    },
  ];

  return (
    <Row gutter={[48, 48]} align="middle">
      <Col>
        <Table
          size="small"
          style={{
            maxWidth: 720,
            border: "2px solid #22aca6",
            margin: "auto",
          }}
          rowClassName="ant-table-document-row"
          showHeader={false}
          pagination={false}
          columns={tableColumns}
          dataSource={categories.map((category, i) => ({
            key: i + 1,
            index: i + 1,
            category: category,
          }))}
          bordered
        />
      </Col>
    </Row>
  );
};

export { Category };
