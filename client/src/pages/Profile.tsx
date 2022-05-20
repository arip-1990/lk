import React from "react";
import { Row, Col, Card, Tabs, Button } from "antd";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { User, Test, WorkerTest } from "../templates";
import { API_URL } from "../services/api";
import Claim from "../templates/profile/Claim";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<string>("1");
  const [testType, setTestType] = React.useState<string>("base");
  const { user } = useAuth();
  const location = useLocation();
  const state = location.state as LocationState;

  React.useEffect(() => setActiveTab(state?.key || "1"), [location.state]);

  const handleTabClick = (key: string) => {
    setActiveTab(key);
  };

  return (
    <Row style={{ flex: 1 }}>
      <Col span={24}>
        <Card style={{ height: "100%" }}>
          <Tabs
            style={{ color: "#22aca6" }}
            onTabClick={handleTabClick}
            activeKey={activeTab}
            tabBarExtraContent={
              user?.role.name === "admin" &&
              (activeTab == "2" || activeTab == "3") ? (
                <Button type="primary">
                  <a
                    href={
                      `${API_URL}/export/` +
                      (activeTab == "2" ? `test/${testType}` : "claim")
                    }
                  >
                    Выгрузка в Excel
                  </a>
                </Button>
              ) : null
            }
          >
            <Tabs.TabPane tab="Личные данные" key="1">
              <User />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Результаты тестов" key="2">
              {user?.role.name === "worker" ? (
                <Test
                  user={{
                    id: user.id,
                    name: `${user.firstName} ${user.lastName}`,
                  }}
                  onChangeTestType={(type) => console.log(type)}
                />
              ) : (
                <WorkerTest onChangeTestType={(type) => setTestType(type)} />
              )}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Претензии к поставщикам" key="3">
              <Claim />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </Col>
    </Row>
  );
};

export default Profile;
