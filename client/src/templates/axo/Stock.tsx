import { FC, useState } from "react";
import {
  Row,
  Col,
  Modal,
  Form,
  Input,
  DatePicker,
  Switch,
  Upload,
  Button,
} from "antd";
import { PaperClipOutlined, UploadOutlined } from "@ant-design/icons";
import moment from "moment";

import { useAuth } from "../../hooks/useAuth";
import { IStatement } from "../../models/IStatement";
import { useFetchStatementsQuery } from "../../services/StatementService";
import { Statement } from "../../components";
import { IUser } from "../../models/IUser";

interface IProps {
  id: number;
  loading?: boolean;
  onEdit: (id: string, data: FormData) => void;
  onDelete: (id: string) => void;
}

interface IFormEditData {
  id?: string;
  comment?: string;
  doneAt?: moment.Moment;
  status?: boolean;
  medias?: any[];
}

const Stock: FC<IProps> = ({ id, loading, onEdit, onDelete }) => {
  const { user } = useAuth();
  const [form] = Form.useForm<IFormEditData>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const { data, isLoading } = useFetchStatementsQuery({
    categoryId: id,
    pagination,
  });

  const columns = [
    {
      title: "№",
      dataIndex: "index",
      align: "center" as "center",
    },
    {
      title: "Дата",
      width: 100,
      align: "center" as "center",
      dataIndex: "createdAt",
      render: (date: moment.Moment) => <p>{date.format("DD MMM YYYY")}</p>,
    },
    {
      title: "Адрес аптеки",
      width: 180,
      align: "center" as "center",
      dataIndex: "store",
      render: (store: { id: string; name: string } | undefined) => (
        <p>{store?.name || "Офис"}</p>
      ),
    },
    {
      title: "Описание проблемы",
      dataIndex: "must",
      align: "center" as "center",
      render: (text: string | undefined) => <p>{text}</p>,
    },
    {
      title: "Вложение",
      dataIndex: "media",
      align: "center" as "center",
      render: (media: string | undefined) =>
        media ? (
          <a href={media} style={{ fontSize: "1.5rem" }}>
            <PaperClipOutlined />
          </a>
        ) : null,
    },
    {
      title: "Заявитель",
      dataIndex: "applicant",
      align: "center" as "center",
      render: (user: IUser) => (
        <p>
          {user &&
            user.firstName + (user.lastName && ` ${user.lastName.charAt(0)}.`)}
        </p>
      ),
    },
    {
      title: "Комментарий",
      dataIndex: "comment",
      align: "center" as "center",
      render: (text: string | undefined) => <p>{text}</p>,
    },
    {
      title: "Вложение склада",
      dataIndex: "answerMedia",
      align: "center" as "center",
      render: (media: string | undefined) =>
        media ? (
          <a href={media} style={{ fontSize: "1.5rem" }}>
            <PaperClipOutlined />
          </a>
        ) : null,
    },
    {
      title: "Дата исполнения",
      dataIndex: "doneAt",
      align: "center" as "center",
      render: (date: moment.Moment | undefined) => (
        <p>{date?.format("DD MMM YYYY")}</p>
      ),
    },
    {
      title: "Исполнитель",
      dataIndex: "performer",
      align: "center",
      render: (user: IUser | undefined) => (
        <p>
          {user &&
            user.firstName + (user.lastName && ` ${user.lastName.charAt(0)}.`)}
        </p>
      ),
    },
  ];

  const handleChangePagination = (currentPage: number, pageSize: number) => {
    setPagination({ current: currentPage, pageSize });
  };

  const handleEdit = (data: IStatement) => {
    form.setFieldsValue({
      id: data.id,
      comment: data.comment,
      doneAt: data.doneAt,
      status: data.status,
    });
    setModalVisible(true);
  };

  const resetData = () => {
    form.resetFields();
    setModalVisible(false);
  };

  const handleForm = async (values: any) => {
    try {
      const formData = new FormData();
      formData.set("comment", values.comment);
      values.doneAt &&
        formData.set(
          "doneAt",
          values.doneAt < moment() ? moment() : values.doneAt
        );
      formData.set("status", values.status);

      if (values.answerMedias) {
        values.answerMedias.forEach((item: any) =>
          formData.append("answerMedias[]", item.originFileObj)
        );
      }

      onEdit(values.id, formData);
    } catch (e) {
      console.log(e);
    } finally {
      resetData();
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  return (
    <>
      <Statement
        columns={columns}
        data={data?.data || []}
        loading={isLoading || loading}
        pagination={{
          currentPage: data?.meta.current_page || pagination.current,
          pageSize: data?.meta.per_page || pagination.pageSize,
          total: data?.meta.total || 0,
          onChange: handleChangePagination,
        }}
        onDelete={onDelete}
        handleEdit={handleEdit}
      />

      <Modal
        title={"Редактирование заявки"}
        open={modalVisible}
        okText="Добавить"
        cancelText="Отмена"
        okButtonProps={{
          htmlType: "submit",
          form: "exploitationForm",
          loading: loading,
        }}
        onCancel={resetData}
      >
        <Form
          form={form}
          id="exploitationForm"
          layout="vertical"
          autoComplete="off"
          onFinish={handleForm}
        >
          <Form.Item name="id" noStyle>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="comment" label="Комментарий">
            <Input.TextArea />
          </Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item name="doneAt" label="Дата исполнения">
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              {user?.role.name === "admin" ? (
                <Form.Item
                  name="status"
                  label="Завершен"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              ) : null}
            </Col>
          </Row>
          <Form.Item
            name="answerMedias"
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
    </>
  );
};

export default Stock;
