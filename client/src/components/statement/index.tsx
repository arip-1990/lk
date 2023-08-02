import {FC, useState} from "react";
import {Form, Table, TablePaginationConfig} from "antd";

import { IStatement } from "../../models/IStatement";

import {Menu, Item, Separator, useContextMenu, ItemParams} from 'react-contexify';
import moment from "moment/moment";
import {
    CheckOutlined,
    DeleteOutlined,
    EditOutlined,
} from "@ant-design/icons";
import {useAddPerformerMutation} from "../../services/StatementService";
import {useAuth} from "../../hooks/useAuth";
import style from "./Statement.module.scss"
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
    }) => {
    const { user } = useAuth();

    const [performer] = useAddPerformerMutation()

    // const [form] = Form.useForm<IFormEditData>();

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
                    await performer(props.key).unwrap();
                }catch (error) {
                    console.log(error)
                }
                break;

            case "Редактировать":
                handleEdit(props.props)
                break

            case "Удалить":
                onDelete(props.key)
                break
        }
    }


    return (
    <>
    <Table
      columns={columns}
      rowClassName={(record) => (record.status ? "disable" : "")}
      loading={loading}
      bordered
      dataSource={data.map((statement, index) => ({
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
                    Выполнить
                </span>
            </Item> : null}

            <Item id="Редактировать" onClick={handleItemClick}>

                <span className={style.item}>
                    <EditOutlined style={{marginRight:5}}/>
                    Редактировать
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
