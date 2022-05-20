import React from "react";
import { Card, Button, Modal, Form, Select, Input, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Media as BaseMedia } from "./Media";
import {
  useFetchMediaQuery,
  useAddMediaMutation,
} from "../../services/MediaService";
import { ICategory } from "../../models/ICategory";
import { Category } from "./Category";
import { Upload } from "..";

type Props = {
  store: string | null;
  category?: ICategory;
};

const Media: React.FC<Props> = ({ store, category }) => {
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const { data: medias, isLoading } = useFetchMediaQuery(
    { category: String(category?.id) || "", store },
    { skip: !category }
  );
  const [addMedia, { isLoading: isAddLoading }] = useAddMediaMutation();
  const [file, setFile] = React.useState<File>();
  const [form] = Form.useForm();

  const handleAddMedia = async (values: any) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.set("title", values.title);
      formData.set("file", file);

      addMedia({
        category: values.category,
        store: !store || store === "all" ? null : store,
        data: formData,
      });
      setModalVisible(false);
    } catch (e) {
      console.log(e);
    } finally {
      form.resetFields();
    }
  };

  if (category?.children.length) {
    return (
      <Card style={{ padding: "0.25rem" }} loading={isLoading}>
        <Category store={store || "all"} categories={category.children} />
      </Card>
    );
  }

  return (
    <Card
      style={{ padding: "0.25rem" }}
      loading={isLoading}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        />
      }
    >
      {medias?.length ? (
        <BaseMedia data={medias} />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}

      <Modal
        title="Добавление медиа"
        visible={modalVisible}
        okText="Добавить"
        cancelText="Отмена"
        okButtonProps={{
          htmlType: "submit",
          form: "mediaForm",
          loading: isAddLoading,
        }}
        onCancel={() => setModalVisible(false)}
      >
        <Form
          form={form}
          id="mediaForm"
          layout="vertical"
          autoComplete="off"
          onFinish={handleAddMedia}
        >
          <Form.Item
            name="title"
            label="Название"
            rules={[{ required: true }, { type: "string" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="Категория"
            initialValue={category?.id}
          >
            <Select disabled>
              <Select.Option value={category?.id}>
                {category?.name}
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="file" label="Файл">
            <Upload changeFile={setFile} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Media;
