import React from "react";
import { Row, Col, Card, Table } from "antd";
import { useParams, Link, useLocation } from "react-router-dom";
import { useFetchCategoriesQuery } from "../services/CategoryService";
import { Card as MediaCard } from "../components";
import { Media as BaseMedia } from "../components";
import { ICategory } from "../models/ICategory";
import { IStore } from "../models/IStore";
import { useFetchStoresQuery } from "../services/StoreService";

const getFilterCategories = (categories: ICategory[]): ICategory[] => {
  let data: ICategory[] = [];
  categories.forEach((item) => {
    if (item.type === "media") {
      data = item.children;
    } else {
      data = [...data, ...getFilterCategories(item.children)];
    }
  });

  return data;
};

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

const Media: React.FC = () => {
  const { storeId, categoryId } = useParams();
  const {
    data: categories,
    isLoading: categoryLoading,
  } = useFetchCategoriesQuery();
  const { data: stores, isLoading: storeLoading } = useFetchStoresQuery();
  const location = useLocation();
  const state = location.state as LocationState;

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
        <Link
          to={store ? `/media/${store.id}` : "/media/all"}
          state={{
            ...state,
            page: store ? store.name : "Макет для аптек",
          }}
        >
          {store ? store.name : "Макет для аптек"}
        </Link>
      ),
    },
  ];

  const getDataSource = () => {
    let data: any = [
      {
        key: "all",
        index: "",
        store: null,
      },
    ];

    if (stores) {
      data = [
        ...data,
        ...stores.map((store: IStore, i: number) => ({
          key: store.id,
          index: i + 1,
          store: store,
        })),
      ];
    }
    return data;
  };

  return (
    <Row style={{ width: 782, margin: "0 auto" }}>
      <Col>
        {categoryId ? (
          <BaseMedia
            store={storeId && storeId !== "all" ? storeId : null}
            category={getCategoryById(Number(categoryId), categories || [])}
          />
        ) : storeId ? (
          <Card style={{ padding: "0.25rem" }} loading={categoryLoading}>
            <Row gutter={[48, 48]}>
              {getFilterCategories(categories || []).map((item) => (
                <Col key={item.id} span={12} offset={0}>
                  <Link
                    to={`/media/${storeId}/${item.id}`}
                    state={{ category: item }}
                  >
                    <MediaCard
                      title={item.name}
                      description={item.description}
                      size="small"
                    />
                  </Link>
                </Col>
              ))}
            </Row>
          </Card>
        ) : (
          <Card style={{ padding: "0.25rem" }}>
            <Table
              size="small"
              rowClassName="primary"
              columns={tableColumns}
              loading={storeLoading}
              dataSource={getDataSource()}
              pagination={false}
              bordered
              style={{
                border: "2px solid #22aca6",
                margin: "auto",
              }}
            />
          </Card>
        )}
      </Col>
    </Row>
  );
};

export default Media;
