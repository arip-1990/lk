import { FC, ReactElement, useEffect, useState } from "react";
import { Row, Breadcrumb as AntBreadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useLocation, Link } from "react-router-dom";

import { useFetchCategoriesQuery } from "../services/CategoryService";
import { ICategory } from "../models/ICategory";

const getCategoryById = (
  id: number,
  categories: ICategory[]
): ICategory | undefined => {
  for (const item of categories) {
    if (item.id == id) return item;

    const found = getCategoryById(id, item.children);
    if (found) return found;
  }
};

const generateUrl = (category: ICategory): string => {
  if (
    category.children.length &&
    !["test", "store", "media", "invent"].includes(category.type)
  )
    return `/category/${category.id}`;
  else if (category.type === "timecard" || category.type === "media" || category.type === "invent")
    return `/${category.type}`;
  else return `/${category.type}/${category.id}`;
};

const Breadcrumb: FC = () => {
  const [crumbs, setCrumbs] = useState<ReactElement[]>([]);
  const { data: categories } = useFetchCategoriesQuery();
  const location = useLocation();
  const state = location.state as LocationState;

  useEffect(() => {
    let tmp: any = [];
    if (state && categories?.length && location.pathname !== "/") {
      if (state.page) {
        tmp.push(
          <AntBreadcrumb.Item key="page" className="breadcrumb__item">
            {state.page}
          </AntBreadcrumb.Item>
        );
      }

      if (state.category) {
        let category = undefined;
        if (typeof state.category === "number")
          category = getCategoryById(state.category, categories || []);
        else category = state.category;

        if (category) {
          const url = generateUrl(category);
          tmp.unshift(
            <AntBreadcrumb.Item key={url} className="breadcrumb__item">
              {state.page ? (
                <Link to={url} state={{ category }}>
                  {category.name}
                </Link>
              ) : (
                category.name
              )}
            </AntBreadcrumb.Item>
          );

          category = category.parent
            ? getCategoryById(category.parent, categories || [])
            : undefined;
          while (category) {
            const url = generateUrl(category);
            tmp.unshift(
              <AntBreadcrumb.Item key={url} className="breadcrumb__item">
                <Link to={url} state={{ category }}>
                  {category.name}
                </Link>
              </AntBreadcrumb.Item>
            );

            category = category.parent
              ? getCategoryById(category.parent, categories || [])
              : undefined;
          }
        }
      }

      tmp = [
        <AntBreadcrumb.Item key="home" className="breadcrumb__item">
          <Link to="/">
            <HomeOutlined />
          </Link>
        </AntBreadcrumb.Item>,
      ].concat(tmp);
    }

    setCrumbs(tmp);
  }, [location, categories]);

  return (
    <Row style={{ marginBottom: "1.5rem" }}>
      <AntBreadcrumb style={{ backgroundColor: "#fff", padding: "0 0.5rem" }}>
        {crumbs}
      </AntBreadcrumb>
    </Row>
  );
};

export default Breadcrumb;
