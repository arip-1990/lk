import React from "react";
import { Row, Col, Collapse } from "antd";
import Test from "./Test";
import { WorkerList } from "../../components";
import { useFetchWorkersQuery } from "../../services/WorkerService";
import { IWorkers } from "../../models/IWorker";
import { useAuth } from "../../hooks/useAuth";

export interface CurrentUserType {
  id: string;
  name: string;
}

interface PropsType {
  onChangeTestType: (value: string) => void;
}

const WorkerTest: React.FC<PropsType> = ({ onChangeTestType }) => {
  const { data: workers, isLoading } = useFetchWorkersQuery();
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = React.useState<CurrentUserType>({
    id: user?.id || "",
    name: `${user?.firstName} ${user?.lastName}`,
  });

  const handleClick = (user: CurrentUserType) => {
    setCurrentUser(user);
  };

  return (
    <Row>
      <Col span={24} className="scroll-list">
        {workers &&
          (workers.length > 1 ? (
            <Collapse bordered={false} accordion>
              {workers.map((worker: IWorkers, i: number) => (
                <Collapse.Panel
                  header={<h3 style={{ color: "#2b74b7" }}>{worker.store}</h3>}
                  key={i + 1}
                >
                  <WorkerList
                    loading={isLoading}
                    workers={worker.workers}
                    userId={currentUser.id}
                    onClick={handleClick}
                  />
                </Collapse.Panel>
              ))}
            </Collapse>
          ) : (
            <WorkerList
              loading={isLoading}
              workers={workers[0]?.workers}
              userId={currentUser.id}
              onClick={handleClick}
            />
          ))}
      </Col>
      <Col span={24} style={{ marginTop: "3rem" }}>
        <Test
          user={currentUser}
          onChangeTestType={(type) => onChangeTestType(type)}
        />
      </Col>
    </Row>
  );
};

export default WorkerTest;
