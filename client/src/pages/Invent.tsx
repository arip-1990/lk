import React from 'react';
import {IStore} from "../models/IStore";
import {Link, useLocation, useParams} from "react-router-dom";
import {Card, Col, Row, Table} from "antd";
import {useFetchCategoriesQuery} from "../services/CategoryService";
import {useFetchStoresQuery} from "../services/StoreService";
import {Card as MediaCard} from "../components";
import InventoryTable from "../components/inventory";
import {ICategory} from "../models/ICategory";



const getFilterCategories = (categories: ICategory[]): ICategory[] => {
    let data: ICategory[] = [];
    categories.forEach((item) => {
        if (item.type === "invent") {
            data = item.children;
        } else {
            data = [...data, ...getFilterCategories(item.children)];
        }
    });

    return data;
};


const Invent = () => {
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
                    to={store ? `/invent/${store.id}` : "/invent/all"}
                    state={{
                        ...state,
                        page: store ? store.name : "Все",
                    }}
                >
                    {store ? store.name : "Все"}
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
        <Row style={categoryId? { width: 1382, margin: "0 auto" } : { width: 782, margin: "0 auto" }}>
            <Col>
                {categoryId ? (
                    <Card>
                        <InventoryTable id={categoryId} store_id={storeId} />
                    </Card>
                ) : storeId ? (
                    <Card style={{ padding: "0.25rem" }} loading={categoryLoading}>
                        <Row gutter={[48, 48]}>
                            {getFilterCategories(categories || []).map((item) => (
                                <Col key={item.id} span={12} offset={0}>
                                    <Link
                                        to={`/invent/${storeId}/${item.id}`}
                                        state={{ category: item }}
                                    >
                                        <MediaCard
                                            title={item.name}
                                            description={item.description}
                                            size="middle"
                                        />
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                ) : (
                    <Card
                        style={{ padding: "0.25rem" }}
                    >
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

export default Invent;
