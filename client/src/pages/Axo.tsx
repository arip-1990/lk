import React from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Select,
  Input,
  DatePicker,
  Upload,
  Switch,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Statement } from "../components";
import { statementApi } from "../services/StatementService";
import { useFetchStoresQuery } from "../services/StoreService";
import { useAuth } from "../hooks/useAuth";
import { IStatement } from "../models/IStatement";
import moment from "moment";

const Axo: React.FC = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [editData, setEditData] = React.useState<IStatement>();
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const { data: stores } = useFetchStoresQuery();
  const [
    addStatement,
    { isLoading: addLoading },
  ] = statementApi.useAddStatementMutation();
  const [
    updateStatement,
    { isLoading: updateLoading },
  ] = statementApi.useUpdateStatementMutation();
  const { user } = useAuth();

  React.useEffect(() => {
    if (editData) form.resetFields();
  }, [editData]);

  const handleForm = async (values: any) => {
    try {
      if (editData) {
        values.doneAt = values.doneAt < moment() ? moment() : values.doneAt;
        updateStatement({ id: editData.id, data: values });
      } else {
        if (id) {
          const formData = new FormData();
          values.store && formData.set("store", values.store);
          formData.set("must", values.must);

          if (values.medias) {
            values.medias.forEach((item: any) =>
              formData.append("media[]", item.originFileObj)
            );
          }
          addStatement({ id: id, data: formData });
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      onCancel();
      form.resetFields();
    }
  };

  const onCancel = () => {
    setModalVisible(false);
    setEditData(undefined);
  };

  const handleEdit = (data: IStatement) => {
    setEditData(data);
    setModalVisible(true);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  return (
    <Card
      title={
        id === "67"
          ? "Заявка в отдел эксплуатации"
          : "Заявка в отдел информационных технологий"
      }
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        />
      }
    >
      <Statement id={Number(id)} onEdit={handleEdit} />

      <Modal
        title={editData ? "Редактирование заявки" : "Новая заявка"}
        visible={modalVisible}
        okText="Добавить"
        cancelText="Отмена"
        okButtonProps={{
          htmlType: "submit",
          form: "axoForm",
          loading: addLoading || updateLoading,
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
          {editData ? (
            <>
              <Form.Item
                name="comment"
                label="Комментарий"
                initialValue={editData.comment}
              >
                <Input.TextArea />
              </Form.Item>
              <Row>
                <Col span={12}>
                  <Form.Item
                    name="doneAt"
                    label="Дата исполнения"
                    initialValue={editData.doneAt}
                  >
                    <DatePicker />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {user?.role.name === "admin" ? (
                    <Form.Item
                      name="status"
                      label="Завершен"
                      valuePropName="checked"
                      initialValue={editData.status}
                    >
                      <Switch />
                    </Form.Item>
                  ) : null}
                </Col>
              </Row>
            </>
          ) : (
            <>
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
            </>
          )}
        </Form>
      </Modal>
    </Card>
  );
};

export default Axo;
