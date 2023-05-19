import React from "react";
import { Row, Col, Card, Tabs, Button } from "antd";
import { useLocation } from "react-router-dom";
import type { TabsProps } from 'antd';

import { useAuth } from "../hooks/useAuth";
import { User, Test, WorkerTest } from "../templates";
import { API_URL } from "../services/api";
import Claim from "../templates/profile/Claim";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<string>("1");
  const [testType, setTestType] = React.useState<string>("base");
  const { user } = useAuth();
  const {state} = useLocation();

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Личные данные',
      children: <User />,
    },
    {
      key: '2',
      label: 'Результаты тестов',
      children: user?.role.name === "worker" ? (
        <Test
          user={{
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
          }}
          onChangeTestType={(type) => console.log(type)}
        />
      ) : (
        <WorkerTest onChangeTestType={(type) => setTestType(type)} />
      ),
    },
    {
      key: '3',
      label: 'Претензии к поставщикам',
      children: <Claim />,
    },
  ];

  React.useEffect(() => setActiveTab(state?.key || "1"), [state]);

  const handleChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <Row style={{ flex: 1 }}>
      <Col span={24}>
        <Card style={{ height: "100%" }}>
          <Tabs
            style={{ color: "#22aca6" }}
            onChange={handleChange}
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
          
            items={items}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Profile;
