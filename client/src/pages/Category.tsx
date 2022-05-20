import React from "react";
import { Row, Col } from "antd";
import { Link, useParams, useLocation } from "react-router-dom";
import { Card } from "../components";
import { useFetchCategoriesQuery } from "../services/CategoryService";
import { ICategory } from "../models/ICategory";

const generateUrl = (category: ICategory): string => {
  if (
    category.children.length &&
    !["test", "store", "media"].includes(category.type)
  )
    return `/category/${category.id}`;
  else if (category.type === "timecard" || category.type === "media")
    return `/${category.type}`;
  else return `/${category.type}/${category.id}`;
};

const Category: React.FC = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [menu, setMenu] = React.useState<ICategory[]>([]);
  const { id } = useParams();
  const location = useLocation();
  const state = location.state as LocationState;

  React.useEffect(() => {
    if (categories) {
      categories.forEach((category) => {
        if (category.id.toString() === id) setMenu(category.children);
      });
    }
  }, [categories]);

  React.useEffect(() => {
    if (state?.category) {
      setMenu(state.category.children);
    } else
      menu.forEach((item) => {
        if (item.id.toString() === id) setMenu(item.children);
      });
  }, [id]);

  return (
    <Row gutter={[100, 48]} className="content">
      {menu.map((item, i) => {
        const offset =
          ((menu.length === 2 || menu.length === 4) && i == 0) ||
          (menu.length === 4 && i == 2)
            ? 4
            : menu.length === 1
            ? 8
            : 0;

        return (
          <Col key={item.id} className="gutter-row" span={8} offset={offset}>
            <Link to={generateUrl(item)} state={{ category: item }}>
              <Card title={item.name} description={item.description} full />
            </Link>
          </Col>
        );
      })}
    </Row>
  );
};

export default Category;
