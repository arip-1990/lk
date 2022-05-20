import React from "react";
import { Row, Card, Button, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useFetchTrainingQuery } from "../../services/TrainingService";
import { useAuth } from "../../hooks/useAuth";
import Video from "./Video";

interface PropsType {
  id: string;
  onModal: () => void;
}

const Training: React.FC<PropsType> = ({ id, onModal }) => {
  const [type, setType] = React.useState<string>("video");
  const { data: trainings } = useFetchTrainingQuery({ id, type });
  const { user } = useAuth();

  return (
    <Card
      title={
        <Select
          defaultValue={type}
          bordered={false}
          onChange={(value) => setType(value)}
        >
          <Select.Option value="video">Видео</Select.Option>
          <Select.Option value="document">Документ</Select.Option>
        </Select>
      }
      extra={
        user?.role.name === "admin" ? (
          <Button type="primary" icon={<PlusOutlined />} onClick={onModal} />
        ) : null
      }
      style={{ padding: "0.25rem" }}
    >
      <Row gutter={[32, 32]}>
        {trainings?.length
          ? trainings.map((training) => (
              <Video key={training.id} training={training} />
            ))
          : null}
      </Row>
    </Card>
  );
};

export default Training;
