import { FC, useState } from "react";
import {
  Row,
  Col,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  Switch,
  Upload,
  Button,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PaperClipOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import moment from "moment";

import { useAuth } from "../../hooks/useAuth";
import { IStatement } from "../../models/IStatement";
import { useFetchStatementsQuery } from "../../services/StatementService";
import { Statement } from "../../components";

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

const Rejection: FC<IProps> = ({ id, loading, onEdit, onDelete }) => {
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
        <p>{store?.name || 'Офис'}</p>
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
      render: (user: { id: string; name: string }) => <p>{user.name}</p>,
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
      title: "",
      width: 80,
      align: "center" as "center",
      dataIndex: "operation",
      render: (_: any, record: IStatement) => (
        <Space>
          <EditOutlined
            style={{ color: "#2b74b7" }}
            onClick={() => handleEdit(record)}
          />
          <DeleteOutlined
            style={{ color: "#dc4234" }}
            onClick={() => onDelete(record.id)}
          />
        </Space>
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
      />

      <Modal
        title={"Редактирование заявки"}
        open={modalVisible}
        okText="Добавить"
        cancelText="Отмена"
        okButtonProps={{
          htmlType: "submit",
          form: "rejectionForm",
          loading: loading,
        }}
        onCancel={resetData}
      >
        <Form
          form={form}
          id="rejectionForm"
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

export default Rejection;