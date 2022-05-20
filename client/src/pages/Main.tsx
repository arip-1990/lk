import React from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import { Card } from "../components";
import { categoryApi } from "../services/CategoryService";

const Main: React.FC = () => {
  const { data: categories } = categoryApi.useFetchCategoriesQuery();

  return (
    <Row gutter={[100, 48]}>
      {categories &&
        categories
          .filter(
            (item) =>
              !(
                item.name.includes("Скорая помощь") ||
                item.name.includes("Доска почета")
              )
          )
          .map((item) => (
            <Col key={item.id} span={12}>
              <Link
                to={
                  item.type === "media" ? "/media" : `/${item.type}/${item.id}`
                }
                state={{ category: item }}
              >
                <Card title={item.name} description={item.description} />
              </Link>
            </Col>
          ))}
    </Row>
  );
};

export default Main;
