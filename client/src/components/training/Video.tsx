import React from "react";
import { Col, Popconfirm, Typography } from "antd";
import {
  CloseCircleOutlined,
  FilePdfOutlined,
  ExpandOutlined,
  CompressOutlined,
} from "@ant-design/icons";
import ReactPlayer from "react-player";
import { useDeleteTrainingMutation } from "../../services/TrainingService";
import { useAuth } from "../../hooks/useAuth";
import { ITraining } from "../../models/ITraining";

interface PropsType {
  training: ITraining;
}

const Video: React.FC<PropsType> = ({ training }) => {
  const [fullscreen, setFullScreen] = React.useState<boolean>(false);
  const [deleteTraining] = useDeleteTrainingMutation();
  const { user } = useAuth();

  const handleDelete = async (id: string) => {
    deleteTraining(id);
  };

  return (
    <Col span={8} className={"training" + (fullscreen ? " training_full" : "")}>
      {user?.role.name === "admin" ? (
        <Popconfirm
          title="Вы уверены, что хотите удалить?"
          onConfirm={() => handleDelete(training.id)}
          okText="Да"
          cancelText="Нет"
        >
          <CloseCircleOutlined />
        </Popconfirm>
      ) : null}
      {training.type === "document" ? (
        <a href={training.link} target="_blank">
          <FilePdfOutlined style={{ width: "100%", fontSize: 128 }} />
          <Typography.Text
            type="secondary"
            style={{
              display: "inline-block",
              width: "100%",
              textAlign: "center",
            }}
          >
            ({training.title})
          </Typography.Text>
        </a>
      ) : ["youtube", "youtu.be", ".mp4", ".avi", ".mpeg"].some((item) =>
          training.link.toLocaleLowerCase().includes(item)
        ) ? (
        <ReactPlayer url={training.link} width="100%" height={220} controls />
      ) : (
        <div style={{ position: "relative" }}>
          {fullscreen ? (
            <CompressOutlined onClick={() => setFullScreen(false)} />
          ) : (
            <ExpandOutlined onClick={() => setFullScreen(true)} />
          )}
          <iframe
            width="100%"
            height={220}
            frameBorder={0}
            allow="fullscreen"
            src={training.link}
          />
        </div>
      )}
    </Col>
  );
};

export default Video;
