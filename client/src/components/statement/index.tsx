import { FC, useState } from "react";
import { Button, Table, TablePaginationConfig, message } from "antd";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  Menu,
  Item,
  Separator,
  useContextMenu,
  ItemParams,
} from "react-contexify";

import { IStatement } from "../../models/IStatement";
import { useAddPerformerMutation } from "../../services/StatementService";
import { useAuth } from "../../hooks/useAuth";

import Sorting from "./Sorting";
import type { FormData } from "./Sorting";

import style from "./Statement.module.scss";

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
  onDelete: (id: string) => void;
  handleEdit: (data: IStatement) => void;
}

const MENU_ID = "context-menu";

const Statement: FC<IProps> = ({
  columns,
  data,
  loading,
  pagination,
  onDelete,
  handleEdit,
}) => {
  const { user } = useAuth();
  const [showSorting, setShowSorting] = useState(false);
  const [performer] = useAddPerformerMutation();

  const onSorting = (values: FormData) => {
    setShowSorting(false);
    console.log(values);
  };

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

  function handleContextMenu(event: any, props: any) {
    const { key } = props;
    show({ event, props: { key, props } });
  }

  const handleItemClick = async ({ id, props }: ItemParams) => {
    switch (id) {
      case "Выполнить":
        try {
          await performer(props?.key).unwrap();
        } catch (error) {
          console.log(error);
        }
        break;

      case "Редактировать":
        try {
          if (user?.id === props.props.performer.id) {
            handleEdit(props?.props);
          } else {
            message.success({
              content: "Вы не можете редактировать данную заявку !",
              icon: (
                <ExclamationCircleOutlined
                  style={{ fontSize: "24px", color: "red" }}
                />
              ),
              type: "error",
              duration: 2,
              style: {
                fontSize: "18px",
              },
            });
          }
          break;
        } catch (error) {
          message.success({
            content: "Для редактирования заявки необходимо ее принять !",
            icon: (
              <ExclamationCircleOutlined
                style={{ fontSize: "24px", color: "red" }}
              />
            ),
            type: "error",
            duration: 2,
            style: {
              fontSize: "18px",
            },
          });
          break;
        }

      case "Удалить":
        onDelete(props?.key);
        break;
    }
  };

  return (
    <>
      <Button
        type="primary"
        style={{ marginBottom: 14, marginTop: -6 }}
        onClick={() => setShowSorting(true)}
        disabled
      >
        Сортировка
      </Button>

      <Sorting
        show={showSorting}
        onHide={() => setShowSorting(false)}
        onSorting={onSorting}
      />

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
        {user?.role.name === "admin" ? (
          <Item id="Выполнить" onClick={handleItemClick}>
            <span className={style.item}>
              <CheckOutlined style={{ marginRight: 5 }} />
              Принять заявку
            </span>
          </Item>
        ) : null}

        <Item id="Редактировать" onClick={handleItemClick}>
          <span className={style.item}>
            <EditOutlined style={{ marginRight: 5 }} />
            Завершить заявку
          </span>
        </Item>

        <Separator />
        <Item id="Удалить" onClick={handleItemClick}>
          <span style={{ color: "#dc4234" }}>
            <DeleteOutlined style={{ marginRight: 5 }} />
            Удалить заявку
          </span>
        </Item>
      </Menu>
    </>
  );
};

export default Statement;
