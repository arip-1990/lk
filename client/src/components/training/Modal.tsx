import React from "react";
import { Modal as BaseModal, Form, Select, Input } from "antd";
import { Upload } from "..";

interface PropsType {
    open: boolean;
    loading: boolean;
    onClose: () => void;
    onFormFinish: (values: any, file: File | undefined) => void;
  }
  
  const Modal: React.FC<PropsType> = ({ open, loading, onClose, onFormFinish }) => {
    const [type, setType] = React.useState<string>("video");
    const [file, setFile] = React.useState<File>();
    const [form] = Form.useForm();
  
    React.useEffect(() => {
      if (open) {
        form.resetFields();
        setFile(undefined);
      }
    }, [open]);
  
    const handleFinish = (values: any) => {
      onFormFinish(values, file);
      onClose();
    };
  
    const handleChangeType = (value: string) => {
      setType(value);
    };
  
    return (
      <BaseModal
        title="Добавление презентации или видео"
        visible={open}
        okText="Добавить"
        cancelText="Отмена"
        okButtonProps={{ htmlType: "submit", form: "trainingForm", loading }}
        onCancel={() => onClose()}
      >
        <Form
          form={form}
          id="trainingForm"
          layout="vertical"
          initialValues={{ type }}
          autoComplete="off"
          onFinish={handleFinish}
        >
          <Form.Item name="type" label="Тип" rules={[{ required: true }]}>
            <Select onChange={handleChangeType}>
              <Select.Option key={1} value="video">
                Видео
              </Select.Option>
              <Select.Option key={2} value="document">
                Документ
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="title"
            label="Название"
            rules={[{ required: true }, { type: "string" }]}
          >
            <Input />
          </Form.Item>
          {type === "video" ? (
            <Form.Item
              name="link"
              label="Ссылка"
              rules={[{ required: !file }, { type: "string", min: 6 }]}
            >
              <Input />
            </Form.Item>
          ) : null}
          <Form.Item name="file" label="Файл">
            <Upload changeFile={setFile} />
          </Form.Item>
        </Form>
      </BaseModal>
    );
  };

export default Modal;