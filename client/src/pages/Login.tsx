import React from "react";
import { Card, Form, Input, Button } from "antd";
import { BarcodeOutlined } from "@ant-design/icons";
import LoginLayout from "../layouts/login";
import { useAuth } from "../hooks/useAuth";

const Login: React.FC = () => {
  const { login } = useAuth();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<any>();

  const onFinish = React.useCallback(async (values: { login: string }) => {
    setLoading(true);
    try {
      await login(values.login);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  }, []);

  const validator = async (_: any, value: any) => {
    if (!value.trim()) throw new Error("Пожалуйста введите штрих-код!");
    if (!/^[\d]+$/.test(value.trim()))
      throw new Error("Значение должно содержать только цифры!");
    if (value.trim().length > 13)
      throw new Error("Значение должно быть не больше 13 символов!");
  };

  return (
    <LoginLayout>
      <Card title="ЛИЧНЫЙ КАБИНЕТ СОТРУДНИКА" className="login">
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="login"
            rules={[{ validator }]}
            {...(error && {
              help: error.data,
              validateStatus: "error",
            })}
            style={{ width: "100%" }}
          >
            <Input
              autoFocus
              size="large"
              prefix={<BarcodeOutlined className="site-form-item-icon" />}
              placeholder="Введите штрих-код"
            />
          </Form.Item>

          <Button
            size="large"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Войти в личный кабинет
          </Button>
        </Form>
      </Card>
    </LoginLayout>
  );
};

export default Login;
