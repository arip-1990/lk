import { FC, useState } from "react";
import {
    Form,
    Button,
    Checkbox,
    Col,
    Drawer,
    Row,
    Space,
    TreeSelect,
} from "antd";

import { CheckboxValueType } from "antd/es/checkbox/Group";
import { useAuth } from "../../hooks/useAuth";
import { useFetchStoresQuery } from "../../services/StoreService";


export type FormData = {
    status: string| null | 1 | 0;
    performer?: string;
    address?: string;
    date?: string;
};

interface IProps {
    show?: boolean;
    onHide?: () => void;
    onSorting?: (values: FormData) => void;
}

const Sorting: FC<IProps> = ({ show, onHide, onSorting }) => {
    const { user } = useAuth();
    const [form] = Form.useForm<FormData>();
    const [filters, setFilters] = useState<Array<CheckboxValueType>>([]);
    const { data: stores } = useFetchStoresQuery();


    const onFinish = async () => {
        try {
            const data = await form.validateFields();
            onSorting && onSorting(data);

        } catch (error) {
            console.log("Error: ", error);
        }
    };


    const addresses = stores && [
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


    return (
        <Drawer
            title="Сортировка"
            placement="right"
            width={500}
            onClose={onHide}
            open={show}
            extra={
                <Space>
                    <Button type="primary" onClick={onFinish}>
                        Применить
                    </Button>
                </Space>
            }
        >
            <Form
                name="sorting"
                form={form}
                autoComplete="off"
            >

                <Checkbox.Group
                    style={{ width: "100%", marginTop: 25 }}
                    onChange={setFilters}
                >
                    <Row>

                        <Col span={8}>
                            <Checkbox value="address">Адрес аптеки</Checkbox>
                        </Col>

                    </Row>
                </Checkbox.Group>

                {filters.map((item) => {

                    if (item === "address") {
                        return (
                            <Form.Item
                                key={item}
                                name={item}
                                rules={[
                                    {
                                        required: true,
                                        message: "Пожалуйста, выберите значение",
                                    },
                                ]}
                            >
                                <TreeSelect
                                    style={{ width: "100%", marginTop: 20 }}
                                    dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                                    placeholder={
                                        "Выбор аптеки"
                                    }
                                    treeData={addresses}
                                    treeDefaultExpandAll
                                />
                            </Form.Item>
                        );
                    }
                    return null;
                })}
            </Form>
        </Drawer>
    );
};

export default Sorting;
