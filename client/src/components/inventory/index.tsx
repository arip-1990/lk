import React, { FC, useEffect, useState} from 'react';
import {Button, Form, Input, Select, Table} from "antd";
import {DeleteOutlined, FileExcelOutlined, PlusOutlined} from "@ant-design/icons";
import {InventData} from '../../models/Inventory';
import {
    CreateInventParams,
    useAddInventoryMutation,
    useDeleteInventoryMutation,
    useFetchInventoriesQuery
} from "../../services/InventoryService";
import {columns} from "./colums";
import { Modal } from "antd";
import { useFetchStoresQuery } from "../../services/StoreService";
import {Item, Menu, useContextMenu} from "react-contexify";
import Sorting from "../inventory/Sorting";
import type {FormData} from "../statement/Sorting";
import {useAuth} from "../../hooks/useAuth";
import {API_URL} from "../../services/api";


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

interface params{
    id: string | undefined,
    store_id: string | undefined,
}

const MENU_ID = "context-menu";
const InventoryTable: FC<params> = ({id, store_id}) => {
    const [sort, setSort] = useState<string|undefined>();

    if (store_id == 'all') {
        store_id = sort
    }

    const { user } = useAuth();
    const [addInventory] = useAddInventoryMutation();
    const [inventories, setInventories] = useState<InventData[]|undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const { data: stores} = useFetchStoresQuery();
    const { data: newInventory, refetch } = useFetchInventoriesQuery({id, store_id});
    const [deleteInvent] = useDeleteInventoryMutation();
    const [showSorting, setShowSorting] = useState(false);

    const { show } = useContextMenu({
        id: MENU_ID,
    });


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
        setSort(values.address)
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

    const inventExport = () => {
        if (store_id != undefined){
            window.location.href = `${API_URL}/download/inventory/${id}/?store_id=${store_id}`;
        }else{
            window.location.href = `${API_URL}/download/inventory/${id}`;
        }
    }

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

                <div style={{
                    display: "flex",}}
                >
                    <Button
                        type="link"
                        style={{
                            color: "#22aca6",
                            marginBottom: 14,
                            marginTop: -6,
                            marginRight: 12,
                        }}
                        icon={<FileExcelOutlined />}
                        onClick={inventExport}
                    />

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        style={{ marginBottom: 14, marginTop: -6 }}
                        onClick={showModal}
                    />
                </div>

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
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Line1"
                        name="line1"
                    >
                        <Input style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Line2"
                        name="line2"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Barcode"
                        name="barcode"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Sheet"
                        name="sheet"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Выбор аптеки"
                        name="store_id"
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



