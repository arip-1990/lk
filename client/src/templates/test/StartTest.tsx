import React from "react";
import { Button, Modal } from "antd";

interface PropsType {
  timer: string;
  handleStart: () => void;
}

const StartTest: React.FC<PropsType> = ({ timer, handleStart }) => {
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    handleStart();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <p style={{ fontSize: "1.2rem" }}>Ограничение по времени: {timer} мин.</p>
      <p style={{ textAlign: "center" }}>
        <Button
          type="primary"
          onClick={showModal}
        >
          Начать тестирование
        </Button>
      </p>
      <Modal
        title="Подтверждение"
        centered
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Отмена
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Начать попытку
          </Button>,
        ]}
      >
        <p>Прохождение теста ограничено по времени.</p>
        <p>Вы уверены, что хотите пройти тест сейчас?</p>
      </Modal>
    </>
  );
};

export { StartTest };
