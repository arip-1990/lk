import React, { FC, useState, MouseEvent } from "react";
import { useParams } from "react-router-dom";
import {Card, Button, Modal, Form, Select, Input, Upload, Space, RadioChangeEvent} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";

import {
  useAddStatementMutation,
  useUpdateStatementMutation,
  useDeleteStatementMutation,
} from "../services/StatementService";
import { useFetchStoresQuery } from "../services/StoreService";
import { useAuth } from "../hooks/useAuth";
import { API_URL } from "../services/api";
import It from "../templates/axo/It";
import Stock from "../templates/axo/Stock";
import Support from "../templates/axo/Support";
import Exploitation from "../templates/axo/Exploitation";
import Rejection from "../templates/axo/Rejection";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatePicker } from 'antd';
import {Moment} from "moment";
dayjs.extend(customParseFormat);
const monthFormat = 'YYYY';

import { Drawer, Radio } from 'antd';
import type { DrawerProps } from 'antd/es/drawer';

import { Checkbox, Col, Row } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

const Axo: FC = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [exportModal, setExportModal] = useState<boolean>(false);
  const { data: stores } = useFetchStoresQuery();
  const [addStatement, { isLoading: addLoading }] = useAddStatementMutation();
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const [
    updateStatement,
    { isLoading: updateLoading },
  ] = useUpdateStatementMutation();
  const [
    deleteStatement,
    { isLoading: deleteLoading },
  ] = useDeleteStatementMutation();
  const { user } = useAuth();

  const handleForm = async (values: any) => {
    try {
      if (id) {
        const formData = new FormData();
        values.store && formData.set("store", values.store);
        formData.set("must", values.must);

        if (values.medias) {
          values.medias.forEach((item: any) =>
            formData.append("medias[]", item.originFileObj)
          );
        }
        addStatement({ id, data: formData });
      }
    } catch (e) {
      console.log(e);
    } finally {
      onCancel();
    }
  };

  const handleEdit = (id: string, data: FormData) => {
    updateStatement({ id, data });
  };

  const onCancel = () => {
    setExportModal(false);
    setModalVisible(false)
    // form.resetFields();
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  const handleExport = (e: MouseEvent) => {
    // e.preventDefault();
    const date = selectedDate?.year();
    if  (date){
      window.location.href = `${API_URL}/export/statement/${id}/?year=${date}`;
      console.log(date)
    }else{
      window.location.href = `${API_URL}/export/statement/${id}`;
    }
    setExportModal(false);
  };

  const getTitle = (id: string) => {
    switch (id) {
      case "67":
        return "Заявка в отдел эксплуатации";
      case "68":
        return "Заявка в отдел информационных технологий";
      case "86":
        return "Заявка в техническую поддержку";
      case "88":
        return "Забраковка";
      default:
        return "Описание проблемы";
    }
  };

  const getTemplate = (id: string) => {
    switch (id) {
      case "67":
        return (
          <Exploitation
            id={Number(id)}
            loading={addLoading || updateLoading || deleteLoading}
            onEdit={handleEdit}
            onDelete={deleteStatement}
          />
        );
      case "68":
        return (
          <It
            id={Number(id)}
            loading={addLoading || updateLoading || deleteLoading}
            onEdit={handleEdit}
            onDelete={deleteStatement}
          />
        );
      case "86":
        return (
          <Support
            id={Number(id)}
            loading={addLoading || updateLoading || deleteLoading}
            onEdit={handleEdit}
            onDelete={deleteStatement}
          />
        );
      case "87":
        return (
          <Stock
            id={Number(id)}
            loading={addLoading || updateLoading || deleteLoading}
            onEdit={handleEdit}
            onDelete={deleteStatement}
          />
        );
        case "88":
        return (
          <Rejection
            id={Number(id)}
            loading={addLoading || updateLoading || deleteLoading}
            onEdit={handleEdit}
            onDelete={deleteStatement}
          />
        );
      default:
        return null;
    }
  };

  // export
  const disabledDate = (current: Moment | null) => {
    const restrictedYear = 2024;
    const currentYear = current.year();
    return currentYear >= restrictedYear;
  };

  const handleDateChange = (date: Moment | null, dateString: string) => {
    setSelectedDate(date);
  };
  // end export



  return (
    <Card
      title={id && getTitle(id)}
      extra={

        <Space>
          {user?.role.name !== "worker" ? (
            <Button
              type="link"
              style={{ color: "#22aca6" }}
              icon={<FileExcelOutlined />}
              // onClick={handleExport}
              onClick={() => setExportModal(true)}
            />

          ) : null}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          />
        </Space>
      }
    >


      {id && getTemplate(id)}

      <Modal
          title={"Экпорт заявок"}
          open={exportModal}
          okText="Скачать"
          cancelText="Отмена"
          okButtonProps={{
            htmlType: "submit",
            form: "axoForm",
            loading: addLoading,
          }}
          onCancel={onCancel}
      >

        <Form
            form={form}
            id="axoForm"
            layout="vertical"
            autoComplete="off"
            onFinish={handleExport}
        >
          <Form.Item name='data' label='Выбeрите за какой год необходимо сделать экспорт заявок'>
            <DatePicker
                value={selectedDate}
                format={monthFormat}
                picker="year"
                disabledDate = {disabledDate}
                onChange={handleDateChange}
            />
          </Form.Item>
        </Form>
      </Modal>


      <Modal
        title={"Новая заявка"}
        open={modalVisible}
        okText="Добавить"
        cancelText="Отмена"
        okButtonProps={{
          htmlType: "submit",
          form: "axoForm",
          loading: addLoading,
        }}
        onCancel={onCancel}
      >
        <Form
          form={form}
          id="axoForm"
          layout="vertical"
          autoComplete="off"
          onFinish={handleForm}
        >
          <Form.Item name="store" label="Адрес аптеки">
            <Select
              options={
                stores && [
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
                  { label: "Офис", value: "" },
                ]
              }
            />
          </Form.Item>
          <Form.Item name="must" label="Что необходимо выполнить">
            <Input />
          </Form.Item>
          <Form.Item
            name="medias"
            label="Вложение"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload multiple beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Выберите файл</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

    </Card>
  );
};

export default Axo;
