import React, {FC, useEffect, useState} from "react";
import {
    Button,
    Checkbox,
    Col,
    Drawer,
    Radio,
    RadioChangeEvent,
    Row,
    Space,
    Table,
    TreeSelect,
    TablePaginationConfig,
    Select, Form
} from "antd";

import { IStatement } from "../../models/IStatement";

import {Menu, Item, Separator, useContextMenu, ItemParams} from 'react-contexify';
import moment from "moment/moment";
import {
    CheckOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import {useAddPerformerMutation} from "../../services/StatementService";
import {useAuth} from "../../hooks/useAuth";
import style from "./Statement.module.scss"
import { message } from 'antd';
import {CheckboxValueType} from "antd/es/checkbox/Group";
import {DrawerProps} from "antd/es/drawer";
import {useFetchStoresQuery} from "../../services/StoreService";
import { DatePicker } from 'antd';

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
    onDelete: (id:string)=> void;
    handleEdit: (data:IStatement) => void;
    FilterFunctionTest:(applications: string, data:string, address: string, performer:string)=>void;
}


const MENU_ID = 'context-menu';

interface IFormEditData {
    id?: string;
    comment?: string;
    doneAt?: moment.Moment;
    status?: boolean;
}

const Statement: FC<IProps> = ({
                                   columns,
                                   data,
                                   loading,
                                   pagination,
                                   onDelete,
                                   handleEdit,
                                   FilterFunctionTest,
                               }) => {
    const { user } = useAuth();

    const [performer] = useAddPerformerMutation()


    const handleChange = (pag: TablePaginationConfig) => {
        pagination &&
        pagination.onChange(
            pag.current || pagination.currentPage,
            pag.pageSize || pagination.pageSize
        );
    };

    const { show } = useContextMenu({
        id: MENU_ID,
    });


    function handleContextMenu(event:any, props:any){
        const {key} = props
        show({event, props: {key, props}})
    }


    const handleItemClick = async ({id, props }:ItemParams) => {
        switch (id) {
            case "Выполнить":
                try {
                    await performer(props?.key).unwrap();
                }catch (error) {
                    console.log(error)
                }
                break;

            case "Редактировать":
                try {
                    if (user?.id === props.props.performer.id) {
                        handleEdit(props?.props)
                    } else {
                        message.success({
                            content: 'Вы не можете редактировать данную заявку !',
                            icon: <ExclamationCircleOutlined style={{  fontSize: '24px', color: 'red' }} />,
                            type: "error",
                            duration: 2,
                            style: {
                                fontSize: '18px',
                            },
                        });
                    }
                    break
                }

                catch (error) {
                    message.success({
                        content: 'Для редактирования заявки необходимо ее принять !',
                        icon: <ExclamationCircleOutlined style={{  fontSize: '24px', color: 'red' }} />,
                        type: "error",
                        duration: 2,
                        style: {
                            fontSize: '18px',
                        },
                    });
                    break
                }

            case "Удалить":
                onDelete(props?.key)
                break
        }
    }

    // new global
        const [applications1, setApplications1] = useState('all');
        const [data1, setData1] = useState('');
        const [address1, setAddress1] = useState('');
        const [performer1, setPerformer1] = useState('');
    // end newGlobal

    //new global props
    //     useEffect(() => {
    //         FilterFunctionTest(applications1, data1, address1, performer1);
    //     }, [applications1, data1, address1, performer1]);


    // end new global props

    // global
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState<DrawerProps['placement']>('right');
    const [radio, setRadio] = useState("all")
    const [checkBox, setCheckBox] = useState<CheckboxValueType[]>([])
    const [dat, setDat] = useState<IStatement[]>();
    const { data: stores } = useFetchStoresQuery();
    const [selectData, setSelectData] = useState('');
    const treeData = [
        {
            title: 'Арип',
            value: 'Арип',
        },
        {
            title: 'Магомед',
            value: 'Магомед',
        },
        {
            title: 'Арслан',
            value: 'Арслан',
        },
        {
            title: 'Наби',
            value: 'Наби',
        },
        {
            title: 'Гаджи',
            value: 'Гаджи',
        },
        {
            title: 'Гаджимурад',
            value: 'Гаджимурад',
        },
    ];
    const address = stores && [
        ...stores
            .filter((store) =>
                user?.stores.length
                    ? user.stores.some((item) => item.id === store.id)
                    : true
            )
            .map((item) => ({
                label: item.name,
                value: item.name,
            })),
        { label: "Офис", value: "" },
    ]
    const { RangePicker } = DatePicker;

    const [valueName, setValue] = useState<string>('');
    const [addressName, setAddressName] = useState<string>('');
    const onSelectName = (newValue: string) => {
        // console.log(newValue);
        setValue(newValue);
    };

    const onSelectAddress = (newValue: string) => {
        // console.log(newValue);
        setAddressName(newValue);
    };

    const onSelectDate = (dates: any | null) => {
        if (dates) {
            setSelectData(dates)
        }
    }
    // console.log(selectData)

    // useEffect(() => {
    //     setDat(data)
    //     switch (radio) {
    //
    //         case 'all':
    //             if (checkBox.includes('performer')){
    //                 setDat(data.filter(e => e.performer?.firstName == valueName))
    //             }else if (checkBox.includes('address')) {
    //                 setDat(data.filter(e => e.store?.name == addressName))
    //             }else if (checkBox.includes('Data')) {
    //                 setDat(data.filter(e => selectData?.length === 2 &&
    //                     e.createdAt.isSameOrAfter(selectData[0]) &&
    //                     e.createdAt.isSameOrBefore(selectData[1])))
    //             }else{
    //                 setDat(data)
    //             }
    //             break
    //
    //         case 'active':
    //             if (checkBox.includes('performer')){
    //                 setDat(data.filter(e => e.status == false && e.performer?.firstName == valueName))
    //                 // console.log(dat, 'ddddd')
    //             }else if (checkBox.includes('address')) {
    //                 setDat(data.filter(e => e.status == false && e.store?.name == addressName))
    //             }else if (checkBox.includes('Data')) {
    //                 setDat(data.filter(e => selectData?.length === 2 &&
    //                     e.createdAt.isSameOrAfter(selectData[0]) &&
    //                     e.createdAt.isSameOrBefore(selectData[1]) && e.status == false))
    //             }else{
    //                 setDat(data.filter(e => e.status == false))
    //             }
    //             break
    //
    //         case 'NotActive':
    //             if (checkBox.includes('performer')){
    //                 setDat(data.filter(e => e.status == true && e.performer?.firstName == valueName))
    //
    //             }else if (checkBox.includes('address')) {
    //                 setDat(data.filter(e => e.status == true && e.store?.name == addressName))
    //             }else if (checkBox.includes('Data')) {
    //                 setDat(data.filter(e => selectData?.length === 2 &&
    //                     e.createdAt.isSameOrAfter(selectData[0]) &&
    //                     e.createdAt.isSameOrBefore(selectData[1]) && e.status == true))
    //             }else{
    //                 setDat(data.filter(e => e.status == true))
    //             }
    //             break
    //     }
    // }, [data]);

    const showDrawer = () => {
        setOpen(true);
    };

    const onChan = () => {
        setPlacement('right');
    };

    const onClose = () => {
        setOpen(false);
    };

    const radioChecked = (event:RadioChangeEvent) => {
        setRadio(event.target.value)
    }

    const checkbox = (checkedValues: CheckboxValueType[]) => {
        setCheckBox(checkedValues)
    };

    const checkActiveNotActive  = () => {
        FilterFunctionTest(radio, selectData, addressName, valueName);
        setOpen(false);
        // switch (value) {
        //
        //     case 'all':
        //         setApplications1('all');
        //
        //         if (checkBox.includes('performer')){
        //             setDat(data.filter(e => e.performer?.firstName == valueName))
        //         }else if (checkBox.includes('address')) {
        //             setDat(data.filter(e => e.store?.name == addressName))
        //         }else if (checkBox.includes('Data')) {
        //             setDat(data.filter(e => selectData?.length === 2 &&
        //                 e.createdAt.isSameOrAfter(selectData[0]) &&
        //                 e.createdAt.isSameOrBefore(selectData[1])))
        //         }else{
        //             setDat(data)
        //         }
        //
        //         break
        //
        //     case 'active':
        //         setApplications1('active');
        //
        //         if (checkBox.includes('performer')){
        //             setDat(data.filter(e => e.status == false && e.performer?.firstName == valueName))
        //             // console.log(dat, valueName)
        //         }else if (checkBox.includes('address')) {
        //             setDat(data.filter(e => e.status == false && e.store?.name == addressName))
        //         }else if (checkBox.includes('Data')) {
        //             setDat(data.filter(e => selectData?.length === 2 &&
        //                 e.createdAt.isSameOrAfter(selectData[0]) &&
        //                 e.createdAt.isSameOrBefore(selectData[1]) && e.status == false))
        //         }else{
        //             setDat(data.filter(e => e.status == false))
        //         }
        //         break
        //
        //     case 'NotActive':
        //         setApplications1('notActive');
        //
        //         if (checkBox.includes('performer')){
        //             setDat(data.filter(e => e.status == true && e.performer?.firstName == valueName))
        //         }else if (checkBox.includes('address')) {
        //             setDat(data.filter(e => e.status == true && e.store?.name == addressName))
        //         }else if (checkBox.includes('Data')) {
        //             setDat(data.filter(e => selectData?.length === 2 &&
        //                 e.createdAt.isSameOrAfter(selectData[0]) &&
        //                 e.createdAt.isSameOrBefore(selectData[1]) && e.status == true))
        //         }else{
        //             setDat(data.filter(e => e.status == true))
        //         }
        //         break
        // }

    }


    // useEffect(() => {
    //
    //     FilterFunctionTest(radio, data1, addressName, valueName);
    // }, [radio, data1, addressName, valueName]);


    useEffect(() => {
        const performer = true ? checkBox.includes('performer') : false;
        const address = true ? checkBox.includes('performer') : false;
        const data = true ? checkBox.includes('Data') : false;
        if (performer) {
        }else{
            setValue('')
        }

        if (address) {
        }else{
            setAddressName('')
        }

        if (data) {
        }else{
            setSelectData('')
        }
    }, [checkBox]);

    // end global


    return (
        <>
            <Button type="primary" onClick={showDrawer} style={{marginBottom:14, marginTop:-6}}>
                Сортировка
            </Button>

            <Drawer
                title="Сортировка заявок"
                placement={placement}
                width={500}
                onClose={onClose}
                open={open}
                extra={
                    <Space>
                        <Button onClick={onClose}>Закрыть</Button>
                        <Button type="primary" onClick={() => checkActiveNotActive()}>
                            Применить
                        </Button>
                    </Space>
                }
            >
                <>
                    <Radio.Group defaultValue="a" buttonStyle="solid">
                        <Radio.Button
                            value="all"
                            onChange={(e) => radioChecked(e)}
                        >
                            Все
                        </Radio.Button>
                        <Radio.Button
                            value="active"
                            onChange={(e) => radioChecked(e)}
                        >
                            Активные
                        </Radio.Button>
                        <Radio.Button
                            value="NotActive"
                            onChange={(e) => radioChecked(e)}
                        >
                            Завершенные
                        </Radio.Button>
                    </Radio.Group>
                </>

                <Checkbox.Group style={{ width: '100%', marginTop:25}} onChange={(e) => checkbox(e)}>
                    <Row>
                        <Col span={8}>
                            <Checkbox value="Data">Дата</Checkbox>
                        </Col>
                        <Col span={8}>
                            <Checkbox value="address">Адрес аптеки</Checkbox>
                        </Col>
                        <Col span={8}>
                            <Checkbox value="performer">Исполнитель</Checkbox>
                        </Col>
                    </Row>
                </Checkbox.Group>
                {checkBox.includes('performer') ? <TreeSelect
                    style={{width: '100%', marginTop: 20}}
                    value={valueName}
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    treeData={treeData}
                    placeholder="Выберите по имени "
                    treeDefaultExpandAll
                    onChange={onSelectName}
                /> : null}

                {checkBox.includes('address') ? <TreeSelect
                    style={{width: '100%', marginTop: 20}}
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    placeholder="Выбор Аптеки"
                    treeData={address}
                    treeDefaultExpandAll
                    onChange={onSelectAddress}
                /> : null}

                {checkBox.includes('Data') ? <Space
                        direction="vertical"
                        size={12}
                        style={{marginTop: 20}}
                    >
                        <RangePicker onChange={onSelectDate}/>
                    </Space>
                    : null}

            </Drawer>

            <Table
                columns={columns}
                rowClassName={(record) => (record.status ? "disable" : "")}
                loading={loading}
                bordered
                dataSource={data?.map((statement, index) => ({
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

                onRow={(record) => ({
                    onContextMenu: (event) => handleContextMenu(event, record),
                })}
            />
            <Menu id={MENU_ID}>
                {user?.role.name === 'admin' ?
                    <Item id="Выполнить" onClick={handleItemClick}>
                <span  className={style.item}>
                    <CheckOutlined style={{marginRight:5}}/>
                    Принять заявку
                </span>
                    </Item> : null}

                <Item id="Редактировать" onClick={handleItemClick}>

                <span className={style.item}>
                    <EditOutlined style={{marginRight:5}}/>
                    Завершить заявку
                </span>
                </Item>

                <Separator />
                <Item id="Удалить" onClick={handleItemClick}>
                <span style={{color:'#dc4234'}}>
                    <DeleteOutlined style={{marginRight:5}}/>
                    Удалить заявку
                </span>
                </Item>
            </Menu>
        </>
    );
};

export default Statement;


