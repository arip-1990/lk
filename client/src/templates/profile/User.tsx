import React from "react";
import { Form, Input, Row, Col, Avatar, Select } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";

const User: React.FC = () => {
  const { user } = useAuth();

  const initialValues = {
    lastName: user?.lastName,
    firstName: user?.firstName,
    middleName: user?.middleName,
    phone: user?.mobilePhone,
    email: user?.email,
    post: user?.post,
  };

  return (
    <Row gutter={24}>
      <Col span={8} style={{ textAlign: "center" }}>
        <Avatar size={128} icon={<UserOutlined />} />
      </Col>
      <Col span={16}>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={initialValues}
          style={{ alignItems: "normal" }}
        >
          <Form.Item label="Фамилия" name="lastName">
            <Input readOnly={true} />
          </Form.Item>
          <Form.Item label="Имя" name="firstName">
            <Input readOnly={true} />
          </Form.Item>
          <Form.Item label="Отчество" name="middleName">
            <Input readOnly={true} />
          </Form.Item>
          <Form.Item label="Телефон" name="phone">
            <Input readOnly={true} />
          </Form.Item>
          <Form.Item label="Почта" name="email">
            <Input readOnly={true} />
          </Form.Item>
          <Form.Item label="Должность" name="post">
            <Input readOnly={true} />
          </Form.Item>
          <Form.Item label="Аптека">
            <Select
              mode="multiple"
              open={false}
              value={user?.stores.map((item) => item.name)}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default User;
