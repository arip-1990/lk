import React, { useEffect, useState} from 'react';
import {Button, Form, Input, Select, Table} from "antd";
import { DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import {InventData} from '../../models/Inventory';
import {
    CreateInventParams,
    useAddInventoryMutation,
    useDeleteInventoryMutation,
    useFetchInventoriesQuery
} from "../../services/InventoryService";
import {columns} from "./colums";
import { Modal } from "antd";
import {useParams} from "react-router-dom";
import { useFetchStoresQuery } from "../../services/StoreService";
import {Item, Menu, useContextMenu} from "react-contexify";
import Sorting from "../inventory/Sorting";
import type {FormData} from "../statement/Sorting";
import {useAuth} from "../../hooks/useAuth";


const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};

const MENU_ID = "context-menu";
const InventoryTable = () => {
    const { user } = useAuth();
    const [store_id, setStoreId] = useState<string|undefined>('');
    const [addInventory] = useAddInventoryMutation();
    const [inventories, setInventories] = useState<InventData[]|undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const {id} = useParams();
    const {data: stores} = useFetchStoresQuery();
    const { data: newInventory, refetch } = useFetchInventoriesQuery({id, store_id});
    const [deleteInvent] = useDeleteInventoryMutation();
    const { show } = useContextMenu({
        id: MENU_ID,
    });
    const [showSorting, setShowSorting] = useState(false);

    useEffect(() => {
        if (newInventory) {
            setInventories(newInventory);
        }
    }, [newInventory]);


    const options = stores && [
        ...stores
            .filter((store) =>
                user?.stores.length
                    ? user.stores.some((item) => item.id === store.id)
                    : true
            )
            .map((item) => ({
                label: item.name,
                value: item.id,
            })),
    ];

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = (values: CreateInventParams) => {
        values['category_id'] = Number(id);
        addInventory(values).unwrap().then(() => {
            setIsModalOpen(false);
            form.resetFields();
            refetch(); // Обновление данных после добавления нового инвентаря
        });
    };

    const onSorting = (values: FormData) => {
        setShowSorting(false);
        setStoreId(values.address);
    }

    function handleContextMenu(event: any, props: any) {
        const { key } = props;
        show({ event, props: { key, props } });
    }

    const handleItemClick = async ({ id, props }:any) => {
        switch (id) {
            case "Удалить":
                await deleteInvent({ id: props.props.id }).unwrap();
                refetch(); // Обновление данных после удаления инвентаря
                break;
        }
    };

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                    type="primary"
                    style={{ marginBottom: 14, marginTop: -6 }}
                    onClick={() => setShowSorting(true)}
                >
                    Сортировка
                </Button>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{ marginBottom: 14, marginTop: -6 }}
                    onClick={showModal}
                />
            </div>

            <Sorting
                show={showSorting}
                onHide={() => setShowSorting(false)}
                onSorting={onSorting}
            />

            <Table
                columns={columns}
                bordered
                dataSource={inventories}
                onRow={(record) => ({
                    onContextMenu: (event) => handleContextMenu(event, record),
                })}
            />

            <Modal
                title="Добавить Инвентарь"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={635}
                style={{ marginTop: -50 }}
            >
                <Form
                    {...formItemLayout}
                    form={form}
                    onFinish={onFinish}
                    style={{ maxWidth: 600 }}
                >
                    <Form.Item
                        label="Наименование"
                        name="description"
                        rules={[{ required: true, message: 'Введите данные!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        label="Инвентарный номер"
                        name="inventory_number"
                        rules={[{ required: true, message: 'Введите инвентарный номер' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Line1"
                        name="line1"
                        rules={[{ required: true, message: 'Введите данные!' }]}
                    >
                        <Input style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Line2"
                        name="line2"
                        rules={[{ required: true, message: 'Введите данные!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Barcode"
                        name="barcode"
                        rules={[{ required: true, message: 'Введите данные!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Sheet"
                        name="sheet"
                        rules={[{ required: true, message: 'Введите данные!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Выбор аптеки"
                        name="store_id"
                        rules={[{ required: true, message: 'Введите данные!' }]}
                    >
                        <Select
                            options={options}
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Сохранить
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Menu id={MENU_ID}>
                <Item id="Удалить" onClick={handleItemClick} >
                    <span style={{ color: "#dc4234" }}>
                    <DeleteOutlined style={{ marginRight: 5 }} />
                    Удалить
                    </span>
                </Item>
            </Menu>

        </>
    );
};

export default InventoryTable;