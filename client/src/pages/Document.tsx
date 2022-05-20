import React from "react";
import { Row, Col, Card, Table, Button, Modal, Form, Input } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { ICategory } from "../models/ICategory";
import { useAuth } from "../hooks/useAuth";
import { Upload } from "../components";
import { IDocument } from "../models/IDocument";

const Document: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = React.useState<ICategory[]>([]);
  const [documents, setDocuments] = React.useState<IDocument[]>([]);
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [addLoading, setAddLoading] = React.useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);
  const [file, setFile] = React.useState<File>();
  const { id } = useParams();
  const [form] = Form.useForm();

  const tableColumns = [
    {
      dataIndex: "index",
      align: "center" as "center",
    },
    {
      dataIndex: "name",
      render: (text: IDocument | ICategory) =>
        "name" in text ? (
          <Link
            style={{ fontSize: "1.2rem" }}
            to={`/${text.type}/${text.id}`}
            state={{ category: text }}
          >
            {text.name}
          </Link>
        ) : "title" in text ? (
          text.url ? (
            <a style={{ fontSize: "1.2rem" }} href={text.url}>
              {text.title}
              {user?.role.name === "admin" ? (
                <DeleteOutlined
                  onClick={(e) => handleDeleteDocument(e, text.id)}
                  disabled={deleteLoading}
                />
              ) : null}
            </a>
          ) : (
            <span>{text.title}</span>
          )
        ) : (
          <span>{text[0]}</span>
        ),
    },
  ];

  React.useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await api.get<{
        categories: ICategory[];
        documents: IDocument[];
      }>("/document/" + id);
      setCategories(response.data.categories);
      setDocuments(response.data.documents);
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddDocument = async (values: any) => {
    if (!file) return;
    setAddLoading(true);
    try {
      const formData = new FormData();
      formData.set("name", values.name);
      formData.set("file", file);

      await api.post("/document/" + id, formData);
      fetchDocument();
      setModalVisible(false);
    } catch (e) {
      console.log(e);
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteDocument = async (event: React.MouseEvent, id: string) => {
    event.preventDefault();
    setDeleteLoading(true);
    try {
      await api.delete("/document/" + id);
      fetchDocument();
    } catch (e) {
      console.log(e);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Row style={{ width: 782, margin: "0 auto" }}>
      <Col>
        <Card
          style={{ padding: "0.25rem" }}
          extra={
            user?.role.name === "admin" ? (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
              />
            ) : null
          }
        >
          <Table
            size="small"
            style={{
              maxWidth: 720,
              border: "2px solid #22aca6",
              margin: "auto",
            }}
            rowClassName="ant-table-document-row"
            showHeader={false}
            pagination={false}
            columns={tableColumns}
            dataSource={[
              ...categories.map((category, i) => ({
                key: i + 1,
                index: i + 1,
                name: category,
              })),
              ...documents.map((document, i) => ({
                key: categories.length + i + 1,
                index: categories.length + i + 1,
                name: document,
              })),
            ]}
            bordered
          />
        </Card>
      </Col>

      <Modal
        title="Добавление документа"
        visible={modalVisible}
        okText="Добавить"
        cancelText="Отмена"
        okButtonProps={{
          htmlType: "submit",
          form: "documentForm",
          loading: addLoading,
        }}
        onCancel={() => setModalVisible(false)}
      >
        <Form
          form={form}
          id="documentForm"
          layout="vertical"
          autoComplete="off"
          onFinish={handleAddDocument}
        >
          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true }, { type: "string" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="file" label="Файл">
            <Upload accept=".pdf" changeFile={setFile} />
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
};

export default Document;
