import React from "react";
import { Card, Modal, Form, Input, Button, Select } from "antd";
import { useAuth } from "../hooks/useAuth";
import { useAddContactMutation } from "../services/ContactService";
import { userApi } from "../services/UserService";
import { Contact as BaseContact } from "../components";

const Contact: React.FC = () => {
  const { user } = useAuth();
  const { data: users, isLoading: fetchLoading } = userApi.useFetchUserQuery();
  const [addContact, { isLoading: addLoading }] = useAddContactMutation();
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [form] = Form.useForm();

  const handleAddContact = async (values: any) => {
    try {
      const formData = new FormData();
      values.contacts.forEach((item: string) =>
        formData.append("contacts[]", item)
      );
      formData.set("description", values.description);

      addContact(formData);
      setModalVisible(false);
    } catch (e) {
      console.log(e);
    } finally {
      form.resetFields();
    }
  };

  const handleSearch = (input: string, option: any) => {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  return (
    <Card
      style={{ padding: "0.25rem" }}
      extra={
        user?.role.name === "admin" ? (
          <Button type="primary" onClick={() => setModalVisible(true)}>
            Добавить
          </Button>
        ) : null
      }
    >
      <BaseContact />

      <Modal
        title="Добавление пользователя"
        visible={modalVisible}
        okText="Добавить"
        cancelText="Отмена"
        okButtonProps={{
          htmlType: "submit",
          form: "contactForm",
          loading: addLoading,
        }}
        onCancel={() => setModalVisible(false)}
      >
        <Form
          form={form}
          id="contactForm"
          layout="vertical"
          autoComplete="off"
          onFinish={handleAddContact}
        >
          <Form.Item
            name="contacts"
            label="К кому обращаться"
            rules={[{ required: true, message: "Выберите пользователя" }]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Выберите пользователей"
              filterOption={handleSearch}
              loading={fetchLoading}
            >
              {users?.map((user) => (
                <Select.Option
                  key={user.id}
                  value={user.id}
                >{`${user.firstName} ${user.lastName}`}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Описание проблемы (ситуаций)"
            rules={[{ required: true }, { type: "string" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Contact;
