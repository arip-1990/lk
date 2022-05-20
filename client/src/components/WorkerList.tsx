import React from "react";
import { List, Skeleton, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { CurrentUserType } from "../templates/profile/WorkerTest";
import { IWorker } from "../models/IWorker";

interface PropsType {
  workers: IWorker[];
  userId: string;
  loading?: boolean;
  onClick?: (user: CurrentUserType) => void;
}

const WorkerList: React.FC<PropsType> = ({
  workers,
  userId,
  loading,
  onClick,
}) => {
  const handleClick = (user: CurrentUserType) => (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    onClick && onClick(user);
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={workers}
      renderItem={(worker) => (
        <List.Item>
          <Skeleton avatar title={false} loading={loading} active>
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={
                <a
                  className={userId === worker.id ? "active" : ""}
                  href="/"
                  onClick={handleClick({
                    id: worker.id,
                    name: `${worker.firstName} ${worker.lastName}`,
                  })}
                >
                  {`${worker.firstName} ${worker.lastName}`}
                </a>
              }
              description={worker.position}
            />
            <div>{`Процент правильных ответов: ${worker.percent}%`}</div>
          </Skeleton>
        </List.Item>
      )}
    />
  );
};

export default WorkerList;
